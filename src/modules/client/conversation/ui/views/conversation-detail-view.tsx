"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState, useCallback } from "react";
import ConversationItem from "../components/conversation-item";
import { ArrowUpIcon, EllipsisIcon, PlusIcon, SmileIcon } from "lucide-react";
import { useConversationSignalR } from "@/hooks/use-conversation-signalr";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { conversationDetailOptions, conversationMessagesOptions } from "@/gql/options/client-options";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { Message } from "@/gql/graphql";
import { MessageDeletedData } from "@/hooks/use-conversation-signalr";

interface ConversationDetailViewProps {
  conversationId: string;
}

const ConversationDetailView = ({ conversationId }: ConversationDetailViewProps) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Omit<Message, "receiverProfileMessages">[]>([]);
  // Track if user is manually scrolling to avoid auto-scroll interruptions
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Use the SignalR hook
  const {
    isConnected,
    startConnection,
    stopConnection,
    sendMessage: sendSignalRMessage,
    // markAsRead,
    onMessageReceived,
    onMessageSent,
    // onMessageSeen,
    onMessageDeleted,
    onException,
  } = useConversationSignalR();

  const { data: conversation } = useQuery(conversationDetailOptions(conversationId));
  const { data: conversationMessages } = useQuery(conversationMessagesOptions(conversationId));

  // Initialize messages from server data
  useEffect(() => {
    if (conversationMessages?.messages?.edges) {
      const newMessages = conversationMessages.messages.edges.map((edge) => edge.node);
      setMessages(newMessages);
    }
  }, [conversationMessages?.messages?.edges]);

  // Handle scroll events to detect user scrolling
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10; // 10px threshold

    setIsUserScrolling(!isAtBottom);
  }, []);

  // Auto-scroll to bottom with intelligent behavior
  const scrollToBottom = useCallback(
    (force = false) => {
      if (!force && isUserScrolling) return; // Don't auto-scroll if user is scrolling

      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [isUserScrolling],
  );

  // Mark messages as read when conversation is viewed
  /* useEffect(() => {
    if (isConnected && conversationId && user?.userId) {
      markAsRead(conversationId, user.userId).catch((error) => {
        console.error("Error marking messages as read:", error);
      });
    }
  }, [isConnected, conversationId, user?.userId, markAsRead]); */

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Setup SignalR connection and event handlers
  useEffect(() => {
    startConnection().catch((error) => {
      console.error("Failed to start SignalR connection:", error);
    });

    return () => {
      stopConnection().catch((error) => {
        console.error("Failed to stop SignalR connection:", error);
      });
    };
  }, [startConnection, stopConnection]);

  // Setup event handlers
  useEffect(() => {
    // Handle received messages
    const handleMessageReceived = (message: Message) => {
      // Only invalidate conversation list to update last message
      queryClient.invalidateQueries({ queryKey: ["conversation-list"] });
      queryClient.invalidateQueries({ queryKey: ["conversation-messages", message.conversationId] });
    };

    // Handle sent messages
    const handleMessageSent = (message: Message) => {
      /* console.log(message, "===================");

      setMessages((prev) => {
        // Prevent duplicates by checking if message already exists
        if (prev.some((msg) => msg.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      }); */
      // Only invalidate conversation list to update last message
      queryClient.invalidateQueries({ queryKey: ["conversation-list"] });
      queryClient.invalidateQueries({ queryKey: ["conversation-messages", message.conversationId] });
    };

    // Handle exceptions
    const handleException = (errorMessage: string) => {
      console.error("SignalR error:", errorMessage);
      // You might want to show a toast notification here
    };

    // Handle message deletion
    const handleMessageDeleted = (data: MessageDeletedData) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, deletedForIds: [...msg.deletedForIds, data.deletedBy] } : msg,
        ),
      );
    };

    onMessageReceived(handleMessageReceived);
    onMessageSent(handleMessageSent);
    onException(handleException);
    onMessageDeleted(handleMessageDeleted);
  }, [conversationId, queryClient, onMessageReceived, onMessageSent, onException, onMessageDeleted]);

  const sendMessage = async () => {
    if (isConnected && newMessage.trim() && conversation?.conversations?.items?.[0]) {
      try {
        const conversationData = conversation.conversations.items[0];
        // Find the other user ID (not current user)
        const receiverId = conversationData.userIds.find((id) => id !== user?.userId);

        if (receiverId && user?.userId) {
          // Create ChatMessageRequest object to match backend
          const chatMessageRequest = {
            ConversationId: conversationId,
            SenderId: user.userId,
            ReceiverId: receiverId,
            Text: newMessage.trim(),
          };

          await sendSignalRMessage(chatMessageRequest);
          setNewMessage("");
          // Force scroll to bottom after sending message
          setTimeout(() => scrollToBottom(true), 100);
        } else {
          console.error("Could not determine receiver ID");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-main-grey-1 flex items-center justify-between border-b p-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-x-3">
            <div className="size-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold">
              {conversation?.conversations?.items?.[0].otherProfileConversation.nickname}
            </span>
          </div>
          {/* <div className="text-muted-foreground text-sm">Last seen: 5 minutes ago</div> */}
        </div>

        <Button variant={"ghost"} size={"iconMd"} className="shrink-0">
          <EllipsisIcon className="text-main-white size-5" />
        </Button>
      </div>

      <div
        ref={messagesContainerRef}
        className="messages-scroll flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto scroll-smooth px-3 pt-2"
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <ConversationItem key={`${msg.id}-${msg.sentAt}`} message={msg} userId={user?.userId || ""} />
        ))}
        <div ref={bottomRef} className="h-1" /> {/* auto-scroll anchor with minimal height */}
      </div>

      <div className="px-3 pb-3">
        <InputGroup>
          <InputGroupTextarea
            placeholder="Ask, Search or Chat..."
            className="max-h-48"
            autoFocus
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton variant="outline" className="rounded-full" size="icon-xs">
              <PlusIcon />
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant="ghost">
                  <SmileIcon className="size-5" />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="[--radius:0.95rem]">
                <DropdownMenuItem>Auto</DropdownMenuItem>
                <DropdownMenuItem>Agent</DropdownMenuItem>
                <DropdownMenuItem>Manual</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              variant="default"
              className="ml-auto rounded-full"
              size="icon-xs"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <ArrowUpIcon />
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
};

export default ConversationDetailView;
