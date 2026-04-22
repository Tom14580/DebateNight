const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, removeRoom, getUsers } = require('../controllers/roomController');

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", createRoom);
router.delete("/:id", removeRoom);

module.exports = router;