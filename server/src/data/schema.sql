CREATE TABLE IF NOT EXISTS rooms(
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status='waiting' OR status='in-progress' OR status='finished'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_users(
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    socket_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    side TEXT CHECK (side='For' OR side='Against')
);

CREATE TABLE IF NOT EXISTS messages(
    id SERIAL PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES room_users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side='For' OR side='Against'),
    text TEXT NOT NULL,
    timestamp BIGINT NOT NULL

);