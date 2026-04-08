const { v4: uuidv4 } = require('uuid');

const rooms = new Map();

function createNewRoom(roomTopic) {
    const roomId = uuidv4();
    const newRoom = {
        id: roomId,
        topic: roomTopic,
        status: "waiting",
        createdAt: new Date().toLocaleString(),
        users: [],
        messages: []
    }
    rooms.set(roomId, newRoom);
    return newRoom;
}

function getAllRooms() {
    return Array.from(rooms.values());
}

function getRoom(roomId) {
    const room = rooms.get(roomId);
    if (!room) {
        return false;
    }
    return room;
}

function addUser(roomId, user) {
    const room = rooms.get(roomId);
    room.users.push(user);
}

function removeUser(roomId, userId) {
    const room = rooms.get(roomId);
    if (room && room.users) {
        room.users = room.users.filter(roomUser => roomUser.userId !== userId);
    }
}

function setStatus(roomId, status) {
    const room = rooms.get(roomId);
    room.status = status;
}

function deleteRoom(roomId) {
    const room = rooms.get(roomId);
    rooms.delete(roomId);
}

function updateSide(roomId, socketId, side) {
    const room = rooms.get(roomId);
    if (room) {
        const user = room.users.find(u => u.socketId === socketId);
        if (user) {
            user.side = side;
            return true;
        }
    }
    return false;
}

function addMessage(roomId, message) {
    const room = rooms.get(roomId);
    if (room) {
        room.messages.push(message);
        return true;
    }
    return false;
}

module.exports = {
    createNewRoom,
    getAllRooms,
    getRoom,
    addUser,
    setStatus,
    removeUser,
    deleteRoom,
    updateSide,
    addMessage
};