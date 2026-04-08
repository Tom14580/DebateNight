const http = require("http");
const app = require("./src/app");
const { initSocket, getIO } = require("./src/socket");

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { getIO };