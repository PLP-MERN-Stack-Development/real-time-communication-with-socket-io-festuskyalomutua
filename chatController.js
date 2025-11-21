// server/controllers/chatController.js
const { getTimestamp } = require("../utils/time");

function handleSocketEvents(socket, io, onlineUsers) {
  socket.on("join", username => {
    socket.username = username;
    onlineUsers.add(username, socket.id);
    io.emit("online-users", onlineUsers.list());
    socket.broadcast.emit("notification", `${username} joined the chat`);
  });

  socket.on("chat-message", msg => {
    io.emit("chat-message", {
      sender: socket.username,
      text: msg,
      timestamp: getTimestamp(),
    });
  });

  socket.on("typing", isTyping => {
    socket.broadcast.emit("typing", { username: socket.username, isTyping });
  });

  socket.on("disconnect", () => {
    onlineUsers.remove(socket.username);
    io.emit("online-users", onlineUsers.list());
    if (socket.username) socket.broadcast.emit("notification", `${socket.username} left the chat`);
  });
}

module.exports = { handleSocketEvents };