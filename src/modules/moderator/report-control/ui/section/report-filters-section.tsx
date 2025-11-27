"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ReportStatus, ReportRelatedContentType } from "@/gql/graphql";

const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.Pending]: "Pending",
  [ReportStatus.UnderReview]: "Under Review",
  [ReportStatus.Approved]: "Approved",
  [ReportStatus.Rejected]: "Rejected",
  [ReportStatus.Restored]: "Restored",
  [ReportStatus.Escalated]: "Escalated",
};

const CONTENT_TYPE_LABELS: Partial<Record<ReportRelatedContentType, string>> = {
  [ReportRelatedContentType.Track]: "Track",
  [ReportRelatedContentType.Comment]: "Comment", 
  [ReportRelatedContentType.Request]: "Request",
  // Artist and Listener are excluded from filter options
};

interface ReportFiltersSectionProps {
  searchTerm: string;
  statusFilter: ReportStatus | "all";
  contentTypeFilter: ReportRelatedContentType | "all" | "none";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ReportStatus | "all") => void;
  onContentTypeChange: (value: ReportRelatedContentType | "all" | "none") => void;
}

export function ReportFiltersSection({
  searchTerm,
  statusFilter,
  contentTypeFilter,
  onSearchChange,
  onStatusChange,
  onContentTypeChange,
}: ReportFiltersSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user name"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={contentTypeFilter} onValueChange={onContentTypeChange}>
        <SelectTrigger className="w-full lg:w-48">
          <SelectValue placeholder="Filter by content type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="none">User Reports (No Content)</SelectItem>
          {Object.entries(CONTENT_TYPE_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
