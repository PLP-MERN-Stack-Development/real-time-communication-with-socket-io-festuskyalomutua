import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Change URL if deploying

function App() {
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("notification", (note) => {
      setMessages((prev) => [...prev, { sender: "System", text: note, timestamp: new Date().toISOString() }]);
    });

    socket.on("typing", ({ username, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping
          ? [...new Set([...prev, username])]
          : prev.filter((u) => u !== username)
      );
    });

    return () => {
      socket.off("chat-message");
      socket.off("online-users");
      socket.off("notification");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit("join", username);
      setIsAuthenticated(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat-message", message);
      setMessage("");
      socket.emit("typing", false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", !!e.target.value);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Welcome to Socket.io Chat</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <button onClick={handleLogin}>Join Chat</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", border: "1px solid #ddd", padding: 20 }}>
      <h3>Global Chat</h3>
      <div>
        <strong>Online users:</strong> {onlineUsers.join(", ")}
      </div>
      <div style={{ minHeight: 200, border: "1px solid #eee", margin: "10px 0", padding: 10, overflowY: "scroll", height: 300 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <span style={{ color: msg.sender === username ? "blue" : "green", fontWeight: "bold" }}>
              {msg.sender}:
            </span>{" "}
            {msg.text} <span style={{ color: "#999", fontSize: 12 }}>({new Date(msg.timestamp).toLocaleTimeString()})</span>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div style={{ fontStyle: "italic", color: "#888" }}>
            {typingUsers.join(", ")} typing...
          </div>
        )}
        <div ref={messageEndRef}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{ width: "80%" }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;