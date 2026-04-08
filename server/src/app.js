const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/rooms");
const topicRoutes = require("./routes/topics")

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomRoutes);
app.use('/api/topics', topicRoutes);

module.exports = app;