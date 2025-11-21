// client/src/components/ChatMessage.jsx
import React from "react";
export default function ChatMessage({ sender, text, timestamp }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <span style={{ fontWeight: "bold", color: sender === "System" ? "#aa0" : "#007" }}>{sender}:</span>
      {" "}
      <span>{text}</span>
      <span style={{ color: "#888", fontSize: 12 }}> ({new Date(timestamp).toLocaleTimeString()})</span>
    </div>
  );
}