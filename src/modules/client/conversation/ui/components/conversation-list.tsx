"use client";

import { conversationListOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import ConversationCard from "./conversation-card";
import { MessageCircleIcon, SearchIcon } from "lucide-react";

const ConversationList = () => {
  const { user } = useAuthStore();
  const { data: conversationList } = useQuery(conversationListOptions(user?.userId || ""));

  if (!user?.userId) {
    return <div>Please log in to view conversations</div>;
  }

  if (!conversationList || conversationList?.conversations?.totalCount === 0) {
    return <div className="px-4">No Conversations available</div>;
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-x-3">
          <MessageCircleIcon className="text-main-white size-6" />
          <div className="text-main-white font-semibold">Conversation</div>
        </div>
        <SearchIcon className="text-main-white hover:text-main-link size-5" />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-y-1 overflow-y-auto px-2">
        {conversationList.conversations?.items?.map((conversation) => (
          <ConversationCard key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
