// client/src/context/SocketContext.jsx
import React, { createContext } from "react";
import { socket } from "../socket";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}