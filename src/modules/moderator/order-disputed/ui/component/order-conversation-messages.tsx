"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils/format-shorten-name";
import { MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface OrderConversationMessagesProps {
  messages: Array<{
    id: string;
    conversationId?: string | null;
    senderId?: string | null;
    text?: string | null;
    sentAt: string;
    senderProfileMessages: {
      avatar?: string | null;
      nickname?: string | null;
    };
  }>;
  clientId?: string;
  providerId?: string;
  hasMoreMessages?: boolean;
  loadMoreMessages?: () => void;
  isLoadingMore?: boolean;
}

export function OrderConversationMessages({
  messages,
  clientId,
  providerId,
  hasMoreMessages,
  loadMoreMessages,
  isLoadingMore,
}: OrderConversationMessagesProps) {

  if (!messages || messages.length === 0) {
    return (
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <MessageSquare className="h-5 w-5" />
            Conversation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center text-gray-400">
            No messages in this conversation
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-100">
          <MessageSquare className="h-5 w-5" />
          Conversation History ({messages.length} messages)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {/* Load More Button at Top */}
            {hasMoreMessages && (
              <div className="flex justify-center pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMoreMessages}
                  disabled={isLoadingMore}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load Earlier Messages"
                  )}
                </Button>
              </div>
            )}

            {messages.map((message) => {
              const isProvider = message.senderId === providerId;
              const isClient = message.senderId === clientId;
              return (
                <div key={message.id} className="flex gap-4">
                  {/* Left Column - Listener */}
                  <div className="flex-1">
                    {isClient && (
                      <div className="flex items-start gap-2">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={message.senderProfileMessages.avatar || undefined}
                            alt="Listener Avatar"
                          />
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {getUserInitials(message.senderProfileMessages.nickname || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="mb-1 flex items-center gap-2">
                            <Badge className="bg-green-500 text-white text-xs">Listener</Badge>
                            <span className="text-xs font-medium text-gray-300">
                              {message.senderProfileMessages.nickname}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.sentAt).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                          <div className="rounded-2xl rounded-tl-sm bg-gray-700 px-4 py-2 text-sm text-gray-100 break-words">
                            {message.text}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Artist */}
                  <div className="flex-1">
                    {isProvider && (
                      <div className="flex items-start gap-2 justify-end">
                        <div className="flex flex-col items-end">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {new Date(message.sentAt).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                            <Badge className="bg-main-purple text-white text-xs">Artist</Badge>
                            <span className="text-xs font-medium text-gray-300">
                              {message.senderProfileMessages.nickname}
                            </span>
                          </div>
                          <div className="rounded-2xl rounded-tr-sm bg-purple-600 px-4 py-2 text-sm text-white break-words">
                            {message.text}
                          </div>
                        </div>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={message.senderProfileMessages.avatar || undefined}
                            alt="Artist Avatar"
                          />
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {getUserInitials(message.senderProfileMessages.nickname || "")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
