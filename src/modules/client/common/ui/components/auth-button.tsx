"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
// import Image from "next/image";
import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SparklesColorful, Crown, BellActive } from "@/assets/icons";
import { authApi } from "@/services/auth-services";
import { getUserInitials } from "@/utils/format-shorten-name";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { artistOptions, listenerOptions, userActiveSubscriptionOptions } from "@/gql/options/client-options";
import { AudioLines, Bell, LogOut, MessageCircleIcon, MicVocalIcon, Settings, User } from "lucide-react";
import { useNotificationSignalR } from "@/hooks/use-notification-signalr";
import { NotificationPopover } from "@/components/notification-popover";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";

interface ProfileLink {
  label: string;
  href: string;
}

const AuthButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  // Initialize notification SignalR hook
  const { notifications, unreadCount, markAsRead, clearNotifications, onNotificationReceived } =
    useNotificationSignalR();

  // Set up notification event handler
  useEffect(() => {
    onNotificationReceived((notification) => {
      // You can add additional logic here like showing a toast notification
      console.log("New notification received:", notification);
    });
  }, [onNotificationReceived]);

  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: authApi.general.logout,
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still clear local data even if server logout fails
    },
    onSettled: () => {
      router.replace("/");
      clearUserData();
      queryClient.clear();
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
      icon: AudioLines,
      label: "Track",
      href: "/artist/studio/tracks",
      className: "text-main-white",
      showForRoles: [UserRole.ARTIST],
    },
    {
      type: "link" as const,
      icon: MicVocalIcon,
      label: "Studio",
      href: "/artist/studio",
      className: "text-main-white",
      showForRoles: [UserRole.ARTIST],
    },
    // Premium/Pro option (available for all)
    {
      type: "button" as const,
      icon: SparklesColorful,
      label: user?.role === UserRole.ARTIST ? "Go Pro" : "Go Premium",
      className: "primary_gradient !bg-gradient-to-b bg-clip-text text-base font-semibold text-transparent",
      showForRoles: [UserRole.LISTENER, UserRole.ARTIST],
    },
  ];

  const settingsMenuItems = [
    {
      type: "button" as const,
      icon: Settings,
      label: "Settings",
      className: "text-main-white",
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
          <TooltipButton content="To Inbox page" side="bottom">
            <Link href={"/conversations"} className="group p-2">
              <MessageCircleIcon className="text-main-white group-hover:text-main-grey size-5" />
            </Link>
          </TooltipButton>

          <NotificationPopover
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onClearNotifications={clearNotifications}
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
                <div className="p-2">
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
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {settingsMenuItems
                  .filter((item) => user && item.showForRoles.includes(user.role))
                  .map((item, index) => (
                    <DropdownMenuItem key={index} onClick={"onClick" in item ? item.onClick : undefined}>
                      <item.icon
                        className={`mr-2 size-4 ${"iconClassName" in item ? item.iconClassName : item.className}`}
                      />
                      <span className={`text-base ${item.className}`}>{item.label}</span>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        // Signed out
        <div className="flex items-center gap-x-4">
          <Link href={"/login"} className="hover:underline">
            <span className="text-sm font-medium">Sign In</span>
          </Link>
          <Link href={"/sign-up"}>
            <Button className="primary_gradient font-semibold text-white hover:brightness-90">Create Account</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthButton;
