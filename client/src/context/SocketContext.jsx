import { createContext } from 'react';
import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 
            (import.meta.env.PROD ? undefined : 'http://localhost:3000');

export const socket = io(URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const SocketContext = createContext(socket);