require('dotenv').config();
const { pool } = require('./db');

const schema = `
-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms(
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status = 'waiting' OR status = 'in-progress' OR status = 'finished'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create room_users table
CREATE TABLE IF NOT EXISTS room_users(
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    socket_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    side TEXT CHECK (side = 'For' OR side = 'Against')
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages(
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES room_users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side = 'For' OR side = 'Against'),
    text TEXT NOT NULL,
    timestamp BIGINT NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_room_users_room_id ON room_users(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
`;

async function initializeDatabase() {
    try {
        const client = await pool.connect();
        client.release();
        await pool.query(schema);
        
        const tableCheck = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('rooms', 'room_users', 'messages')
        `);
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

initializeDatabase();