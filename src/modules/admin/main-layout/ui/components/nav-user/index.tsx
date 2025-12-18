"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut, TrendingUpIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { computePlatformRevenueMutation } from "@/gql/client-mutation-options/dashboard-mutation-options";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRevenueDialogOpen, setIsRevenueDialogOpen] = useState(false);

  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: authApi.general.logout,
    onSuccess: () => {
      clearUserData();
      queryClient.clear();
      router.push("/admin/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still clear local data even if server logout fails
      clearUserData();
    },
  });

  // Compute platform revenue mutation
  const {
    mutate: computePlatformRevenue,
    data: revenueData,
    isPending: isComputingRevenue,
  } = useMutation({
    ...computePlatformRevenueMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-revenue"] });
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
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
           
            <DropdownMenuGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                <BadgeCheck />
                My Profile
              </DropdownMenuItem>
              <Dialog open={isRevenueDialogOpen} onOpenChange={setIsRevenueDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsRevenueDialogOpen(true);
                      computePlatformRevenue();
                    }}
                  >
                    <TrendingUpIcon />
                    Platform Revenue
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="!max-w-6xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Platform Revenue Dashboard</DialogTitle>
                    <DialogDescription>
                      View comprehensive platform financial metrics
                    </DialogDescription>
                  </DialogHeader>
                  {isComputingRevenue ? (
                    <div className="flex justify-center py-8">
                      <div className="text-muted-foreground">Computing platform revenue...</div>
                    </div>
                  ) : revenueData ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground">Subscription Revenue</div>
                          <div className="text-2xl font-bold">
                            {revenueData.subscriptionRevenue?.toLocaleString()} {revenueData.currency || "VND"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground">Service Revenue</div>
                          <div className="text-2xl font-bold">
                            {revenueData.serviceRevenue?.toLocaleString()} {revenueData.currency || "VND"}
                          </div>
                        </div>
                        <div className="col-span-2 rounded-lg border border-green-500 p-4 bg-green-500/5">
                          <div className="text-sm text-muted-foreground">Gross Revenue</div>
                          <div className="text-3xl font-bold text-green-500">
                            {revenueData.grossRevenue?.toLocaleString()} {revenueData.currency || "VND"}
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Deductions</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg border p-4">
                            <div className="text-sm text-muted-foreground">Royalty Payouts</div>
                            <div className="text-xl font-semibold text-red-500">
                              -{revenueData.royaltyPayoutAmount?.toLocaleString()} {revenueData.currency || "VND"}
                            </div>
                          </div>
                          <div className="rounded-lg border p-4">
                            <div className="text-sm text-muted-foreground">Service Payouts</div>
                            <div className="text-xl font-semibold text-red-500">
                              -{revenueData.servicePayoutAmount?.toLocaleString()} {revenueData.currency || "VND"}
                            </div>
                          </div>
                          <div className="rounded-lg border p-4">
                            <div className="text-sm text-muted-foreground">Refund Amount</div>
                            <div className="text-xl font-semibold text-red-500">
                              -{revenueData.refundAmount?.toLocaleString()} {revenueData.currency || "VND"}
                            </div>
                          </div>
                          <div className="rounded-lg border p-4">
                            <div className="text-sm text-muted-foreground">Total Payout Amount</div>
                            <div className="text-xl font-semibold text-red-500">
                              -{revenueData.totalPayoutAmount?.toLocaleString()} {revenueData.currency || "VND"}
                            </div>
                          </div>
                          <div className="col-span-2 rounded-lg border border-red-500 p-4 bg-red-500/5">
                            <div className="text-sm text-muted-foreground">Gross Deductions</div>
                            <div className="text-2xl font-bold text-red-500">
                              -{revenueData.grossDeductions?.toLocaleString()} {revenueData.currency || "VND"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Profit</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg border p-4">
                            <div className="text-sm text-muted-foreground">Commission Profit</div>
                            <div className="text-2xl font-bold text-blue-500">
                              {revenueData.commissionProfit?.toLocaleString()} {revenueData.currency || "VND"}
                            </div>
                          </div>
                          <div className="rounded-lg border border-primary p-4 bg-primary/5">
                            <div className="text-sm text-muted-foreground">Net Profit</div>
                            <div className="text-3xl font-bold text-primary">
                              {revenueData.netProfit?.toLocaleString()} {revenueData.currency || "VND"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {revenueData.createdAt && (
                        <div className="text-xs text-muted-foreground text-center pt-4">
                          Computed at: {new Date(revenueData.createdAt as unknown as string).toLocaleString()}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => computePlatformRevenue()}
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
                      <Button onClick={() => computePlatformRevenue()} disabled={isComputingRevenue}>
                        Compute Platform Revenue
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <DropdownMenuItem>
                <Bell />
                Notifications
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
