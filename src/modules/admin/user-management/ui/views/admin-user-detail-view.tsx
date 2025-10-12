"use client";

import { UserManagementLayout } from '../layout';
import { UserDetailSection } from '../section';

interface AdminUserDetailViewProps {
  userId: string;
}

export function AdminUserDetailView({ userId }: AdminUserDetailViewProps) {
  return (
    <UserManagementLayout
      title="User Details"
      description="View detailed user information and manage user status"
      showBackButton={true}
    >
      <UserDetailSection userId={userId} />
    </UserManagementLayout>
  );
}