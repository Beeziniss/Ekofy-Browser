"use client";

import { ModeratorUserManagementLayout } from "../layout";
import { ModeratorUserDetailSection } from "../section";

interface ModeratorUserDetailViewProps {
  userId: string;
}

export function ModeratorUserDetailView({ userId }: ModeratorUserDetailViewProps) {
  return (
    <ModeratorUserManagementLayout
      title="User Details"
      description="View detailed user information and manage user status"
      showBackButton={true}
    >
      <ModeratorUserDetailSection userId={userId} />
    </ModeratorUserManagementLayout>
  );
}
