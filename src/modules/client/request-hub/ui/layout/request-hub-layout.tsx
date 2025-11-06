"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  // Filter,
  Plus,
  Users,
  FileText,
} from "lucide-react";

interface RequestHubLayoutProps {
  children: ReactNode;
  onPostRequest?: () => void;
  onBrowseArtists?: () => void;
  onMyRequests?: () => void;
  showFilters?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  myRequestsButtonText?: string;
}

export function RequestHubLayout({
  children,
  onPostRequest,
  onBrowseArtists,
  onMyRequests,
  showFilters = true,
  searchValue = "",
  onSearchChange,
  myRequestsButtonText = "My Requests",
}: RequestHubLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div>
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Title and Actions */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-primary-gradient mb-2 text-3xl font-bold">Request Hub</h1>
              <p className="text-gray-600">Find the perfect artist for your project</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onMyRequests} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {myRequestsButtonText}
              </Button>
              <Button variant="outline" onClick={onBrowseArtists} className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Browse Artists
              </Button>
              <Button
                onClick={onPostRequest}
                className="primary_gradient transition-smooth flex items-center gap-2 text-white hover:opacity-65"
              >
                <Plus className="h-4 w-4" />
                Post Request
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          {showFilters && (
            <div className="flex items-center space-x-4">
              <div className="relative max-w-full flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full py-2 pr-4 pl-10"
                />
              </div>
              {/* <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button> */}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </div>
  );
}
