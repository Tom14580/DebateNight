const { createNewRoom, getAllRooms, getRoom, addUser, setStatus, removeUser, deleteRoom } = require('../data/rooms');

function getRooms (req, res) {
    try {
        const activeRooms = getAllRooms().filter(room => room.status != "finished");
        res.status(200).send(activeRooms);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};

function getRoomById (req, res) {
    try {
        const { id } = req.params;
        const room = getRoom(id);

        if (!room) {
            return res.status(404).send("Room Not Found");
        }

        res.status(200).send(room);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

function createRoom (req, res) {
    try {
        const { topic } = req.body;

        if (!topic || topic.trim() === "") {
            return res.status(400).send("Topic is required");
        }

        const newRoom = createNewRoom(topic);
        res.status(201).send(newRoom);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getRooms,
    getRoomById,
    createRoom
}