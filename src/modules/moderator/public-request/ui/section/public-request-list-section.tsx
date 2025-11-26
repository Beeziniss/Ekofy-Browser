"use client";

import React from "react";
import { RequestsPublicQuery } from "@/gql/graphql";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PublicRequestCard } from "../component/public-request-table";

type RequestItem = NonNullable<NonNullable<RequestsPublicQuery["requests"]>["items"]>[0];

interface PublicRequestListSectionProps {
  requests: RequestItem[];
  isLoading?: boolean;
  onViewDetails: (id: string) => void;
}

export function PublicRequestListSection({ requests, isLoading, onViewDetails }: PublicRequestListSectionProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-400">No requests found</p>
          <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search query</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead className="w-[180px] text-gray-400">Requestor</TableHead>
            <TableHead className="text-gray-400">Title</TableHead>
            <TableHead className="w-[160px] text-gray-400">Budget</TableHead>
            <TableHead className="w-[80px] text-center text-gray-400">Duration</TableHead>
            <TableHead className="w-[90px] text-center text-gray-400">Status</TableHead>
            <TableHead className="w-[90px] text-center text-gray-400">Posted</TableHead>
            <TableHead className="w-[160px] text-right text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <PublicRequestCard key={request.id} request={request} onViewDetails={onViewDetails} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
