"use client";

import { conversationListOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import ConversationCard from "./conversation-card";
import { MessageCircleIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConversationStatus } from "@/gql/graphql";
import { useState, useMemo, memo } from "react";
import { cn } from "@/lib/utils";

// Define the allowed conversation statuses for filtering
type FilterableStatus = ConversationStatus.None | ConversationStatus.InProgress | ConversationStatus.Completed | ConversationStatus.Pending;

// Define the status mapping
const STATUS_CONFIG: Record<
  FilterableStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "ekofy";
    description: string;
  }
> = {
  [ConversationStatus.None]: {
    label: "General",
    variant: "ekofy",
    description: "New and general conversations",
  },
  [ConversationStatus.InProgress]: {
    label: "Working",
    variant: "ekofy",
    description: "Active ongoing conversations",
  },
  [ConversationStatus.Completed]: {
    label: "Archived",
    variant: "ekofy",
    description: "Completed conversations",
  },
  [ConversationStatus.Pending]: {
    label: "Public",
    variant: "ekofy",
    description: "Public request conversations",
  },
};

// Helper function to check if a status is filterable
const isFilterableStatus = (status: ConversationStatus): status is FilterableStatus => {
  return status in STATUS_CONFIG;
};

const ConversationList = memo(() => {
  const { user } = useAuthStore();
  const [selectedStatus, setSelectedStatus] = useState<FilterableStatus>(ConversationStatus.None);

  // Query conversations filtered by selected status (server-side filtering)
  const { data: filteredConversations } = useQuery(conversationListOptions(user?.userId || "", selectedStatus));

  // Query all conversations to get counts for badges (no status filter)
  const { data: allConversations } = useQuery(conversationListOptions(user?.userId || ""));

  // Memoize conversation counts for each status
  const conversationCounts = useMemo(() => {
    const counts: Record<FilterableStatus, number> = {
      [ConversationStatus.None]: 0,
      [ConversationStatus.InProgress]: 0,
      [ConversationStatus.Completed]: 0,
      [ConversationStatus.Pending]: 0,
    };

    if (!allConversations?.conversations?.items) {
      return counts;
    }

    allConversations.conversations.items.forEach((conversation) => {
      if (isFilterableStatus(conversation.status)) {
        counts[conversation.status]++;
      }
    });

    return counts;
  }, [allConversations?.conversations?.items]);

  if (!user?.userId) {
    return <div className="px-4">Please log in to view conversations</div>;
  }

  if (!allConversations || allConversations?.conversations?.totalCount === 0) {
    return <div className="px-4">No Conversations available</div>;
  }

  const currentConversations = filteredConversations?.conversations?.items || [];

  const handleStatusClick = (status: FilterableStatus) => {
    setSelectedStatus(status);
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-x-3">
          <MessageCircleIcon className="text-main-white size-6" />
          <div className="text-main-white font-semibold">Conversation</div>
        </div>
        <SearchIcon className="text-main-white hover:text-main-link size-5 cursor-pointer" />
      </div>

      {/* Status Filter Badges */}
      <div className="flex gap-2 px-4">
        {(Object.entries(STATUS_CONFIG) as [FilterableStatus, (typeof STATUS_CONFIG)[FilterableStatus]][]).map(
          ([status, config]) => {
            const count = conversationCounts[status];
            const isActive = selectedStatus === status;

            return (
              <Badge
                key={status}
                variant={isActive ? config.variant : "outline"}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105",
                  isActive ? "ring-primary/20 ring-2" : "hover:bg-accent/10",
                )}
                onClick={() => handleStatusClick(status)}
                title={config.description}
              >
                {config.label} {count > 0 && <span className="ml-1">({count})</span>}
              </Badge>
            );
          },
        )}
      </div>

      {/* Conversations List */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-y-1 overflow-y-auto px-2">
        {currentConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageCircleIcon className="text-main-grey mb-3 size-12 opacity-50" />
            <p className="text-main-grey text-sm">
              No conversations in {STATUS_CONFIG[selectedStatus].label.toLowerCase()}
            </p>
            <p className="text-main-grey/70 mt-1 text-xs">{STATUS_CONFIG[selectedStatus].description}</p>
          </div>
        ) : (
          <>
            {/* Section Header */}
            <div className="px-2 py-2">
              <p className="text-main-white/80 text-sm font-medium">
                {STATUS_CONFIG[selectedStatus].label} ({currentConversations.length})
              </p>
              <p className="text-main-grey text-xs">{STATUS_CONFIG[selectedStatus].description}</p>
            </div>

            {/* Conversation Cards */}
            {currentConversations.map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
          </>
        )}
      </div>
    </div>
  );
});

ConversationList.displayName = "ConversationList";

export default ConversationList;
