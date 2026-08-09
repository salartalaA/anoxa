import { io } from "socket.io-client";

export const socket = io(
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://anoxa-server.onrender.com",
  {
    withCredentials: true,
    autoConnect: false,
  }
);
