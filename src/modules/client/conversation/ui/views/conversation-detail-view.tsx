"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ConversationItem from "../components/conversation-item";
import {
  ArrowUpIcon,
  BadgeDollarSignIcon,
  EllipsisIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  NewspaperIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import { useConversationSignalR } from "@/hooks/use-conversation-signalr";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  conversationDetailOptions,
  conversationMessagesOptions,
  servicePackageOptions,
  orderPackageOptions,
  requestByIdOptions,
} from "@/gql/options/client-options";
import { sendRequestMutationOptions } from "@/gql/options/client-mutation-options";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { Message, CreateDirectRequestInput, PackageOrderStatus, ConversationStatus } from "@/gql/graphql";
import { MessageDeletedData } from "@/hooks/use-conversation-signalr";
import ConversationInfo from "../components/conversation-info";
import { UserRole } from "@/types/role";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckIcon, PackageIcon } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ConversationDetailViewProps {
  conversationId: string;
}

const ConversationDetailView = ({ conversationId }: ConversationDetailViewProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [showConversationInfo, setShowConversationInfo] = useState(true);
  const [messages, setMessages] = useState<Omit<Message, "receiverProfileMessages">[]>([]);
  const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set());
  const maxCharacters = 5000;

  // Memoize derived values to prevent unnecessary re-renders
  const isArtist = useMemo(() => user?.role === UserRole.ARTIST, [user?.role]);
  const currentUserId = useMemo(() => user?.userId, [user?.userId]);

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

  const {
    data: conversation,
    error: conversationError,
    isLoading: conversationLoading,
  } = useQuery(conversationDetailOptions(conversationId));
  const { data: conversationMessages } = useQuery(conversationMessagesOptions(conversationId));

  // Get conversation request ID and status
  const conversationRequestId = useMemo(
    () => conversation?.conversations?.items?.[0]?.requestId,
    [conversation?.conversations?.items],
  );
  const conversationStatus = useMemo(
    () => conversation?.conversations?.items?.[0]?.status,
    [conversation?.conversations?.items],
  );

  // Check if conversation is cancelled
  const isCancelled = useMemo(() => conversationStatus === ConversationStatus.Cancelled, [conversationStatus]);

  // Fetch public request details if conversation has requestId and status is Pending
  const { data: publicRequest } = useQuery({
    ...requestByIdOptions(conversationRequestId || ""),
    enabled: !!conversationRequestId && conversationStatus === ConversationStatus.Pending,
  });

  // Authentication and Authorization check
  useEffect(() => {
    // Check authentication first
    if (!user) {
      router.push("/");
      return;
    }

    // If there's an error fetching the conversation, redirect to unauthorized
    if (conversationError) {
      router.push("/unauthorized");
      return;
    }

    // Wait for conversation to load before checking authorization
    if (conversationLoading) {
      return;
    }

    // If conversation loaded but is empty or user is not in the conversation, redirect
    if (conversation) {
      const conversationItem = conversation.conversations?.items?.[0];

      if (!conversationItem) {
        // Conversation doesn't exist or user has no access
        router.push("/unauthorized");
        return;
      }

      const conversationUserIds = conversationItem.userIds;
      const isAuthorized = conversationUserIds.includes(user.userId);

      if (!isAuthorized) {
        router.push("/unauthorized");
      }
    }
  }, [conversation, conversationError, conversationLoading, user, router]);

  // Get other user ID for service package query
  const { data: servicePackages } = useQuery({
    ...servicePackageOptions({
      artistId: conversation?.conversations?.items?.[0].otherProfileConversation!.artistId as string | undefined,
    }),
    enabled: !!conversation?.conversations?.items?.[0].otherProfileConversation!.artistId,
  });

  // Get order package to check for disputed status
  const otherUserId = useMemo(
    () => conversation?.conversations?.items?.[0]?.userIds?.find((id) => id !== currentUserId),
    [conversation?.conversations?.items, currentUserId],
  );

  const { data: orderPackage } = useQuery({
    ...orderPackageOptions({
      currentUserId: currentUserId || "",
      otherUserId: otherUserId || "",
      isArtist,
      conversationId,
      skip: 0,
      take: 1,
    }),
    enabled: !!currentUserId && !!otherUserId,
  });

  // Check if order is disputed
  const isOrderDisputed = useMemo(() => {
    return orderPackage?.packageOrders?.items?.[0]?.status === PackageOrderStatus.Disputed;
  }, [orderPackage?.packageOrders?.items]);

  // Send request mutation
  const sendRequestMutation = useMutation(sendRequestMutationOptions);

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
      queryClient.invalidateQueries({ queryKey: ["conversation-list"] });
      queryClient.invalidateQueries({ queryKey: ["conversation-messages", message.conversationId] });

      // Force scroll to bottom after sending message
      setTimeout(() => scrollToBottom(true), 100);
    };

    // Handle sent messages
    const handleMessageSent = (message: Message) => {
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
  }, [conversationId, queryClient, onMessageReceived, onMessageSent, onException, onMessageDeleted, scrollToBottom]);

  const sendMessage = async () => {
    // Don't allow sending messages if order is disputed
    if (isOrderDisputed) {
      toast.error("Chat is disabled due to disputed order");
      return;
    }

    // Don't allow sending messages if conversation is cancelled
    if (isCancelled) {
      toast.error("This conversation has been cancelled");
      return;
    }

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

  const handleCreateRequest = async () => {
    try {
      if (!selectedPackageId) {
        toast.error("Please select a service package");
        return;
      }

      if (!currentUserId || !conversation?.conversations?.items?.[0]?.requestId) {
        toast.error("Invalid conversation data");
        return;
      }

      const requestInput: CreateDirectRequestInput = {
        artistId: currentUserId,
        packageId: selectedPackageId,
        publicRequestId: conversation.conversations.items[0].requestId,
      };

      await sendRequestMutation.mutateAsync({
        request: requestInput,
        isDirect: false, // Public request as specified
      });

      toast.success("Request sent successfully!");
      setShowCreateRequestDialog(false);
      setSelectedPackageId("");

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      queryClient.invalidateQueries({ queryKey: ["listener-requests"] });
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Failed to send request. Please try again.");
    }
  };

  const togglePackageExpansion = (packageId: string) => {
    setExpandedPackages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  return (
    <>
      <div
        className={`bg-main-dark-1 relative ${showConversationInfo ? "col-span-6" : "col-span-9"} flex h-full flex-col overflow-hidden rounded-md transition-all duration-300`}
      >
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

            <Button
              variant={"ghost"}
              size={"iconMd"}
              className="shrink-0"
              onClick={() => setShowConversationInfo(!showConversationInfo)}
            >
              <EllipsisIcon className="text-main-white size-5" />
            </Button>
          </div>

          {/* Cancelled Conversation Notification */}
          {isCancelled && (
            <div className="mx-3 mt-3">
              <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-x-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 text-red-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-bold text-red-400">Conversation Cancelled</div>
                    <div className="text-xs text-red-300/80">
                      This conversation has been cancelled. No further interactions are allowed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Public Request Notification - Only shown when status is Pending */}
          {conversationStatus === ConversationStatus.Pending && conversationRequestId && publicRequest && (
            <div className="mx-3 mt-3">
              <div className="bg-main-white flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-x-3">
                  <NewspaperIcon className="text-main-blue size-7 shrink-0" />

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-bold text-gray-900">Title: {publicRequest.title}</div>
                    <div className="text-main-dark-1 text-xs">This conversation belong to a public request.</div>
                  </div>
                </div>

                <Link href={`/request-hub/${publicRequest.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-main-white dark:bg-main-blue dark:hover:bg-main-blue/90"
                  >
                    Open <ArrowUpRightIcon className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div
            ref={messagesContainerRef}
            className="messages-scroll flex min-h-0 flex-1 flex-col justify-end-safe space-y-4 overflow-y-auto scroll-smooth px-3 pt-2"
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
                placeholder={
                  isOrderDisputed
                    ? "Chat is disabled due to disputed order"
                    : isCancelled
                      ? "This conversation has been cancelled"
                      : "Send a message..."
                }
                className="max-h-48"
                autoFocus
                value={newMessage}
                disabled={isOrderDisputed || isCancelled}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue.length <= maxCharacters) {
                    setNewMessage(inputValue);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                maxLength={maxCharacters}
              />
              <InputGroupAddon align="block-end">
                {/* <InputGroupButton variant="outline" className="rounded-full" size="icon-xs" disabled={isOrderDisputed}>
                  <PlusIcon />
                </InputGroupButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton variant="ghost" disabled={isOrderDisputed}>
                      <SmileIcon className="size-5" />
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="[--radius:0.95rem]">
                    <DropdownMenuItem>Auto</DropdownMenuItem>
                    <DropdownMenuItem>Agent</DropdownMenuItem>
                    <DropdownMenuItem>Manual</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}

                <InputGroupButton
                  variant={"default"}
                  onClick={() => setShowCreateRequestDialog(true)}
                  disabled={
                    !currentUserId ||
                    !conversation?.conversations?.items?.[0]?.requestId ||
                    isArtist ||
                    isOrderDisputed ||
                    isCancelled
                  }
                >
                  <BadgeDollarSignIcon className="size-4.5" /> Create request
                </InputGroupButton>

                <InputGroupButton
                  variant="default"
                  className="ml-auto rounded-full"
                  size="icon-xs"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isOrderDisputed || isCancelled}
                >
                  <ArrowUpIcon />
                  <span className="sr-only">Send</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>

      {showConversationInfo && (
        <div className="bg-main-dark-1 col-span-3 h-full overflow-hidden rounded-md px-4 py-6 transition-all duration-300">
          <ConversationInfo
            avatarImage={conversation?.conversations?.items?.[0].otherProfileConversation.avatar}
            currentUserId={currentUserId || ""}
            otherUserId={conversation?.conversations?.items?.[0].userIds.find((id) => id !== currentUserId) || ""}
            nickname={conversation?.conversations?.items?.[0].otherProfileConversation.nickname}
            isArtist={isArtist}
            conversationId={conversationId}
            requestId={conversation?.conversations?.items?.[0].requestId}
          />
        </div>
      )}

      {/* Create Request Dialog */}
      <Dialog open={showCreateRequestDialog} onOpenChange={setShowCreateRequestDialog}>
        <DialogContent className="w-full !max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Request</DialogTitle>
            <DialogDescription>
              Send a request for a service package from{" "}
              {conversation?.conversations?.items?.[0].otherProfileConversation.nickname}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Select Service Package <span className="text-red-500">*</span>
              </label>
              <div className="max-h-80 space-y-3 overflow-y-auto">
                {servicePackages?.artistPackages?.items?.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={cn(
                      "hover:bg-accent/50 relative cursor-pointer rounded-lg border p-4 shadow-xs transition-all",
                      selectedPackageId === pkg.id ? "bg-primary/5 border-main-purple/70" : "border-border",
                    )}
                    onClick={() => setSelectedPackageId(pkg.id)}
                  >
                    {selectedPackageId === pkg.id && (
                      <div className="text-primary absolute right-3 bottom-3">
                        <CheckIcon className="size-6 text-emerald-500" />
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <PackageIcon className="text-muted-foreground size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-foreground text-base font-semibold">{pkg.packageName}</h3>
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                              {pkg.description || "No description available"}
                            </p>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <div className="text-primary text-lg font-bold">{formatCurrency(pkg.amount)}</div>
                          </div>
                        </div>

                        {pkg.serviceDetails && pkg.serviceDetails.length > 0 && (
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePackageExpansion(pkg.id);
                                }}
                                variant={"ghost"}
                              >
                                {expandedPackages.has(pkg.id) ? (
                                  <>
                                    Hide details
                                    <ChevronUpIcon className="size-5" />
                                  </>
                                ) : (
                                  <>
                                    Show details ({pkg.serviceDetails.length})
                                    <ChevronDownIcon className="size-5" />
                                  </>
                                )}
                              </Button>
                            </div>
                            {expandedPackages.has(pkg.id) && (
                              <div>
                                <div className="text-muted-foreground text-sm font-medium">What&apos;s included:</div>
                                <ul className="mt-2 space-y-1">
                                  {pkg.serviceDetails.map((detail, index) => (
                                    <li key={index} className="text-muted-foreground flex items-center gap-2 text-sm">
                                      <div className="bg-primary h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                                      {detail.value}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!servicePackages?.artistPackages?.items || servicePackages.artistPackages.items.length === 0) && (
                  <div className="text-muted-foreground py-8 text-center">
                    <PackageIcon className="mx-auto mb-3 size-12 opacity-50" />
                    <p className="text-sm">No service packages available</p>
                    <p className="mt-1 text-xs">This artist hasn&apos;t published any service packages yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateRequestDialog(false);
                setSelectedPackageId("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ekofy"
              onClick={handleCreateRequest}
              disabled={!selectedPackageId || sendRequestMutation.isPending}
            >
              {sendRequestMutation.isPending ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversationDetailView;
