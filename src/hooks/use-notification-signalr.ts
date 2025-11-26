import { useEffect, useState, useCallback, useRef } from "react";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useAuthStore } from "@/store";

export interface NotificationResponse {
  content: string;
  avatar?: string;
  id?: string;
  createdAt?: string;
  isRead?: boolean;
}

export interface UseNotificationSignalRReturn {
  connection: HubConnection | null;
  isConnected: boolean;
  error: string | null;
  notifications: NotificationResponse[];
  unreadCount: number;
  startConnection: () => Promise<void>;
  stopConnection: () => Promise<void>;
  markAsRead: (notificationId?: string) => void;
  clearNotifications: () => void;
  // Event handlers
  onNotificationReceived: (callback: (notification: NotificationResponse) => void) => void;
  onException: (callback: (errorMessage: string) => void) => void;
}

export const useNotificationSignalR = (): UseNotificationSignalRReturn => {
  const { accessToken, user } = useAuthStore();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const connectionRef = useRef<HubConnection | null>(null);

  // Event callback refs to maintain stable references
  const notificationReceivedCallbackRef = useRef<((notification: NotificationResponse) => void) | null>(null);
  const exceptionCallbackRef = useRef<((errorMessage: string) => void) | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const startConnection = useCallback(async () => {
    if (!accessToken || !user) {
      console.log("No access token or user, skipping SignalR notification connection");
      return;
    }

    if (connection?.state === HubConnectionState.Connected) {
      return;
    }

    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/hub/notification`, {
          accessTokenFactory: () => accessToken || "",
          transport: HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Connection state handlers
      newConnection.onclose(() => {
        console.log("SignalR notification connection closed");
        setIsConnected(false);
      });

      newConnection.onreconnecting(() => {
        console.log("SignalR notification reconnecting...");
        setIsConnected(false);
      });

      newConnection.onreconnected(() => {
        console.log("SignalR notification reconnected");
        setIsConnected(true);
      });

      await newConnection.start().then(() => {
        console.log("SignalR notification connected successfully");

        // Set up event listeners
        newConnection.on("ReceiveNotification", (notification: NotificationResponse) => {
          console.log("Notification received:", notification);

          // Create notification with timestamp and read status
          const enhancedNotification: NotificationResponse = {
            ...notification,
            id: notification.id || Date.now().toString(),
            createdAt: notification.createdAt || new Date().toISOString(),
            isRead: false,
          };

          setNotifications((prev) => [enhancedNotification, ...prev].slice(0, 50)); // Keep only latest 50 notifications

          if (notificationReceivedCallbackRef.current) {
            notificationReceivedCallbackRef.current(enhancedNotification);
          }
        });

        newConnection.on("ReceiveException", (errorMessage: string) => {
          console.error("SignalR notification error:", errorMessage);
          setError(errorMessage);
          if (exceptionCallbackRef.current) {
            exceptionCallbackRef.current(errorMessage);
          }
        });
      });

      connectionRef.current = newConnection;
      setConnection(newConnection);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error("Error starting SignalR notification connection:", err);
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
        console.error("Error stopping SignalR notification connection:", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = useCallback((notificationId?: string) => {
    if (notificationId) {
      // Mark specific notification as read
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      );
    } else {
      // Mark all notifications as read
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Event handler setters
  const onNotificationReceived = useCallback((callback: (notification: NotificationResponse) => void) => {
    notificationReceivedCallbackRef.current = callback;
  }, []);

  const onException = useCallback((callback: (errorMessage: string) => void) => {
    exceptionCallbackRef.current = callback;
  }, []);

  // Start connection when user is authenticated
  useEffect(() => {
    if (accessToken && user) {
      startConnection();
    }
  }, [accessToken, user, startConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        console.log("Cleaning up SignalR notification connection");
        connectionRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return {
    connection,
    isConnected,
    error,
    notifications,
    unreadCount,
    startConnection,
    stopConnection,
    markAsRead,
    clearNotifications,
    onNotificationReceived,
    onException,
  };
};
