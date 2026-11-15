# DebateNight

A real-time 1-on-1 web debate platform where two users debate a chosen topic via live chat

![Built with](https://img.shields.io/badge/Built%20with-React%20%7C%20Node.js%20%7C%20Socket.io-blue)

---

## What Is DebateNight?

DebateNight is a debating web application designed for 1-on-1 debates. Users create or join debate rooms, select their position on a topic, and chat in real-time.

<img width="1263" height="658" alt="image" src="https://github.com/user-attachments/assets/52d76427-026b-4b38-b659-437df818cad0" />

---

## Core Features

### Lobby System
- **Browse Active Rooms**: View all waiting rooms and in-progress debates
- **Create Rooms**: Pick from preset debate topics or create a custom topic
- **Join Rooms**: Enter any room with available space
<img width="1256" height="658" alt="image" src="https://github.com/user-attachments/assets/8a813384-c2fd-45e0-9176-77010adbfbd1" />


### Real-Time Debate
- **Live Chat**: Messages appear instantly via WebSockets
- **Message Persistence**: All messages stored in database so they can be viewed in history
- **Side Selection**: Each user picks FOR or AGAINST
<img width="1245" height="655" alt="image" src="https://github.com/user-attachments/assets/29905ca2-10ce-44ed-87e7-7219f49b90f3" />

### User Management
- **Display Name**: Set your name on first visit, stored in browser
- **Direct Room Links**: Share room URLs with other users
- **Session Persistence**: User ID stored in browser sessionStorage for reconnection

### Debate Rules
- **Exactly 2 Participants**: Room is full once both users join
- **Opposite Sides**: Users cannot pick the same side
- **Chat Unlock**: Messages only allowed after both users select sides

### History
- View previous debates of yours and others
<img width="1260" height="656" alt="image" src="https://github.com/user-attachments/assets/a19ab656-9907-43cf-9fdc-795e7e0b0fe2" />

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
- **PostgreSQL Database**: Persistent storage for rooms, users, and messages
- **Real-Time Sync**: Socket.io ensures instant updates across clients
- **Message History**: All messages stored with user ID, side, and timestamp

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

4. **Setup PostgreSQL Database**:
   - Install PostgreSQL (if not already installed)
   - Create a database named `debate_night`
   - Run the schema file to create tables:
     ```bash
     cd server/src/data
     psql -U postgres -d debatenight -f schema.sql
     ```
   - Update `server/src/data/db.js` with your database connection details (host, user, password, port)

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

### 2. **Browse the Lobby**
   - See all active rooms with their topic, status, and participant count

### 3. **Create a Debate Room**
   - Click "Create Room"
   - Select a preset topic or enter a custom debate topic
   - Share the room link with someone else to invite them

### 4. **Join a Room**
   - Click on any room in the lobby

### 5. **Select Your Side**
   - Choose FOR or AGAINST the debate topic

### 6. **Debate**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Real-Time | Socket.io Client |
| Backend | Node.js, Express |
| Real-Time Server | Socket.io |
| Database | PostgreSQL |
| Styling | CSS3, CSS Variables |

---

## Future Enhancements

- User accounts and authentication
- Users voting who won a debate on the history page and reputation
- Debate statistics and analytics
