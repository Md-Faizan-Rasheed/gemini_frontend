import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL || "https://jubilant-fortnight-node-backend.onrender.com";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // connect manually after login
});
