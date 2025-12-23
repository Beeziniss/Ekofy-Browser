"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  HomeIcon,
  LogOut,
  MessageCircleIcon,
  Sparkles,
  FileTextIcon,
  ReceiptIcon,
  ListChecksIcon,
  ReceiptTextIcon,
  PackageIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { authApi } from "@/services/auth-services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useArtistProfile } from "@/modules/artist/profile/hooks/use-artist-profile";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { computeArtistRevenueMutation } from "@/gql/client-mutation-options/dashboard-mutation-options";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { clearUserData } = useAuthStore();
  const { header, data } = useArtistProfile();
  const queryClient = useQueryClient();
  const displayName = header?.name || user.name;
  const displayEmail = data?.email || user.email;
  const avatarSrc = data?.avatarImage || user.avatar;
  const { user: userStore } = useAuthStore();
  const [isRevenueDialogOpen, setIsRevenueDialogOpen] = useState(false);

  const cleanupAndRedirect = () => {
    // 1. Wipe Zustand/LocalStorage
    clearUserData();

    // 2. Wipe TanStack Query
    queryClient.clear();

    // 3. Redirect
    // Use window.location to ensure Middleware doesn't get stuck in a logic loop
    window.location.href = "/artist/login";
  };

  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: authApi.general.logout,
    onSettled: () => {
      cleanupAndRedirect();
    },
  });

  // Compute artist revenue mutation
  const {
    mutate: computeRevenue,
    data: revenueData,
    isPending: isComputingRevenue,
  } = useMutation({
    ...computeArtistRevenueMutation(),
    onSuccess: () => {
      // Optionally refetch related queries
      queryClient.invalidateQueries({ queryKey: ["artist-revenue"] });
    },
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{displayEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarSrc} alt={displayName} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{displayEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/home"}>
                  <HomeIcon />
                  Home
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/inbox"}>
                  <MessageCircleIcon />
                  Inbox
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/subscription"} className="text-main-purple hover:!text-main-purple font-semibold">
                  <Sparkles className="text-main-purple" />
                  Upgrade to Pro
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/artist/studio/profile"}>
                  <BadgeCheck />
                  Account
                </Link>
              </DropdownMenuItem>
              <Dialog open={isRevenueDialogOpen} onOpenChange={setIsRevenueDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsRevenueDialogOpen(true);
                      if (userStore?.artistId) {
                        computeRevenue(userStore.artistId);
                      }
                    }}
                  >
                    <TrendingUpIcon />
                    My Revenue
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Artist Revenue Dashboard</DialogTitle>
                    <DialogDescription>View your earnings and revenue breakdown</DialogDescription>
                  </DialogHeader>
                  {isComputingRevenue ? (
                    <div className="flex justify-center py-8">
                      <div className="text-muted-foreground">Computing revenue...</div>
                    </div>
                  ) : revenueData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4">
                          <div className="text-muted-foreground text-sm">Royalty Earnings</div>
                          <div className="text-2xl font-bold">{revenueData.royaltyEarnings?.toLocaleString()} VND</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-muted-foreground text-sm">Service Revenue</div>
                          <div className="text-2xl font-bold">{revenueData.serviceRevenue?.toLocaleString()} VND</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-muted-foreground text-sm">Service Earnings</div>
                          <div className="text-2xl font-bold">{revenueData.serviceEarnings?.toLocaleString()} VND</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-muted-foreground text-sm">Gross Revenue</div>
                          <div className="text-2xl font-bold">{revenueData.grossRevenue?.toLocaleString()} VND</div>
                        </div>
                        <div className="border-primary bg-primary/5 col-span-2 rounded-lg border p-4">
                          <div className="text-muted-foreground text-sm">Net Revenue</div>
                          <div className="text-primary text-3xl font-bold">
                            {revenueData.netRevenue?.toLocaleString()} VND
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (userStore?.artistId) {
                              computeRevenue(userStore.artistId);
                            }
                          }}
                          disabled={isComputingRevenue}
                        >
                          Refresh
                        </Button>
                        <Button onClick={() => setIsRevenueDialogOpen(false)}>Close</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="text-muted-foreground">No revenue data available</div>
                      <Button
                        onClick={() => {
                          if (userStore?.artistId) {
                            computeRevenue(userStore.artistId);
                          }
                        }}
                        disabled={isComputingRevenue}
                      >
                        Compute Revenue
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="[&_svg]:text-muted-foreground gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                  <PackageIcon />
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
                    <Link href={`/activities/order/${userStore?.userId}`}>
                      <ReceiptTextIcon />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="[&_svg]:text-muted-foreground gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                  <CreditCard />
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
              <DropdownMenuItem asChild>
                <Link href={"/notification"}>
                  <Bell />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
