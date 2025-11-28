import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { calculateDeadline } from "@/utils/calculate-deadline";
import { orderPackageOptions } from "@/gql/options/client-options";
import { useMemo, memo } from "react";

interface ConversationInfoRequestsProps {
  currentUserId: string;
  otherUserId: string;
  isArtist: boolean;
  conversationId?: string;
  requestId?: string | null;
}

const ConversationInfoRequests = memo(
  ({ currentUserId, otherUserId, isArtist, conversationId, requestId }: ConversationInfoRequestsProps) => {
    // Memoize query options to prevent unnecessary re-renders
    const queryOptions = useMemo(() => {
      const options = {
        currentUserId,
        otherUserId,
        skip: 0,
        take: 1,
        isArtist,
      };

      // Only pass conversationId if the conversation has a requestId
      if (requestId && conversationId) {
        return orderPackageOptions({ ...options, conversationId });
      }

      // Fallback to original query without conversationId
      return orderPackageOptions(options);
    }, [currentUserId, otherUserId, isArtist, conversationId, requestId]);

    const { data: orderPackage, isPending, isError } = useQuery(queryOptions);

    // Memoize calculated values to prevent re-calculations (must be before early returns)
    const deadlineDisplay = useMemo(() => {
      if (!orderPackage?.packageOrders?.items?.length) return "";

      const orderPackageData = orderPackage.packageOrders.items[0];
      const rawDeadline = calculateDeadline(
        orderPackageData?.startedAt,
        orderPackageData?.duration || 0,
        orderPackageData?.freezedTime,
      );

      const finalDeadline = rawDeadline instanceof Date && !isNaN(rawDeadline.getTime()) ? rawDeadline : new Date();
      return formatDate(finalDeadline.toISOString());
    }, [orderPackage?.packageOrders?.items]);

    // Show skeleton while loading
    if (isPending) {
      return <ConversationInfoRequestsSkeleton />;
    }

    // Handle error state
    if (isError || !orderPackage?.packageOrders?.items?.length) {
      return null;
    }

    const orderPackageData = orderPackage.packageOrders.items[0];

    // Determine the correct links based on whether we're showing a specific order or general orders
    const isSpecificOrder = requestId && conversationId;
    const orderPageLink = isSpecificOrder
      ? `/orders/${orderPackageData.id}/details`
      : `/activities/conversation/${otherUserId}`;
    const packageLink = isSpecificOrder
      ? `/orders/${orderPackageData.id}/details`
      : `/activities/conversation/${isArtist ? otherUserId : currentUserId}`;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-main-white text-lg font-semibold">Orders with {isArtist ? "you" : "artist"}</h3>
          <Link href={orderPageLink} passHref>
            <Button variant="link" size="sm" className="h-auto p-0">
              To Order page
            </Button>
          </Link>
        </div>

        <Link href={packageLink}>
          <div className="bg-main-card-bg hover:bg-main-purple/10 space-y-3 rounded-lg p-2 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-md bg-purple-600">
                <span className="text-sm font-semibold text-white">S</span>
              </div>
              <div className="flex-1">
                <p className="text-main-white text-sm font-medium">{orderPackageData?.package[0].packageName}</p>
                <p className="text-main-grey text-xs">{deadlineDisplay}</p>
              </div>
              <ArrowUpRightIcon className="text-main-grey size-6" />
            </div>
          </div>
        </Link>
      </div>
    );
  },
);

ConversationInfoRequests.displayName = "ConversationInfoRequests";

const ConversationInfoRequestsSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-[28px] w-48 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
      <Skeleton className="h-16 w-full rounded-md" />
    </div>
  );
};

export default ConversationInfoRequests;
