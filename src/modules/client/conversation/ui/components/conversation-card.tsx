"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/gql/graphql";
import { getUserInitials } from "@/utils/format-shorten-name";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ConversationCardProps {
  conversation: Omit<Conversation, "createdAt" | "deletedFor" | "status">;
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
  const pathname = usePathname();
  const otherUserProfile = conversation.otherProfileConversation;
  const lastMessage = conversation.lastMessage;

  // Check if the current conversation is active (URL matches conversation ID)
  const isActive = pathname === `/inbox/${conversation.id}`;

  return (
    <Link
      href={`/inbox/${conversation.id}`}
      className={cn(
        "text-main-white hover:bg-main-grey-1 flex w-full cursor-pointer items-center justify-between rounded-md p-2 transition-colors",
        isActive && "bg-main-grey-1 border-main-purple border-l-2",
      )}
    >
      <div className="flex items-center gap-x-3">
        <Avatar className="size-12">
          <AvatarImage src={otherUserProfile?.avatar || undefined} alt="User Avatar" />
          <AvatarFallback>{getUserInitials(otherUserProfile?.nickname)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col max-w-[200px]">
          <div className="text-sm font-semibold line-clamp-1">{otherUserProfile.nickname}</div>
          <div className="line-clamp-1 text-xs text-gray-400">{lastMessage?.text || "No messages yet"}</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-y-1.5">
        <div className="text-sm">{lastMessage?.sentAt ? formatDistanceToNow(new Date(lastMessage?.sentAt)) : ""}</div>
        {lastMessage?.senderId && <div className="primary_gradient size-2 rounded-full" />}
      </div>
    </Link>
  );
};

export default ConversationCard;
