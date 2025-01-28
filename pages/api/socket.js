import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO...");
    const io = new Server(res.socket.server, {
      path: "/api/socket.io",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("submitTurn", (turnData) => {
        console.log("Turn submitted:", turnData);
        io.emit("newTurn", turnData);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  } else {
    console.log("Socket.IO server already set up.");
  }
  res.end();
}

