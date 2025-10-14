"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  ModeratorUserStatsCards, 
  ModeratorUserTableWrapper, 
  ModeratorStatusConfirmModal
} from "../component";
import { moderatorUsersQueryOptions } from "@/gql/options/moderator-options";
import { useDeActiveUser, useReActiveUser } from "@/gql/client-mutation-options/moderator-mutation";
import { UserStatus } from "@/gql/graphql";
import { ModeratorUserTableData, ModeratorUserStatsData } from "@/types";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading users: {error.message}</div>
      </div>
    );
  }

  const users = usersData?.users?.items || [];
  const totalCount = usersData?.users?.totalCount || 0;
  const pageInfo = usersData?.users?.pageInfo;

  // Calculate stats from current data
  const statsData: ModeratorUserStatsData = {
    totalUsers: totalCount,
    activeUsers: users.filter((user: ModeratorUserTableData) => user.status === UserStatus.Active).length,
    inactiveUsers: users.filter((user: ModeratorUserTableData) => user.status === UserStatus.Inactive).length,
    newUsers: users.filter((user: ModeratorUserTableData) => {
      const createdAt = new Date(user.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt > thirtyDaysAgo;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards - These should NOT reload when search changes */}
      <ModeratorUserStatsCards data={statsData} />

      {/* User Table - Only this should reload on search */}
      <ModeratorUserTableWrapper
        data={users}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        hasNextPage={pageInfo?.hasNextPage || false}
        hasPreviousPage={pageInfo?.hasPreviousPage || false}
        onStatusChange={handleStatusChange}
      />

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
