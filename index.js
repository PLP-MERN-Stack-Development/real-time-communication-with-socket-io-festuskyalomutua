const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    socket.username = username;
    onlineUsers[username] = socket.id;
    io.emit("online-users", Object.keys(onlineUsers));
    socket.broadcast.emit("notification", `${username} joined the chat`);
  });

  socket.on("chat-message", (msg) => {
    io.emit("chat-message", {
      sender: socket.username,
      timestamp: new Date().toISOString(),
      text: msg
    });
  });

  socket.on("typing", (isTyping) => {
    socket.broadcast.emit("typing", { username: socket.username, isTyping });
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.username];
    io.emit("online-users", Object.keys(onlineUsers));
    if (socket.username) {
      socket.broadcast.emit("notification", `${socket.username} left the chat`);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Socket.io Chat Server");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));