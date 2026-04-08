const { Server } = require("socket.io");
const { roomHandler } = require("./roomHandlers");
const { chatHandler } = require("./chatHandlers");
let ioInstance = null;

function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
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