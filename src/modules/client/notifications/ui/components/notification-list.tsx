"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, Music, MessageSquare, ShoppingBag, ListMusic, FileText, Star, Disc3 } from "lucide-react";
import { formatNotificationTime } from "@/utils/notification-utils";
import { NotificationRelatedType } from "@/gql/graphql";

interface NotificationEdge {
  cursor: string;
  node: {
    id: string;
    createdAt: string;
    content: string;
    url?: string | null;
    isRead: boolean;
    readAt?: string | null;
    relatedType?: NotificationRelatedType | null;
  };
}

interface NotificationListProps {
  notifications: NotificationEdge[];
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onMarkAsRead?: (notificationId: string) => void;
}

const getNotificationIcon = (relatedType?: NotificationRelatedType | null) => {
  switch (relatedType) {
    case NotificationRelatedType.Album:
      return Disc3;
    case NotificationRelatedType.Track:
      return Music;
    case NotificationRelatedType.Comment:
      return MessageSquare;
    case NotificationRelatedType.Order:
      return ShoppingBag;
    case NotificationRelatedType.Playlist:
      return ListMusic;
    case NotificationRelatedType.Request:
      return FileText;
    case NotificationRelatedType.Review:
      return Star;
    case NotificationRelatedType.Message:
      return MessageSquare;
    default:
      return Bell;
  }
};

const getNotificationIconColor = (relatedType?: NotificationRelatedType | null) => {
  switch (relatedType) {
    case NotificationRelatedType.Album:
      return "bg-purple-500/20 text-purple-400";
    case NotificationRelatedType.Track:
      return "bg-blue-500/20 text-blue-400";
    case NotificationRelatedType.Comment:
      return "bg-green-500/20 text-green-400";
    case NotificationRelatedType.Order:
      return "bg-orange-500/20 text-orange-400";
    case NotificationRelatedType.Playlist:
      return "bg-pink-500/20 text-pink-400";
    case NotificationRelatedType.Request:
      return "bg-yellow-500/20 text-yellow-400";
    case NotificationRelatedType.Review:
      return "bg-amber-500/20 text-amber-400";
    case NotificationRelatedType.Message:
      return "bg-cyan-500/20 text-cyan-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

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
        const IconComponent = getNotificationIcon(notification.relatedType);
        const iconColorClass = getNotificationIconColor(notification.relatedType);

        return (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`hover:bg-main-grey/10 flex cursor-pointer items-start gap-4 rounded-lg p-4 transition-colors ${
              !isRead ? "border-l-4 border-l-blue-500 bg-blue-500/5" : ""
            }`}
          >
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${iconColorClass}`}>
              <IconComponent className="h-5 w-5" />
            </div>

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
