import React, { useState } from "react";
import { Button } from "antd"
import { useEmotionCss } from "@ant-design/use-emotion-css";
import io from "socket.io-client";

const Deploy: React.FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      color: '#fff',
      backgroundSize: '100% 100%',
      backgroundColor: '#0f0000',
      borderRadius: '10px'
    };
  });

  const connectSocket = () => {
    const socket = io("http://localhost:8080");
    setSocket(socket);
    socket.on("stdout", (message) => {
      setMessages((prevMessages: string[]) => {
        return [...prevMessages, message];
      });
    });
  };

  return (
    <div>
      <div className={containerClassName}>
      <Button
        type="primary"
        onClick={connectSocket}
      >
       部署
      </Button>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Deploy;
