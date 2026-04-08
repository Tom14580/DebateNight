const { createNewRoom, getAllRooms, getRoom, addUser, setStatus, removeUser, deleteRoom, updateSide, addMessage } = require('../data/rooms');
const disconnectTimers = new Map();

function handleLeave(userId, roomId, io) {
    const room = getRoom(roomId);
    if (!room) return;

    const user = room.users.find(u => u.userId === userId);
    if (!user) return;

    const debateStarted = room.status === "in-progress";

    if (debateStarted) {
        io.to(roomId).emit("debate-ended", { message: `${user.displayName} left the debate. Room is closing.`})

        io.sockets.sockets.forEach(s => {
            if (s.rooms.has(roomId)) {
                s.leave(roomId);
            }
        });
        deleteRoom(roomId);
    } else {
        removeUser(roomId, userId);

        const updatedRoom = getRoom(roomId);
        if (!updatedRoom) return;

        const finalRoom = getRoom(roomId);
        if (finalRoom.users.length === 0) {
            deleteRoom(roomId);
        } else if (finalRoom.users.length === 1) {
            io.to(roomId).emit("debate-ended", { message: "The other user left. Room is closing." });

            io.sockets.sockets.forEach(s => {
                if (s.rooms.has(roomId)) {
                    s.leave(roomId);
                }
            });
            deleteRoom(roomId);
        } else {
            io.to(roomId).emit("room-updated", { room: finalRoom });
            io.to(roomId).emit("user-disconnected", { user, room: finalRoom });
        }
    }
}

function roomHandler(socket, io) {
    socket.on("join-room", (data) => {
        const room = getRoom(data.roomId);
        if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
        }

        const existingUser = room.users.find(u => u.userId === data.userId);
        if (existingUser) {
            const timer = disconnectTimers.get(data.userId);
            if (timer) {
                clearTimeout(timer);
                disconnectTimers.delete(data.userId);
            }

            existingUser.socketId = socket.id;
            socket.join(room.id);
            
            socket.emit("room-updated", { room });
            
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

        if (room.users.length >= 2) {
            socket.emit("room-full", { message: "Room is full" });
            return;
        }
        addUser(room.id, {socketId: socket.id, displayName: data.displayName, side:null, userId: data.userId,});
        socket.join(room.id);
        const updatedRoom = getRoom(room.id);
        if (updatedRoom.users.length == 2) {
            setStatus(room.id, "in-progress");
        } else if (updatedRoom.users.length == 1) {
            setStatus(room.id, "waiting");
        }
        const finalRoom = getRoom(room.id);
        io.to(room.id).emit("room-updated", { room: finalRoom })
    })

    socket.on("disconnect", () => {
        const rooms = getAllRooms();

        rooms.forEach(room => {
            const user = room.users.find(u => u.socketId === socket.id);
            if (!user) return;

            if (disconnectTimers.has(user.userId)) return;

            const timer = setTimeout(() => {
                handleLeave(user.userId, room.id, io);
                disconnectTimers.delete(user.userId);
            }, 5000);

            disconnectTimers.set(user.userId, timer);

            io.to(room.id).emit("user-disconnected", { user, room });
        });
    });

    socket.on("leave-room", ({ roomId, userId }) => {
        const timer = disconnectTimers.get(userId);
        if (timer) {
            clearTimeout(timer);
            disconnectTimers.delete(userId);
        }

        socket.leave(roomId);
        handleLeave(userId, roomId, io);
    });

    socket.on("select-side", ({ roomId, side }) => {
        room = getRoom(roomId);
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

        updateSide(roomId, socket.id, side);

        const updatedRoom = getRoom(roomId);
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