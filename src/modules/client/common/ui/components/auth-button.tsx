"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
// import Image from "next/image";
import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { Button } from "@/components/ui/button";
import { authApi } from "@/services/auth-services";
import { getUserInitials } from "@/utils/format-shorten-name";
import { SparklesColorful, Crown, BellActive } from "@/assets/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  artistOptions,
  listenerOptions,
  userActiveSubscriptionOptions,
  notificationOptions,
} from "@/gql/options/client-options";
import {
  Bell,
  ClipboardListIcon,
  CreditCard,
  FileTextIcon,
  ListChecksIcon,
  LogOut,
  MessageCircleIcon,
  MicVocalIcon,
  ReceiptIcon,
  ReceiptTextIcon,
  User,
} from "lucide-react";
import { useNotificationSignalR } from "@/hooks/use-notification-signalr";
import { NotificationPopover } from "@/components/notification-popover";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";
import { toast } from "sonner";

interface ProfileLink {
  label: string;
  href: string;
}

const AuthButton = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  // Fetch notifications using query
  const { data: notificationsData } = useQuery({
    ...notificationOptions({ userId: user?.userId || "", first: 5 }),
    enabled: !!user?.userId && isAuthenticated,
  });

  // Initialize notification SignalR hook for real-time updates
  const { onNotificationReceived } = useNotificationSignalR();

  // Set up notification event handler to invalidate queries
  useEffect(() => {
    onNotificationReceived((notification) => {
      toast.info(notification.content || "You have a new notification!", {
        position: "top-right",
        style: {
          top: "50px",
          color: "#000",
          backgroundColor: "#f8f8ff",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.userId] });
    });
  }, [onNotificationReceived, queryClient, user?.userId]);

  // Process notifications from query
  const notifications =
    notificationsData?.notifications?.edges?.map((edge) => ({
      id: edge.node.id,
      content: edge.node.content,
      createdAt: edge.node.createdAt,
      isRead: edge.node.isRead,
      url: edge.node.url,
      readAt: edge.node.readAt,
      relatedType: edge.node.relatedType,
    })) || [];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* // Handle marking notification as read
  const handleMarkAsRead = (notificationId?: string) => {
    // TODO: Call API to mark notification(s) as read
    console.log("Mark as read:", notificationId || "all");
    // Invalidate query to refetch
    queryClient.invalidateQueries({ queryKey: ["notifications", user?.userId] });
  };

  // Handle clearing all notifications
  const handleClearNotifications = () => {
    // TODO: Call API to clear all notifications
    console.log("Clear all notifications");
    // Invalidate query to refetch
    queryClient.invalidateQueries({ queryKey: ["notifications", user?.userId] });
  }; */

  const cleanupAndRedirect = () => {
    // 1. Wipe Zustand/LocalStorage
    clearUserData();

    // 2. Wipe TanStack Query
    queryClient.clear();

    // 3. Redirect
    // Use window.location to ensure Middleware doesn't get stuck in a logic loop
    window.location.href = "/landing";
  };

  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: authApi.general.logout,
    onSettled: () => {
      cleanupAndRedirect();
    },
  });

  const handleLogout = () => {
    logout();
  };

  const { data: listenerData } = useQuery(listenerOptions(user?.userId || "", user?.listenerId));
  const { data: artistData } = useQuery(artistOptions({ userId: user?.userId || "", artistId: user?.artistId }));

  const { data: userSubscription } = useQuery({
    ...userActiveSubscriptionOptions(user?.userId || ""),
    enabled: !!user?.userId && (!!listenerData || !!artistData) && isAuthenticated,
  });

  const profileLinks: ProfileLink[] = [];
  if (isAuthenticated && user) {
    switch (user.role) {
      case UserRole.LISTENER:
        profileLinks.push({ label: "Profile", href: "/profile" });
        break;
      case UserRole.ARTIST:
        profileLinks.push({
          label: "Artist Profile",
          href: "/artist/studio/profile",
        });
        break;
      default:
        profileLinks.push({ label: "Profile", href: "/profile" });
    }
  }

  // Define dropdown menu items
  const dropdownMenuItems = [
    // Profile links (dynamic based on role)
    ...profileLinks.map((link) => ({
      type: "link" as const,
      icon: User,
      label: link.label,
      href: link.href,
      className: "text-main-white",
      showForRoles: [UserRole.LISTENER, UserRole.ARTIST],
    })),
    // Artist-specific items
    {
      type: "link" as const,
      icon: MicVocalIcon,
      label: "Studio",
      href: "/artist/studio",
      className: "text-main-white",
      showForRoles: [UserRole.ARTIST],
    },
    // Premium/Pro option (available for all)
  ];

  const settingsMenuItems = [
    // {
    //   type: "button" as const,
    //   icon: Settings,
    //   label: "Settings",
    //   className: "text-main-white",
    //   showForRoles: [UserRole.LISTENER, UserRole.ARTIST],
    // },
    {
      type: "link" as const,
      icon: SparklesColorful,
      label: user?.role === UserRole.ARTIST ? "Go Pro" : "Go Premium",
      href: "/subscription",
      className: "primary_gradient !bg-gradient-to-b bg-clip-text text-base font-semibold text-transparent",
      showForRoles: [UserRole.LISTENER, UserRole.ARTIST],
    },
    {
      type: "button" as const,
      icon: LogOut,
      label: "Logout",
      className: "text-main-white",
      iconClassName: "text-red-500",
      onClick: handleLogout,
      showForRoles: [UserRole.LISTENER, UserRole.ARTIST],
    },
  ];

  return (
    <>
      {isAuthenticated ? (
        // Signed in
        <div className="flex items-center">
          <TooltipButton content="Inbox" side="bottom">
            <Link href={"/inbox"} className="group">
              <Button variant={"ghost"} size={"iconLg"} className="rounded-full">
                <MessageCircleIcon className="text-main-white group-hover:text-main-grey size-5" />
              </Button>
            </Link>
          </TooltipButton>

          <NotificationPopover
            notifications={notifications}
            unreadCount={unreadCount}
            // onMarkAsRead={handleMarkAsRead}
            // onClearNotifications={handleClearNotifications}
          >
            <div className="group relative cursor-pointer">
              {unreadCount > 0 ? (
                <div className="relative">
                  <BellActive className="size-5" />
                  {/* {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </div>
                    )} */}
                </div>
              ) : (
                <div>
                  <Bell className="text-main-white group-hover:text-main-grey size-5" />
                </div>
              )}
            </div>
          </NotificationPopover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="ml-2">
                <div
                  className={`${userSubscription?.subscription[0].tier === "PREMIUM" || userSubscription?.subscription[0].tier === "PRO" ? "primary_gradient relative flex size-9 items-center justify-center rounded-full p-0.5" : ""}`}
                >
                  <Avatar className="size-8 cursor-pointer">
                    <AvatarImage
                      src={
                        listenerData?.listeners?.items?.[0].avatarImage ||
                        artistData?.artists?.items?.[0].avatarImage ||
                        undefined
                      }
                      alt={
                        listenerData?.listeners?.items?.[0].displayName ||
                        artistData?.artists?.items?.[0].stageName ||
                        "User Avatar"
                      }
                    />
                    <AvatarFallback>
                      {getUserInitials(
                        listenerData?.listeners?.items?.[0].displayName ||
                          artistData?.artists?.items?.[0].stageName ||
                          "E",
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {(userSubscription?.subscription[0].tier === "PREMIUM" ||
                    userSubscription?.subscription[0].tier === "PRO") && (
                    <Crown className="absolute -top-1 -right-1.5 w-3 rotate-45" />
                  )}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                {dropdownMenuItems
                  .filter((item) => user && item.showForRoles.includes(user.role))
                  .map((item, index) => (
                    <DropdownMenuItem key={index} asChild={item.type === "link"}>
                      {item.type === "link" ? (
                        <Link href={item.href!} className="flex items-center">
                          <item.icon className={`mr-2 size-4 ${item.className}`} />
                          <span className={`text-base ${item.className}`}>{item.label}</span>
                        </Link>
                      ) : (
                        <>
                          <item.icon
                            className={`mr-2 size-4 ${"iconClassName" in item ? item.iconClassName : item.className}`}
                          />
                          <span className={`text-base ${item.className}`}>{item.label}</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  ))}

                {user?.role === UserRole.LISTENER && (
                  <>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="[&_svg]:text-main-white gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                        <ReceiptTextIcon className="mr-2 size-4" />
                        My Orders
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link href="/profile/my-requests">
                            <ClipboardListIcon />
                            Request History
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/activities/conversation/${user?.userId}`}>
                            <ReceiptTextIcon />
                            Order History
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="[&_svg]:text-main-white gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                        <CreditCard className="mr-2 size-4" />
                        Billing
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link href="/profile/transaction-history">
                            <ReceiptIcon />
                            Transaction History
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile/invoices">
                            <FileTextIcon />
                            Invoices
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </>
                )}

                {user?.role === UserRole.ARTIST && (
                  <>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="[&_svg]:text-main-white gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                        <ReceiptTextIcon className="mr-2 size-4" />
                        Orders
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link href="/artist/studio/pending-request">
                            <ListChecksIcon />
                            Pending Requests
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/activities/order/${user?.userId}`}>
                            <ReceiptTextIcon />
                            My Orders
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="[&_svg]:text-main-white gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                        <CreditCard className="mr-2 size-4" />
                        Billing
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link href="/artist/studio/transactions/transaction-history">
                            <ReceiptIcon />
                            Transaction History
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/artist/studio/transactions/invoices">
                            <FileTextIcon />
                            My Invoices
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {settingsMenuItems
                  .filter((item) => user && item.showForRoles.includes(user.role))
                  .map((item, index) => (
                    <DropdownMenuItem key={index} onClick={"onClick" in item ? item.onClick : undefined}>
                      {/* ${"iconClassName" in item ? item.iconClassName : item.className} */}
                      {item.type === "link" ? (
                        <Link href={item.href!} className="flex items-center">
                          <item.icon className={`mr-2 size-4 ${item.className}`} />
                          <span className={`text-base ${item.className}`}>{item.label}</span>
                        </Link>
                      ) : (
                        <>
                          <item.icon className={`mr-2 size-4 ${"iconClassName" in item ? item.iconClassName : ""}`} />
                          <span className={`text-base ${item.className}`}>{item.label}</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        // Signed out
        <div className="flex items-center gap-x-4">
          <Link href={"/welcome"} className="hover:underline">
            <span className="text-sm font-medium">Sign In</span>
          </Link>
          <Link href={"/welcome"}>
            <Button className="primary_gradient font-semibold text-white hover:brightness-90">Create Account</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthButton;
