// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('https://jobistry-api.onrender.com', {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
