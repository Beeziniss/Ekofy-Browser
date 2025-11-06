"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ApprovalHistoriesSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const ApprovalHistoriesSearch = ({ searchTerm, onSearch }: ApprovalHistoriesSearchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative max-w-sm flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          placeholder="Search histories..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};
