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
import { adminUsersQueryOptions } from "@/gql/options/admin-options";
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

  const {
    data: usersData,
    isLoading,
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
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
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
      if (status === UserStatus.Inactive) {
        return await execute(DeActiveUserMutation, { targetUserId: userId });
      } else {
        return await execute(ReActiveUserMutation, { targetUserId: userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status");
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

  // Calculate stats (mock data for now)
  const stats = {
    totalUsers: totalCount,
    activeUsers: users.filter(user => user.status === UserStatus.Active).length,
    inactiveUsers: users.filter(user => user.status === UserStatus.Inactive).length,
    newUsers: users.filter(user => {
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