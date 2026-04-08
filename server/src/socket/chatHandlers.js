const { createNewRoom, getAllRooms, getRoom, addUser, setStatus, removeUser, deleteRoom, updateSide, addMessage } = require('../data/rooms');

function chatHandler(socket, io) {
    socket.on("send-message", ({ roomId, text, displayName, side, userId }) => {
        const room = getRoom(roomId);
        if (!room || room.status !== "in-progress") {
            socket.emit("error", { message: "Can't send a message right now"})
            return;
        }
        const user = room.users.find(u => u.userId === userId);
        if (!user) return;

        const message = {
            displayName,
            side,
            text: text.trim(),
            timestamp: Date.now(),
            userId: userId
        }

        addMessage(roomId, message);
        io.to(roomId).emit("receive-message", { message: message })
    })
}

module.exports = { chatHandler }