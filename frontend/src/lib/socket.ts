import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        withCredentials: true, 
        autoConnect: true,
      }
    );
  }
  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};