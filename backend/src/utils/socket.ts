import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env.js';

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

     socket.on("join-poll", (pollId: string) => {
      socket.join(pollId);
      console.log(`Client ${socket.id} joined poll room: ${pollId}`);
    });


    socket.on("leave-poll", (pollId: string) => {
      socket.leave(pollId);
      console.log(`Client ${socket.id} left poll room: ${pollId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }

  return io;
}