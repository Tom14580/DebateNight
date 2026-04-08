const http = require("http");
const app = require("./src/app");
const { initSocket, getIO } = require("./src/socket");

const server = http.createServer(app);
initSocket(server);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { getIO };