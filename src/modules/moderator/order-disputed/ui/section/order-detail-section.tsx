"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { moderatorPackageOrderDetailOptions, moderatorOrderConversationMessagesOptions } from "@/gql/options/moderator-options";
import { OrderDetailInfo, OrderDetailActions } from "../component";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PackageOrderDetail } from "@/types";
import { useMemo } from "react";

interface OrderDetailSectionProps {
  orderId: string;
}

export function OrderDetailSection({ orderId }: OrderDetailSectionProps) {
  const { data: order, isLoading, error } = useQuery(moderatorPackageOrderDetailOptions(orderId));

  // Fetch conversation messages using infinite query with cursor pagination
  const conversationId = order?.conversationId || "";
  const { 
    data: conversationMessagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...moderatorOrderConversationMessagesOptions(conversationId, 50),
    enabled: !!conversationId,
  });

  // Flatten all messages from all pages (already in chronological order: oldest first)
  const messages = useMemo(() => {
    if (!conversationMessagesData?.pages) return [];
    
    const allMessages = conversationMessagesData.pages.flatMap(
      (page) => page.messages?.edges?.map((edge) => edge.node) || []
    );
    return allMessages;
  }, [conversationMessagesData]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load order details");
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error loading order details</p>
          <p className="text-sm text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Order not found</p>
        </div>
      </div>
    );
  }

  const payment = order.paymentTransaction?.[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left side - Order Details (2/3 width) */}
      <div className="lg:col-span-2">
        <OrderDetailInfo 
          order={order as PackageOrderDetail} 
          conversationMessages={messages}
          hasMoreMessages={hasNextPage}
          loadMoreMessages={fetchNextPage}
          isLoadingMore={isFetchingNextPage}
        />
      </div>

      {/* Right side - Actions (1/3 width) */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <OrderDetailActions
            orderId={order.id}
            orderAmount={payment?.amount || 0}
            currency={payment?.currency || "USD"}
          />
        </div>
      </div>
    </div>
  );
}
