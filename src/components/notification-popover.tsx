"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, ArrowRight } from "lucide-react";
import { formatNotificationTime } from "@/utils/notification-utils";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";
import { useRouter } from "next/navigation";

interface NotificationItem {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  url?: string | null;
  readAt?: string | null;
  avatar?: string;
}

interface NotificationPopoverProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead?: (notificationId?: string) => void;
  onClearNotifications?: () => void;
  children: React.ReactNode;
}

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
        <PopoverTrigger asChild>{children}</PopoverTrigger>
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
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`hover:bg-main-grey/10 flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors ${
                      !notification.isRead ? "border-l-2 border-l-blue-500 bg-blue-500/5" : ""
                    }`}
                    onClick={() => notification.url && handleNavigateToLink(notification.url)}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={notification.avatar} alt="Notification avatar" />
                      <AvatarFallback>
                        <Bell className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

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
                ))}
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
