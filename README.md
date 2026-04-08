# DebateNight

A real-time 1-on-1 web debate platform where two users enter a room, select opposing sides (FOR or AGAINST), and debate a chosen topic via live chat.

![Built with](https://img.shields.io/badge/Built%20with-React%20%7C%20Node.js%20%7C%20Socket.io-blue)

---

## What Is DebateNight?

DebateNight is a minimalist debating web application designed for 1-on-1 debates. Users create or join debate rooms, select their position on a topic, and have real-time chat debates.

---

## Core Features

### Lobby System
- **Browse Active Rooms**: View all waiting rooms and in-progress debates
- **Create Rooms**: Pick from preset debate topics or create a custom topic
- **Join Rooms**: Enter any room with available space (max 2 participants)

### Real-Time Debate
- **Live Chat**: Messages appear instantly across both users via WebSockets
- **Side Selection**: Each user picks FOR or AGAINST (one per side)
- **Side-Coded Messages**: Chat bubbles are color-coded by argument side (green for FOR, red for AGAINST)
- **Opponent Status**: See your opponent's name and selected side before debate starts

### User Management
- **Display Name**: Set your name on first visit, stored in browser
- **Direct Room Links**: Share room URLs with other users
- **Automatic Reconnection**: 5-second period to rejoin if connection drops

### Debate Rules
- **Exactly 2 Participants**: Room is full once both users join
- **Opposite Sides**: Users cannot pick the same side
- **Chat Unlock**: Messages only allowed after both users select sides
- **Immutable Selection**: Side choices cannot be changed once locked

---

## Architecture

### Frontend (React + Vite)
```
client/
├── components/
│   ├── Chat/              # ChatWindow, MessageBubble, ChatInput
│   ├── Lobby/             # LobbyPage, RoomCard, CreateRoomModal
│   ├── Room/              # RoomPage, SidePicker, OpponentStatus
│   └── shared/            # Modal, Navbar, reusable UI components
├── pages/                 # Home, Lobby, Room
├── hooks/                 # useRoom (state & socket management)
├── context/               # SocketContext (WebSocket provider)
└── styles/                # Global styles, component-specific CSS
```

### Backend (Node.js + Express + Socket.io)
```
server/
├── src/
│   ├── controllers/       # REST handlers (GET /rooms, POST /rooms)
│   ├── socket/            # WebSocket event handlers
│   ├── data/              # In-memory room store & topic list
│   └── routes/            # Express route definitions
└── server.js              # HTTP server + Socket.io initialization
```

### Data Storage
- **In-Memory**: All rooms and messages stored in server memory (MVP)
- **No Database**: Persistent storage not yet implemented
- **Real-Time Sync**: Socket.io ensures instant updates across clients

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone or extract** the project directory

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**:
   ```bash
   cd ../client
   npm install
   ```

### Running the App

**Terminal 1 (Server)**:
```bash
cd server
npm run dev
```
Server runs on `http://localhost:3000`

**Terminal 2 (Client)**:
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

Open your browser to `http://localhost:5173` and start debating!

---

## How to Use

### 1. **Set Your Display Name**
   - When you first visit, you'll be prompted to enter a display name
   - This is stored in your browser's localStorage

### 2. **Browse the Lobby**
   - See all active rooms with their topic, status, and participant count
   - Rooms show "Waiting for opponent..." until 2 users join

### 3. **Create a Debate Room**
   - Click "Create Room"
   - Select a preset topic or enter a custom debate topic
   - Share the room link with someone else to invite them

### 4. **Join a Room**
   - Click on any room in the lobby
   - You'll enter the room and meet your opponent

### 5. **Select Your Side**
   - Choose FOR or AGAINST the debate topic
   - Your opponent must choose the opposite side
   - Buttons are disabled until both users join

### 6. **Debate**
   - Type messages in the chat input
   - Messages are color-coded: green for FOR, red for AGAINST

### 7. **Leave or Reload**
   - Navigating away via navbar triggers an immediate "leave" event
   - If you accidentally close/refresh, you have 5 seconds to rejoin before being kicked

---

## Real-Time Events (Socket.io)

### Room Events
- `join-room` → User enters a debate room
- `leave-room` → User manually leaves
- `disconnect` → User loses connection (5-second grace period)
- `room-updated` → Room state changes (users list, status)
- `user-disconnected` → Opponent disconnects or leaves

### Debate Events
- `select-side` → User picks FOR or AGAINST
- `debate-start` → Both users selected sides, chat unlocks
- `debate-ended` → Timer expired or room force-closed

### Chat Events
- `send-message` → User sends a chat message
- `receive-message` → Broadcast incoming message to room

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Real-Time | Socket.io Client |
| Backend | Node.js, Express |
| Real-Time Server | Socket.io |
| Storage | In-Memory (no database) |
| Styling | CSS3, CSS Variables |

---

## Project Constraints (MVP)

- Max 2 participants per room
- In-memory storage (no persistence)
- Preset + custom topics
- Real-time chat with side indicators
- Display name stored in localStorage
- No user accounts or authentication
- No debate history or analytics
- No database storage

---

## Future Enhancements

- Database persistence
- User accounts and authentication
- Debate history and replays
- Ratings and reputation system
- Debate statistics and analytics

---

**Happy debating!**
