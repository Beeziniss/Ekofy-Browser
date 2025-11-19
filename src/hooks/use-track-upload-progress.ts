import { useEffect, useState, useCallback } from "react";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useAuthStore } from "@/store";

export interface UploadProgress {
  percent: number;
  stepDescription: string;
}

export interface UseTrackUploadProgressReturn {
  connection: HubConnection | null;
  progress: UploadProgress | null;
  isCompleted: boolean;
  isConnected: boolean;
  error: string | null;
  startConnection: () => Promise<void>;
  stopConnection: () => Promise<void>;
  resetProgress: () => void;
}

export const useTrackUploadProgress = (): UseTrackUploadProgressReturn => {
  const { accessToken } = useAuthStore();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConnection = useCallback(async () => {
    if (connection?.state === HubConnectionState.Connected) {
      return;
    }

    try {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/hub/track-upload`, {
          accessTokenFactory: () => accessToken || "",
          transport: HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Connection state handlers
      // newConnection.onclose(() => {
      //   console.log("SignalR connection closed");
      //   setIsConnected(false);
      // });

      // newConnection.onreconnecting(() => {
      //   console.log("SignalR reconnecting...");
      //   setIsConnected(false);
      // });

      // newConnection.onreconnected(() => {
      //   console.log("SignalR reconnected");
      //   setIsConnected(true);
      // });

      await newConnection.start().then(() => {
        // Set up event listeners
        newConnection.on("ReceiveProgress", (progressData: UploadProgress) => {
          console.log("=========================FUCK======================");
          console.log("Progress received:", progressData);
          console.log("=========================FUCK======================");

          setProgress(progressData);
          setError(null);
          setIsCompleted(false);
        });

        newConnection.on("ReceiveCompleted", () => {
          console.log("Upload completed");
          setIsCompleted(true);
          setProgress((prev) => (prev ? { ...prev, percent: 100 } : { percent: 100, stepDescription: "Completed" }));
          setError(null);
        });

        newConnection.on("ReceiveFailed", (errorMessage: string) => {
          console.log("Upload failed:", errorMessage);
          setError(errorMessage);
          setIsCompleted(false);
        });
      });
      console.log("SignalR connected successfully");

      setConnection(newConnection);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error("Error starting SignalR connection:", err);
      setError(err instanceof Error ? err.message : "Failed to connect");
      setIsConnected(false);
    }
  }, [connection]);

  const stopConnection = useCallback(async () => {
    if (connection) {
      try {
        await connection.stop();
        setConnection(null);
        setIsConnected(false);
      } catch (err) {
        console.error("Error stopping SignalR connection:", err);
      }
    }
  }, [connection]);

  const resetProgress = useCallback(() => {
    setProgress(null);
    setIsCompleted(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (connection) {
        connection.stop().catch(console.error);
      }
    };
  }, [connection]);

  return {
    connection,
    progress,
    isCompleted,
    isConnected,
    error,
    startConnection,
    stopConnection,
    resetProgress,
  };
};
