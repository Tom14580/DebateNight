const { createNewRoom, getAllRooms, getRoom, addUser, setStatus, removeUser, deleteRoom, updateSide, updateSocketId, addMessage } = require('../data/rooms');
const disconnectTimers = new Map();

async function handleLeave(userId, roomId, io, socket) {
    let room;
    try {
        room = await getRoom(roomId);
    } catch (error) {
        if (socket) socket.emit("error", { message: error.message });
        console.error("Error in handleLeave getRoom:", error);
        return;
    }
    if (!room) {
        return;
    }

    const user = room.users.find(u => u.userId === userId);
    if (!user) {
        return;
    }

    const debateStarted = room.status === "in-progress";

    if (debateStarted) {
        io.to(roomId).emit("debate-ended", { message: `${user.displayName} left the debate. Room is closing.`})

        io.sockets.sockets.forEach(s => {
            if (s.rooms.has(roomId)) {
                s.leave(roomId);
            }
        });
        try {
            await deleteRoom(roomId);
        } catch (error) {
            if (socket) socket.emit("error", { message: error.message });
            console.error("Failed to delete room in handleLeave");
            return
        }
    } else {
        try {
            await removeUser(roomId, userId);
        } catch (error) {
            if (socket) socket.emit("error", { message: error.message });
            console.error("Failed to remove user in handleLeave:", error);
            return
        }

        let finalRoom;
        try {
            finalRoom = await getRoom(roomId);
        } catch (error) {
            if (socket) socket.emit("error", { message: error.message });
            console.error("Failed to get room in handleLeave:", error);
            return
        }

        if (!finalRoom || finalRoom.users.length === 0) {
            try {
                await deleteRoom(roomId);
            } catch (error) {
                if (socket) socket.emit("error", { message: error.message });
                console.error("Failed to delete room in handleLeave:", error);
                return
            }
        } else {
            io.to(roomId).emit("room-updated", { room: finalRoom });
            io.to(roomId).emit("user-disconnected", { user, room: finalRoom });
        }
    }
}

async function roomHandler(socket, io) {
    socket.on("join-room", async (data) => {
        let room;
        try {
            room = await getRoom(data.roomId);
        } catch (error) {
            socket.emit("error", { message: error.message });
            return;
        }
        if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
        }

        if (!room.users || !Array.isArray(room.users)) {
            room.users = [];
        }

        // Check if this is a reconnecting user (by userId, not displayName)
        const existingUser = data.userId ? room.users.find(u => {
            return u.userId === data.userId || u.userId === parseInt(data.userId);
        }) : null;
        
        if (existingUser) {
            // Clear any disconnect timer for this user
            if (disconnectTimers.has(existingUser.userId)) {
                clearTimeout(disconnectTimers.get(existingUser.userId));
                disconnectTimers.delete(existingUser.userId);
            }

            try {
                await updateSocketId(existingUser.userId, socket.id);
            } catch (error) {
                console.error(`Failed to update socket ID: ${error}`);
                socket.emit("error", { message: "Failed to reconnect" });
                return;
            }

            existingUser.socketId = socket.id;
            socket.join(room.id);
            
            socket.emit("room-updated", { room });
            
            io.to(room.id).emit("room-updated", { room });
            
            if (room.users.length === 2 && room.users.every(u => u.side !== null)) {
                socket.emit("debate-start", { room });
            }

            const opponent = room.users.find(u => u.socketId !== socket.id);
            if (opponent && opponent.side) {
                socket.emit("side-selected", {
                    socketId: opponent.socketId,
                    displayName: opponent.displayName,
                    side: opponent.side
                });
            }
            
            return;
        }

        // New user joining
        if (room.users.length >= 2) {
            socket.emit("room-full", { message: "Room is full" });
            return;
        }
        try {
            await addUser(room.id, socket.id, data.displayName);
        } catch(error) {
            socket.emit("error", { message: error.message });
            return;
        }
        socket.join(room.id);
        let updatedRoom;
        try {
            updatedRoom = await getRoom(room.id);
        } catch(error) {
            socket.emit("error", { message: error.message });
            return;
        }
        if (updatedRoom.users.length == 2) {
            try {
                await setStatus(room.id, "in-progress");
            } catch(error) {
                socket.emit("error", { message: error.message });
                return;
            }
        } else if (updatedRoom.users.length == 1) {
            try {
                await setStatus(room.id, "waiting");
            } catch(error) {
                socket.emit("error", { message: error.message });
                return;
            }
        }
        let finalRoom;
        try {
            finalRoom = await getRoom(room.id);
        } catch(error) {
            socket.emit("error", { message: error.message });
            return;
        }
        io.to(room.id).emit("room-updated", { room: finalRoom })
    })

    socket.on("disconnect", async () => {
        let rooms;
        try {
            rooms = await getAllRooms();
        } catch (error) {
            socket.emit("error", { message: error.message });
            return;
        }

        if (!Array.isArray(rooms)) {
            console.error("getAllRooms did not return an array:", rooms);
            return;
        }

        for (const room of rooms) {
            if (!room.users || !Array.isArray(room.users)) {
                continue;
            }

            const user = room.users.find(u => u.socketId === socket.id);
            if (!user) continue;


            if (disconnectTimers.has(user.userId)) {
                continue;
            }

            const timer = setTimeout(() => {
                handleLeave(user.userId, room.id, io, null);
                disconnectTimers.delete(user.userId);
            }, 5000);

            disconnectTimers.set(user.userId, timer);

            io.to(room.id).emit("user-disconnected", { user, room });
        }
    });

    socket.on("leave-room", async ({ roomId, userId }) => {
        
        let room;
        try {
            room = await getRoom(roomId);
        } catch (error) {
            socket.emit("error", { message: error.message });
            return;
        }

        if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
        }

        const user = room.users.find(u => u.socketId === socket.id);
        if (!user) {
            socket.emit("error", { message: "User not found in room" });
            return;
        }

        const timer = disconnectTimers.get(user.userId);
        if (timer) {
            clearTimeout(timer);
            disconnectTimers.delete(user.userId);
        }

        socket.leave(roomId);
        await handleLeave(user.userId, roomId, io, socket);
    });

    socket.on("select-side", async ({ roomId, side }) => {
        let room;
        try {
            room = await getRoom(roomId);
        } catch (error) {
            socket.emit("error", { message: error.message });
            return;
        }
        if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
        }

        const user = room.users.find(u => u.socketId === socket.id);
        if (!user) {
            socket.emit("error", { message: "User not found in room" });
            return;
        }

        if (user.side !== null) {
            socket.emit("error", { message: "You already selected a side" });
            return;
        }
        
        const otherUser = room.users.find(user => user.socketId !== socket.id);
        if (otherUser && otherUser.side === side) {
            socket.emit("error", { message: "Side already taken" });
            return;
        }

        try {
            await updateSide(roomId, user.userId, side);
        } catch (error) {
            socket.emit("error", { message: error.message });
            return;
        }

        let updatedRoom;
        try {
            updatedRoom = await getRoom(roomId);
        } catch (error) {
            socket.emit("error", { message: error.message });
            return;
        }
        const updatedUser = updatedRoom.users.find(u => u.socketId === socket.id);

        const socketId = socket.id;
        const displayName = user.displayName;

        io.to(roomId).emit("side-selected", {socketId, displayName, side})

        if (updatedUser.side && otherUser && otherUser.side) {
            io.to(roomId).emit("debate-start", {room});
        }

        io.to(roomId).emit("room-updated", { room: updatedRoom });
    })
}

module.exports = { roomHandler }