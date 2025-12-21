"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, ArrowRight, Music, MessageSquare, ShoppingBag, ListMusic, FileText, Star, Disc3 } from "lucide-react";
import { formatNotificationTime } from "@/utils/notification-utils";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";
import { useRouter } from "next/navigation";
import { NotificationRelatedType } from "@/gql/graphql";

interface NotificationItem {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  url?: string | null;
  readAt?: string | null;
  relatedType?: NotificationRelatedType | null;
}

interface NotificationPopoverProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead?: (notificationId?: string) => void;
  onClearNotifications?: () => void;
  children: React.ReactNode;
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

export const NotificationPopover = ({
  notifications,
  // unreadCount,
  // onMarkAsRead,
  // onClearNotifications,
  children,
}: NotificationPopoverProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  /* const handleMarkAllAsRead = () => {
    onMarkAsRead?.(); // Mark all as read
  }; */

  /* const handleMarkAsRead = (notificationId: string) => {
    onMarkAsRead(notificationId);
  }; */

  const handleViewAll = () => {
    setOpen(false);
    router.push("/notification");
  };

  const handleNavigateToLink = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipButton content="Notifications" side="bottom">
        <PopoverTrigger asChild>
          <Button variant={"ghost"} size={"iconLg"} className="rounded-full">
            {children}
          </Button>
        </PopoverTrigger>
      </TooltipButton>
      <PopoverContent className="w-120 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-main-white font-semibold">Notifications</h3>
          {/* {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
              {unreadCount} new
            </span>
          )} */}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="text-main-grey mb-2 h-8 w-8" />
            <p className="text-main-grey text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-112">
              <div className="space-y-1 p-2">
                {notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.relatedType);
                  const iconColorClass = getNotificationIconColor(notification.relatedType);
                  return (
                    <div
                      key={notification.id}
                      className={`hover:bg-main-grey/10 flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors ${
                        !notification.isRead ? "border-l-2 border-l-blue-500 bg-blue-500/5" : ""
                      }`}
                      onClick={() => notification.url && handleNavigateToLink(notification.url)}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${iconColorClass}`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="text-main-white text-sm leading-relaxed">{notification.content}</p>
                        {notification.createdAt && (
                          <p className="text-main-grey text-xs">{formatNotificationTime(notification.createdAt)}</p>
                        )}
                      </div>

                      {/* {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-main-grey/20 h-6 w-6 p-0"
                        onClick={() => handleMarkAsRead(notification.id!)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )} */}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t px-2 py-2">
              {/* <div className="flex justify-between gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-main-grey hover:text-main-white text-xs"
                    onClick={handleMarkAllAsRead}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Mark all as read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-main-grey hover:text-main-white text-xs"
                  onClick={onClearNotifications}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Clear all
                </Button>
              </div> */}
              {notifications.length > 0 && (
                <Button variant="default" size="sm" className="mt-2 w-full" onClick={handleViewAll}>
                  View All Notifications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
