const { v4: uuidv4 } = require('uuid');
const pool = require("./db.js");

async function createNewRoom(roomTopic) {
    const roomId = uuidv4();
    
    const query = `
        INSERT INTO rooms(id, topic, status, created_at)
        VALUES($1, $2, 'waiting', CURRENT_TIMESTAMP)
        RETURNING *
    `;
    const result = await pool.query(query, [roomId, roomTopic]);

    return result.rows[0];
}

async function getAllRooms() {
    const query = `
        SELECT id, topic, status, created_at
        FROM rooms
        ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    
    const rooms = await Promise.all(result.rows.map(async (room) => {
        const usersQuery = `
            SELECT id, socket_id, display_name, side
            FROM room_users
            WHERE room_id = $1
        `;
        const usersResult = await pool.query(usersQuery, [room.id]);
        room.users = usersResult.rows.map(user => ({
            userId: user.id,
            socketId: user.socket_id,
            displayName: user.display_name,
            side: user.side
        }));
        return room;
    }));
    
    return rooms;
}

async function getRoom(roomId) {
    const roomQuery = `
        SELECT id, topic, status, created_at
        FROM rooms
        WHERE id = $1
    `;
    const roomResult = await pool.query(roomQuery, [roomId]);

    if (roomResult.rows.length === 0) {
        return null;
    }

    const room = roomResult.rows[0];

    const usersQuery = `
        SELECT id, socket_id, display_name, side
        FROM room_users
        WHERE room_id = $1
    `;
    const usersResult = await pool.query(usersQuery, [roomId]);
    room.users = usersResult.rows.map(user => ({
        userId: user.id,
        socketId: user.socket_id,
        displayName: user.display_name,
        side: user.side
    }));

    const messagesQuery = `
        SELECT id, user_id, display_name, side, text, timestamp
        FROM messages
        WHERE room_id = $1
        ORDER BY timestamp ASC
    `;
    const messagesResult = await pool.query(messagesQuery, [roomId]);
    room.messages = messagesResult.rows.map(msg => ({
        userId: msg.user_id,
        displayName: msg.display_name,
        side: msg.side,
        text: msg.text,
        timestamp: msg.timestamp
    }));
    
    return room;
}

async function addUser(roomId, socketId, displayName) {
    const query = `
        INSERT INTO room_users(room_id, socket_id, display_name, side)
        VALUES($1, $2, $3, NULL)
        RETURNING *
    `;
    const result = await pool.query(query, [roomId, socketId, displayName]);
    return result.rows[0];
}

async function removeUser(roomId, userId) {
    const query = `
        DELETE FROM room_users
        WHERE id = $1 AND room_id = $2
        RETURNING *
    `;
    const result = await pool.query(query, [userId, roomId]);
    return result.rows[0];
}

async function setStatus(roomId, status) {
    const query = `
        UPDATE rooms
        SET status = $1
        WHERE id = $2
        RETURNING *
    `;
    const result = await pool.query(query, [status, roomId]);
    return result.rows[0];
}

async function deleteRoom(roomId) {
    const query = `
        DELETE FROM rooms
        WHERE id = $1
        RETURNING *
    `;
    const result = await pool.query(query, [roomId]);
    return result.rows[0];
}

async function updateSide(roomId, userId, side) {
    const query = `
        UPDATE room_users
        SET side = $1
        WHERE id = $2 AND room_id = $3
        RETURNING *
    `;
    const result = await pool.query(query, [side, userId, roomId]);
    return result.rows[0];
}

async function updateSocketId(userId, newSocketId) {
    const query = `
        UPDATE room_users
        SET socket_id = $1
        WHERE id = $2
        RETURNING *
    `;
    const result = await pool.query(query, [newSocketId, userId]);
    return result.rows[0];
}

async function addMessage(roomId, userId, displayName, side, message) {
    
    const query = `
        INSERT INTO messages(room_id, user_id, display_name, side, text, timestamp)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const result = await pool.query(query, [roomId, userId, displayName, side, message.text, message.timestamp]);
    return result.rows[0];
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
    updateSocketId,
    addMessage
};