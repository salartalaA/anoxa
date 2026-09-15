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
  if (typeof window === "undefined") {
    return;
  }

  try {
    const res = await fetch("/api/session");
    if (!res.ok) {
      return;
    }

    const data = await res.json();

    if (data?.sessionId) {
      socket.auth = { sessionId: data.sessionId };
      socket.connect();
    }
  } catch (error) {
    console.error("Socket connection error:", error);
  }
};
