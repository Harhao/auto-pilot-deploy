import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.scss";

export default function App() {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);
    socket.on("stdout", (message) => {
      setMessages((prevMessages: string[]) => {
        return [...prevMessages, message]
      });
    });
  }, []);

  const onEmithandle = () => {
    socket.emit("chatMessage");
  };

  return (
    <div>
      <button onClick={onEmithandle}>click</button>
      <div className="output">
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
