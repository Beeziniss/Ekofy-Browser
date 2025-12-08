"use client";

import { useAuthStore } from "@/store";
import { Loader2 } from "lucide-react";
import { NotificationList } from "../components/notification-list";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationInfiniteOptions } from "@/gql/options/client-options";
import { useMemo } from "react";

export const NotificationView = () => {
  const { user } = useAuthStore();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    notificationInfiniteOptions(user?.userId || "", 5),
  );

  // Flatten all notifications from all pages
  const allNotifications = useMemo(() => data?.pages.flatMap((page) => page.notifications?.edges || []) || [], [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // const handleMarkAsRead = (notificationId: string) => {
  //   // TODO: Call API to mark notification as read
  //   console.log("Mark as read:", notificationId);
  //   // Invalidate query to refetch with updated data
  //   queryClient.invalidateQueries({ queryKey: ["notifications", user?.userId] });
  // };

  // const handleMarkAllAsRead = () => {
  //   // TODO: Call API to mark all notifications as read
  //   console.log("Mark all as read");
  //   // Invalidate query to refetch with updated data
  //   queryClient.invalidateQueries({ queryKey: ["notifications", user?.userId] });
  // };

  // const handleClearAll = () => {
  //   // TODO: Call API to clear all notifications
  //   console.log("Clear all notifications");
  //   // Invalidate query to refetch
  //   queryClient.invalidateQueries({ queryKey: ["notifications", user?.userId] });
  // };

  const unreadCount = allNotifications.filter((edge) => !edge.node.isRead).length;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-main-white text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-main-grey mt-1 text-sm">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {/* <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  <Check className="mr-2 h-4 w-4" />
                  Mark all as read
                </Button>
              )}
              {allNotifications.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all
                </Button>
              )}
            </div> */}
          </div>
        </CardHeader>

        <CardContent>
          <NotificationList
            notifications={allNotifications}
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={handleLoadMore}
            // onMarkAsRead={handleMarkAsRead}
          />
        </CardContent>
      </Card>
    </div>
  );
};
