import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';


export default function App() {
  const [socket, setSocket] = useState<any>(null);
  useEffect(() => {
    const socket = io('http://localhost:8080');
    setSocket(socket);
    socket.on('cmdLog', (msg) => {
      console.log(msg);
    });
  }, []);

  const onEmithandle = () => {
    socket.emit('chatMessage');
  };

  return <div>
    <button onClick={onEmithandle}>click</button>
  </div>;
}
