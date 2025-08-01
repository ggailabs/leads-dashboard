"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onLeadNew?: (lead: any) => void;
  onLeadUpdate?: (lead: any) => void;
  onMessageReceived?: (message: any) => void;
  onLeadStatusChange?: (data: { leadId: string; status: string }) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const {
    autoConnect = true,
    onLeadNew,
    onLeadUpdate,
    onMessageReceived,
    onLeadStatusChange,
  } = options;

  useEffect(() => {
    if (typeof window === "undefined") return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    // Set up event listeners
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    socket.on("lead:new", (leadData: any) => {
      console.log("New lead received:", leadData);
      onLeadNew?.(leadData);
    });

    socket.on("lead:update", (leadData: any) => {
      console.log("Lead updated:", leadData);
      onLeadUpdate?.(leadData);
    });

    socket.on("message:received", (messageData: any) => {
      console.log("New message received:", messageData);
      onMessageReceived?.(messageData);
    });

    socket.on("lead:status", (data: { leadId: string; status: string }) => {
      console.log("Lead status changed:", data);
      onLeadStatusChange?.(data);
    });

    if (autoConnect) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [autoConnect, onLeadNew, onLeadUpdate, onMessageReceived, onLeadStatusChange]);

  const emitLeadCreated = (leadData: any) => {
    socketRef.current?.emit("lead:created", leadData);
  };

  const emitLeadUpdated = (leadData: any) => {
    socketRef.current?.emit("lead:updated", leadData);
  };

  const emitMessageNew = (messageData: any) => {
    socketRef.current?.emit("message:new", messageData);
  };

  const emitLeadStatusChanged = (data: { leadId: string; status: string }) => {
    socketRef.current?.emit("lead:status-changed", data);
  };

  return {
    socket: socketRef.current,
    emitLeadCreated,
    emitLeadUpdated,
    emitMessageNew,
    emitLeadStatusChanged,
  };
};