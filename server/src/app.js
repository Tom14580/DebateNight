require('dotenv').config();
const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/rooms");
const topicRoutes = require("./routes/topics")

const app = express();

const clientUrl = process.env.CLIENT_URL || 
                  (process.env.NODE_ENV === 'production' 
                    ? 'https://your-frontend-url.onrender.com' 
                    : 'http://localhost:5173');

app.use(cors({
  origin: clientUrl,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/rooms", roomRoutes);
app.use('/api/topics', topicRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

module.exports = app;