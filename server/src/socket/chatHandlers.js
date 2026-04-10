const { createNewRoom, getAllRooms, getRoom, addUser, setStatus, removeUser, deleteRoom, updateSide, addMessage } = require('../data/rooms');

async function chatHandler(socket, io) {
    socket.on("send-message", async ({ roomId, text, displayName, side, userId }) => {
        let room;
        try {
            room = await getRoom(roomId);
        } catch (error) {
            console.error("Error getting room:", error);
            socket.emit("error", { message: error.message });
            return
        }
        if (!room || room.status !== "in-progress") {
            socket.emit("error", { message: "Can't send a message right now"})
            return;
        }
        
        const user = room.users.find(u => u.socketId === socket.id);
        if (!user) {
            return;
        }

        const message = {
            displayName: user.displayName,
            side: user.side,
            text: text.trim(),
            timestamp: Date.now(),
            userId: user.userId
        }

        try {
            await addMessage(roomId, user.userId, user.displayName, user.side, message);
        } catch (error) {
            console.error("Error saving message:", error);
            socket.emit("error", { message: error.message });
            return
        }
        io.to(roomId).emit("receive-message", { message: message })
    })
}

module.exports = { chatHandler }