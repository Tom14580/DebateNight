const { Server } = require("socket.io");
const { roomHandler } = require("./roomHandlers");
const { chatHandler } = require("./chatHandlers");
let ioInstance = null;

function initSocket(server) {

  const allowedOrigins = [
    'https://debatenightfrontend.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  ioInstance = new Server(server, {
    cors: {
      origin: allowedOrigins,
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