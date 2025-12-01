// src/providers/WebSocketProvider.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

const WS_URL = "ws://lingomate-eb.ap-northeast-2.elasticbeanstalk.com/ws";

type WSContextType = {
  connected: boolean;
  messages: any[];
  sendMessage: (msg: any) => void;
};

const WebSocketContext = createContext<WSContextType>({
  connected: false,
  messages: [],
  sendMessage: () => {},
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const connect = () => {
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("[WS] Connected");
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch {
        console.log("[WS] Received non-JSON message");
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("[WS] Disconnected — retrying in 5s...");
      reconnectTimer.current = setTimeout(connect, 5000);
    };

    ws.onerror = () => {
      console.log("[WS] Error occurred");
      ws.close();
    };
  };

  useEffect(() => {
    if (token) connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [token]);

  const sendMessage = (msg: any) => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.log("[WS] Cannot send message — not connected");
    }
  };

  return (
    <WebSocketContext.Provider value={{ connected, messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
