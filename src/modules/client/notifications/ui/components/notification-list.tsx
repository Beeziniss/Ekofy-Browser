"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Loader2 } from "lucide-react";
import { formatNotificationTime } from "@/utils/notification-utils";

interface NotificationEdge {
  cursor: string;
  node: {
    id: string;
    createdAt: string;
    content: string;
    url?: string | null;
    isRead: boolean;
    readAt?: string | null;
  };
}

interface NotificationListProps {
  notifications: NotificationEdge[];
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onMarkAsRead?: (notificationId: string) => void;
}

export const NotificationList = ({
  notifications,
  hasMore = false,
  isLoading = false,
  onLoadMore,
  // onMarkAsRead,
}: NotificationListProps) => {
  const handleNotificationClick = (notification: NotificationEdge["node"]) => {
    // if (onMarkAsRead && !notification.isRead) {
    //   onMarkAsRead(notification.id);
    // }

    // Navigate to URL if provided
    if (notification.url) {
      window.location.href = notification.url;
    }
  };

  if (notifications.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="text-main-grey mb-4 h-12 w-12" />
        <p className="text-main-grey text-lg">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((edge) => {
        const notification = edge.node;
        const isRead = notification.isRead;

        return (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`hover:bg-main-grey/10 flex cursor-pointer items-start gap-4 rounded-lg p-4 transition-colors ${
              !isRead ? "border-l-4 border-l-blue-500 bg-blue-500/5" : ""
            }`}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={undefined} alt="Notification avatar" />
              <AvatarFallback>
                <Bell className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <p className="text-main-white text-sm leading-relaxed">{notification.content}</p>
              {notification.createdAt && (
                <p className="text-main-grey text-xs">{formatNotificationTime(notification.createdAt)}</p>
              )}
            </div>

            {/* {!isRead && onMarkAsRead && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-main-grey/20 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            )} */}
          </div>
        );
      })}

      {hasMore && onLoadMore && (
        <div className="flex justify-center py-4">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
