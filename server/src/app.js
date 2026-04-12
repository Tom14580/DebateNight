require('dotenv').config();
const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/rooms");
const topicRoutes = require("./routes/topics")

const app = express();

const allowedOrigins = [
  'https://debatenightfrontend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.error(`CORS error: Origin not allowed: ${origin}`);
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/rooms", roomRoutes);
app.use('/api/topics', topicRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/online-count", (req, res) => {
  const io = require("./socket/index").getIO();
  const count = io?.sockets?.sockets?.size || 0;
  res.json({ online: count });
})

module.exports = app;