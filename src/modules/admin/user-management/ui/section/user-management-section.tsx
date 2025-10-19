"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  UserStatsCards, 
  UserTable, 
  CreateModeratorModal,
  StatusConfirmModal,
  CreateModeratorData 
} from "../component";
import { adminUsersQueryOptions, adminUsersStatsOptions } from "@/gql/options/admin-options";
import { UserStatus } from "@/gql/graphql";
import { execute } from "@/gql/execute";
import { CreateModeratorMutation } from "../views/admin-user-managenent";
import { DeActiveUserMutation, ReActiveUserMutation } from "../views/admin-user-managenent";
import { toast } from "sonner";
export function UserManagementSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; status: UserStatus } | null>(null);
  const pageSize = 10;

  const queryClient = useQueryClient();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Separate query for user stats
  const {
    data: statsData,
    isLoading: isStatsLoading,
  } = useQuery(adminUsersStatsOptions());

  // Query for users list
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error,
  } = useQuery(adminUsersQueryOptions(currentPage, pageSize, debouncedSearchTerm));

  // Create moderator mutation
  const createModeratorMutation = useMutation({
    mutationFn: async (data: CreateModeratorData) => {
      return await execute(CreateModeratorMutation, {
        createModeratorRequest: {
          email: data.email,
          password: data.password,
        }
      });
    },
    onSuccess: () => {
      // Invalidate both queries
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-stats"] });
      toast.success("Moderator created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create moderator:", error);
      toast.error("Failed to create moderator");
    },
  });

  // Update user status mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: UserStatus }) => {
      if (status === UserStatus.Banned) {
        return await execute(DeActiveUserMutation, { targetUserId: userId });
      } else if (status === UserStatus.Active) {
        return await execute(ReActiveUserMutation, { targetUserId: userId });
      }
    },
    onSuccess: () => {
      // Invalidate both queries
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-stats"] });
      toast.success("User status updated successfully!");
    },
    onError: (errors) => {
      console.error("Failed to update user status:", errors);
      toast.error(errors.message || "Failed to update user status");
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreateModerator = () => {
    setShowCreateModal(true);
  };

  const handleSubmitModerator = (data: CreateModeratorData) => {
    createModeratorMutation.mutate(data);
  };

  const handleStatusChange = (userId: string, status: UserStatus) => {
    setSelectedUser({ id: userId, status });
    setShowStatusModal(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedUser) {
      updateUserStatusMutation.mutate({
        userId: selectedUser.id,
        status: selectedUser.status,
      });
    }
    setSelectedUser(null);
  };

  // Show stats loading error if exists
  if (isStatsLoading && !statsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading statistics...</div>
      </div>
    );
  }

  const users = usersData?.users?.items || [];
  const totalCount = usersData?.users?.totalCount || 0;
  const pageInfo = usersData?.users?.pageInfo;

  // Get stats from separate query - calculate from users data
  const allUsers = statsData?.users?.items || [];
  const stats = {
    totalUsers: statsData?.users?.totalCount || 0,
    activeUsers: allUsers.filter(user => user.status === UserStatus.Active).length,
    inactiveUsers: allUsers.filter(user => user.status === UserStatus.Inactive || user.status === UserStatus.Banned).length,
    newUsers: allUsers.filter(user => {
      const createdDate = new Date(user.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <UserStatsCards
        totalUsers={stats.totalUsers}
        activeUsers={stats.activeUsers}
        inactiveUsers={stats.inactiveUsers}
        newUsers={stats.newUsers}
      />

      {/* User Table */}
      <UserTable
        data={users as any[]}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        hasNextPage={pageInfo?.hasNextPage || false}
        hasPreviousPage={pageInfo?.hasPreviousPage || false}
        searchTerm={searchTerm}
        onStatusChange={handleStatusChange}
        onCreateModerator={handleCreateModerator}
        isLoading={isUsersLoading}
        error={error}
      />

      {/* Create Moderator Modal */}
      <CreateModeratorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitModerator}
      />

      {/* Status Confirmation Modal */}
      {selectedUser && (
        <StatusConfirmModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmStatusChange}
          status={selectedUser.status}
          userName="User" // You can get this from the user data if needed
        />
      )}
    </div>
  );
}