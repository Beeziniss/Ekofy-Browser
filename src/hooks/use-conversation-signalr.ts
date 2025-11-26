import { useEffect, useState, useCallback, useRef } from "react";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useAuthStore } from "@/store";
import { Message } from "@/gql/graphql";

export interface ChatMessageRequest {
  ConversationId: string;
  SenderId: string;
  ReceiverId: string;
  Text: string;
}

export interface MessageSeenData {
  ConversationId: string;
  SeenBy: string;
}

export interface MessageDeletedData {
  messageId: string;
  deletedBy: string;
}

export interface UseConversationSignalRReturn {
  connection: HubConnection | null;
  isConnected: boolean;
  error: string | null;
  startConnection: () => Promise<void>;
  stopConnection: () => Promise<void>;
  sendMessage: (messageRequest: ChatMessageRequest) => Promise<void>;
  // markAsRead: (conversationId: string, userId: string) => Promise<void>;
  // Event handlers
  onMessageReceived: (callback: (message: Message) => void) => void;
  onMessageSent: (callback: (message: Message) => void) => void;
  // onMessageSeen: (callback: (data: MessageSeenData) => void) => void;
  onMessageDeleted: (callback: (data: MessageDeletedData) => void) => void;
  onException: (callback: (errorMessage: string) => void) => void;
}

export const useConversationSignalR = (): UseConversationSignalRReturn => {
  const { accessToken } = useAuthStore();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);

  // Event callback refs to maintain stable references
  const messageReceivedCallbackRef = useRef<((message: Message) => void) | null>(null);
  const messageSentCallbackRef = useRef<((message: Message) => void) | null>(null);
  // const messageSeenCallbackRef = useRef<((data: MessageSeenData) => void) | null>(null);
  const messageDeletedCallbackRef = useRef<((data: MessageDeletedData) => void) | null>(null);
  const exceptionCallbackRef = useRef<((errorMessage: string) => void) | null>(null);

  const startConnection = useCallback(async () => {
    if (connection?.state === HubConnectionState.Connected) {
      return;
    }

    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/hub/chat`, {
          accessTokenFactory: () => accessToken || "",
          transport: HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Connection state handlers
      newConnection.onclose(() => {
        console.log("SignalR chat connection closed");
        setIsConnected(false);
      });

      newConnection.onreconnecting(() => {
        console.log("SignalR chat reconnecting...");
        setIsConnected(false);
      });

      newConnection.onreconnected(() => {
        console.log("SignalR chat reconnected");
        setIsConnected(true);
      });

      await newConnection.start().then(() => {
        // Set up event listeners
        newConnection.on("ReceiveMessage", (message: Message) => {
          console.log("Message received:", message);
          if (messageReceivedCallbackRef.current) {
            messageReceivedCallbackRef.current(message);
          }
        });

        newConnection.on("MessageSent", (message: Message) => {
          console.log("Message sent:", message);
          if (messageSentCallbackRef.current) {
            messageSentCallbackRef.current(message);
          }
        });

        newConnection.on("ReceiveException", (errorMessage: string) => {
          console.error("SignalR chat error:", errorMessage);
          setError(errorMessage);
          if (exceptionCallbackRef.current) {
            exceptionCallbackRef.current(errorMessage);
          }
        });

        /* newConnection.on("MessageSeen", (data: MessageSeenData) => {
        console.log("Message seen:", data);
        if (messageSeenCallbackRef.current) {
          messageSeenCallbackRef.current(data);
        }
      }); */

        newConnection.on("MessageDeleted", (data: MessageDeletedData) => {
          console.log("Message deleted:", data);
          if (messageDeletedCallbackRef.current) {
            messageDeletedCallbackRef.current(data);
          }
        });
      });

      console.log("SignalR chat connected successfully");

      connectionRef.current = newConnection;
      setConnection(newConnection);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error("Error starting SignalR chat connection:", err);
      setError(err instanceof Error ? err.message : "Failed to connect");
      setIsConnected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopConnection = useCallback(async () => {
    if (connection) {
      try {
        await connection.stop();
        setConnection(null);
        setIsConnected(false);
        connectionRef.current = null;
      } catch (err) {
        console.error("Error stopping SignalR chat connection:", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (messageRequest: ChatMessageRequest) => {
      if (connection && connection.state === HubConnectionState.Connected) {
        try {
          await connection.invoke("SendMessage", messageRequest);
        } catch (err) {
          console.error("Error sending message:", err);
          setError(err instanceof Error ? err.message : "Failed to send message");
          throw err;
        }
      } else {
        const errorMsg = "SignalR connection not available";
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    },
    [connection],
  );

  /* const markAsRead = useCallback(async (conversationId: string, userId: string) => {
    if (connection && connection.state === HubConnectionState.Connected) {
      try {
        await connection.invoke("MarkAsRead", conversationId, userId);
      } catch (err) {
        console.error("Error marking messages as read:", err);
        setError(err instanceof Error ? err.message : "Failed to mark as read");
        throw err;
      }
    }
  }, [connection]); */

  // Event handler setters
  const onMessageReceived = useCallback((callback: (message: Message) => void) => {
    messageReceivedCallbackRef.current = callback;
  }, []);

  const onMessageSent = useCallback((callback: (message: Message) => void) => {
    messageSentCallbackRef.current = callback;
  }, []);

  /* const onMessageSeen = useCallback((callback: (data: MessageSeenData) => void) => {
    messageSeenCallbackRef.current = callback;
  }, []); */

  const onMessageDeleted = useCallback((callback: (data: MessageDeletedData) => void) => {
    messageDeletedCallbackRef.current = callback;
  }, []);

  const onException = useCallback((callback: (errorMessage: string) => void) => {
    exceptionCallbackRef.current = callback;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        console.log("Cleaning up SignalR chat connection");
        connectionRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return {
    connection,
    isConnected,
    error,
    startConnection,
    stopConnection,
    sendMessage,
    // markAsRead,
    onMessageReceived,
    onMessageSent,
    // onMessageSeen,
    onMessageDeleted,
    onException,
  };
};
