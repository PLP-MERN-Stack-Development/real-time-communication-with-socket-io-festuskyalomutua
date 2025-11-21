// client/src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import useSocket from "../hooks/useSocket";
import ChatMessage from "../components/ChatMessage";
import OnlineUsers from "../components/OnlineUsers";

export default function Chat({ username }) {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messageEndRef = useRef();

  useEffect(() => {
    socket.emit("join", username);
    socket.on("chat-message", (msg) => setMessages(prev => [...prev, msg]));
    socket.on("notification", (note) => setMessages(prev => [...prev, { sender: "System", text: note, timestamp: new Date().toISOString() }]));
    socket.on("online-users", users => setOnlineUsers(users));
    socket.on("typing", ({ username, isTyping }) => {
      setTypingUsers(prev => isTyping ? [...new Set([...prev, username])] : prev.filter(u => u !== username));
    });
    return () => {
      socket.off("chat-message");
      socket.off("notification");
      socket.off("online-users");
      socket.off("typing");
    };
  }, [socket, username]);

  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = e => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat-message", message);
      setMessage("");
      socket.emit("typing", false);
    }
  };

  const handleTyping = e => {
    setMessage(e.target.value);
    socket.emit("typing", !!e.target.value);
  };

  return (
    <div>
      <OnlineUsers users={onlineUsers} />
      <div style={{ border: "1px solid #eee", height: 300, overflowY: "auto", margin: "10px 0", padding: 12 }}>
        {messages.map((msg, i) => <ChatMessage key={i} {...msg} />)}
        {typingUsers.length > 0 && (
          <div style={{ fontStyle: "italic", color: "#888" }}>{typingUsers.join(", ")} typing...</div>
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