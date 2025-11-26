import React from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { orderPackageOptions } from "@/gql/options/client-options";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { calculateDeadline } from "@/utils/calculate-deadline";
import { formatDate } from "@/utils/format-date";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationInfoRequestsProps {
  currentUserId: string;
  otherUserId: string;
  isArtist: boolean;
}

const ConversationInfoRequests = ({ currentUserId, otherUserId, isArtist }: ConversationInfoRequestsProps) => {
  const {
    data: orderPackage,
    isPending,
    isLoading,
    isFetching,
  } = useQuery(orderPackageOptions({ currentUserId, otherUserId, skip: 0, take: 1, isArtist }));

  if (isPending || isLoading || isFetching) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-[28px] w-48 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>

        <Skeleton className="h-16 w-full rounded-md" />
      </div>
    );
  }

  const orderPackageData = orderPackage?.packageOrders?.items?.[0];
  if (!orderPackageData) {
    return null;
  }

  const finalDeadline = calculateDeadline(
    orderPackageData?.startedAt,
    orderPackageData?.duration || 0,
    orderPackageData?.freezedTime,
  );

  const deadlineDisplay = formatDate(finalDeadline.toISOString());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-main-white text-lg font-semibold">Orders with {isArtist ? "you" : "artist"}</h3>
        <Link href={`/activities/conversation/${otherUserId}`} passHref>
          <Button variant="link" size="sm" className="h-auto p-0">
            To Order page
          </Button>
        </Link>
      </div>

      <Link href={`/activities/conversation/${isArtist ? otherUserId : currentUserId}`}>
        <div className="bg-main-card-bg hover:bg-main-purple/10 space-y-3 rounded-lg p-2 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="flex size-12 items-center justify-center rounded-md bg-purple-600">
              <span className="text-sm font-semibold text-white">S</span>
            </div>
            <div className="flex-1">
              <p className="text-main-white text-sm font-medium">{orderPackageData.package[0].packageName}</p>
              <p className="text-main-grey text-xs">{deadlineDisplay}</p>
            </div>
            <ArrowUpRightIcon className="text-main-grey size-6" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ConversationInfoRequests;
