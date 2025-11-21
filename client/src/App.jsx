// client/src/App.jsx
import React, { useState } from "react";
import { SocketProvider } from "./context/SocketContext";
import Chat from "./pages/Chat";

function App() {
  const [username, setUsername] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <SocketProvider>
      {!authenticated ? (
        <div style={{ padding: 40 }}>
          <h2>Socket.io Chat Login</h2>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <button onClick={() => username && setAuthenticated(true)}>Join</button>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </SocketProvider>
  );
}

export default App;