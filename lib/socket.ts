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

export const connectSocket = async () => {
  const sessionId = await fetch(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/session"
      : "https://anoxa.vercel.app/api/session"
  )
    .then((res) => res.json())
    .then((data) => data.sessionId);

  socket.auth = { sessionId };
  socket.connect();
};
