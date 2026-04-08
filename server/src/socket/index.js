const { Server } = require("socket.io");
const { roomHandler } = require("./roomHandlers");
const { chatHandler } = require("./chatHandlers");
let ioInstance = null;

function initSocket(server) {

  const clientUrl = process.env.CLIENT_URL || 
                    (process.env.NODE_ENV === 'production' 
                      ? 'https://your-frontend-url.onrender.com' 
                      : 'http://localhost:5173');

  ioInstance = new Server(server, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  ioInstance.on("connection", (socket) => {
    roomHandler(socket, ioInstance)
    chatHandler(socket, ioInstance)
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }
  return ioInstance;
}

module.exports = { initSocket, getIO };