// client/src/components/OnlineUsers.jsx
import React from "react";
export default function OnlineUsers({ users }) {
  return (
    <div>
      <strong>Online users:</strong>
      <span style={{ marginLeft: 8 }}>{users.join(", ") || "None"}</span>
    </div>
  );
}