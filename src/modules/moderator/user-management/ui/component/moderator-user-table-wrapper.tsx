"use client";

import { Suspense } from "react";
import { ModeratorUserTable } from "./moderator-user-table";
import { ModeratorUserTableData } from "@/types";
import { UserStatus } from "@/gql/graphql";

interface ModeratorUserTableWrapperProps {
  data: ModeratorUserTableData[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

export function ModeratorUserTableWrapper(props: ModeratorUserTableWrapperProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading table...</div>
      </div>
    }>
      <ModeratorUserTable {...props} />
    </Suspense>
  );
}