import { Server } from "socket.io";

export function createSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["https://virtual-hug-sim.vercel.app", "*"],
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`Client ${socket.id} joined room ${roomId}`);
    });

    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);
      console.log(`Client ${socket.id} left room ${roomId}`);
    });

    socket.on(
      "send-hug",
      (data: { to: string; hugType: string; message: string }) => {
        io.to(data.to).emit("receive-hug", {
          from: socket.id,
          hugType: data.hugType,
          message: data.message,
        });
      },
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}
