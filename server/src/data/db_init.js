require('dotenv').config();
const pool = require('./db');

const schema = `
CREATE TABLE IF NOT EXISTS rooms(
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status='waiting' OR status='in-progress' OR status='finished'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users(
    user_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_users(
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(user_id),
    socket_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    side TEXT CHECK (side='For' OR side='Against')
);

CREATE TABLE IF NOT EXISTS messages(
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(user_id),
    display_name TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side='For' OR side='Against'),
    text TEXT NOT NULL,
    timestamp BIGINT NOT NULL

);

CREATE INDEX IF NOT EXISTS idx_room_users_room_id ON room_users(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
`;

async function initializeDatabase() {
    try {
        console.log("Starting database initialization");
        console.log("Testing database connection");
        const client = await pool.connect();
        console.log("Connected to database");
        client.release();
        console.log("Creating tables");
        await pool.query(schema);
        console.log("Schema executed");
        
        console.log("Verifying tables");
        const tableCheck = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('rooms', 'room_users', 'messages')
        `);
        console.log("Database initialization complete");
        process.exit(0);
    } catch (error) {
        console.error("Database initialization failed:", error.message);
        console.error("Details:", error);
        process.exit(1);
    }
}

initializeDatabase();