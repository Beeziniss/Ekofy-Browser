import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/gql/graphql";
import { getUserInitials } from "@/utils/format-shorten-name";

interface ConversationItemProps {
  message: Omit<Message, "receiverProfileMessages">;
  userId: string;
}

const ConversationItem = React.memo(({ message, userId }: ConversationItemProps) => {
  const isCurrentUser = message.senderId === userId;

  if (isCurrentUser) {
    // Current user messages - right aligned
    return (
      <div className="flex items-start justify-end gap-x-2">
        <div className="flex max-w-[70%] flex-col items-end">
          <div className="flex flex-row-reverse items-center gap-x-2">
            <div className="text-main-white text-base font-semibold">You</div>
            <div className="text-muted-foreground text-xs font-normal">
              {new Date(message.sentAt).toLocaleString("en-US", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </div>
          </div>
          <div className="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-sm break-words text-white">{message.text}</div>
        </div>
        <Avatar className="size-8">
          <AvatarImage src={message?.senderProfileMessages.avatar || undefined} alt="User Avatar" />
          <AvatarFallback>{getUserInitials(message?.senderProfileMessages.nickname)}</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  // Other user messages - left aligned
  return (
    <div className="flex items-start gap-x-2">
      <Avatar className="size-8">
        <AvatarImage src={message?.senderProfileMessages.avatar || undefined} alt="User Avatar" />
        <AvatarFallback>{getUserInitials(message?.senderProfileMessages.nickname)}</AvatarFallback>
      </Avatar>
      <div className="flex max-w-[70%] flex-col">
        <div className="flex items-center gap-x-2">
          <div className="text-main-white text-base font-semibold">{message.senderProfileMessages.nickname}</div>
          <div className="text-muted-foreground text-xs font-normal">
            {new Date(message.sentAt).toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
        </div>
        <div className="mt-1 w-fit rounded-lg bg-gray-700 px-3 py-2 text-sm break-words text-white">{message.text}</div>
      </div>
    </div>
  );
});

ConversationItem.displayName = "ConversationItem";

export default ConversationItem;
