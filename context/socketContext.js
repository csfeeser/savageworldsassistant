import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Trigger the API route to initialize the Socket.IO server
    fetch("/api/socket").then(() => {
      // Connect to the server via Socket.IO
      const socketInstance = io({
        path: "/api/socket.io",
      });
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

