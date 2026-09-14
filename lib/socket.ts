import { io } from "socket.io-client";

export const socket = io(
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://anoxa.bonto.run",
  {
    withCredentials: true,
    autoConnect: false,
  }
);
