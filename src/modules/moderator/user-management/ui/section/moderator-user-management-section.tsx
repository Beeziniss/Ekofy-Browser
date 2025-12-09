"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ModeratorUserStatsCards, ModeratorUserTableWrapper, ModeratorStatusConfirmModal } from "../component";
import { moderatorUsersQueryOptions } from "@/gql/options/moderator-options";
import { useDeActiveUser, useReActiveUser } from "@/gql/client-mutation-options/moderator-mutation";
import { UserStatus, UserRole } from "@/gql/graphql";
import { ModeratorUserTableData } from "@/types";
import { toast } from "sonner";

export function ModeratorUserManagementSection() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; fullName: string; status: UserStatus } | null>(null);

  // Use existing query options but with URL search params
  const {
    data: usersData,
    isLoading,
    // isFetching,
    error,
  } = useQuery(moderatorUsersQueryOptions(currentPage, pageSize, searchQuery));

  // Mutations
  const deactivateUserMutation = useDeActiveUser();
  const reactivateUserMutation = useReActiveUser();

  const handleStatusChange = (userId: string, status: UserStatus) => {
    const user = usersData?.users?.items?.find((u: ModeratorUserTableData) => u.id === userId);
    if (user) {
      setSelectedUser({
        id: userId,
        fullName: user.fullName || "Unknown User",
        status: status,
      });
      setShowStatusModal(true);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;

    try {
      if (selectedUser.status === UserStatus.Banned) {
        await deactivateUserMutation.mutateAsync(selectedUser.id);
        toast.success("User banned successfully!");
      } else {
        await reactivateUserMutation.mutateAsync(selectedUser.id);
        toast.success("User reactivated successfully!");
      }
      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  // Only show full page loading on initial load, not on search/filter changes
  if (isLoading && !usersData) {
    return (
      <div className="space-y-6">
        {/* Stats Cards load independently */}
        <ModeratorUserStatsCards />

        {/* Show skeleton for table */}
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="text-gray-400">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Stats Cards still load independently */}
        <ModeratorUserStatsCards />

        {/* Show error for table only */}
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50">
          <div className="text-red-400">Error loading users: {error.message}</div>
        </div>
      </div>
    );
  }

  const rawUsers = usersData?.users?.items || [];
  const artists = usersData?.artists?.items || [];
  const listeners = usersData?.listeners?.items || [];
  
  // Merge avatarImage from artists and listeners into users
  const users = rawUsers.map((user) => {
    let avatarImage: string | undefined = undefined;
    
    if (user.role === UserRole.Artist) {
      const artist = artists.find((a) => a.userId === user.id);
      avatarImage = artist?.avatarImage || undefined;
    } else if (user.role === UserRole.Listener) {
      const listener = listeners.find((l) => l.userId === user.id);
      avatarImage = listener?.avatarImage || undefined;
    }
    
    return {
      ...user,
      avatarImage,
    };
  });
  
  const totalCount = usersData?.users?.totalCount || 0;
  const pageInfo = usersData?.users?.pageInfo;

  return (
    <div className="space-y-6">
      {/* Stats Cards - Independent query, not affected by search */}
      <ModeratorUserStatsCards />

      {/* User Table - Only this reloads on search */}
      <div className="relative">
        <ModeratorUserTableWrapper
          data={users}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          hasNextPage={pageInfo?.hasNextPage || false}
          hasPreviousPage={pageInfo?.hasPreviousPage || false}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Status Confirmation Modal */}
      {selectedUser && (
        <ModeratorStatusConfirmModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmStatusChange}
          userFullName={selectedUser.fullName}
          action={selectedUser.status}
          isLoading={deactivateUserMutation.isPending || reactivateUserMutation.isPending}
        />
      )}
    </div>
  );
}
