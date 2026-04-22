const { createNewRoom, getAllRooms, getRoom, addUser, setStatus, removeUser, deleteRoom } = require('../data/rooms');

async function getRooms (req, res) {
    try {
        const allRooms = await getAllRooms();
        res.status(200).send(allRooms);
    }
    catch (error) {
        res.status(500).send(error.message);
        console.error(error.message);
    }
};

async function getRoomById (req, res) {
    try {
        const { id } = req.params;
        const room = await getRoom(id);

        if (!room) {
            return res.status(404).send("Room Not Found");
        }

        res.status(200).send(room);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

async function createRoom (req, res) {
    try {
        const { topic } = req.body;

        if (!topic || topic.trim() === "") {
            return res.status(400).send("Topic is required");
        }

        const newRoom = await createNewRoom(topic);
        res.status(201).send(newRoom);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

async function removeRoom(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("roomId required");
        }
        await deleteRoom(id);
        return res.sendStatus(204);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getRooms,
    getRoomById,
    createRoom,
    removeRoom
}