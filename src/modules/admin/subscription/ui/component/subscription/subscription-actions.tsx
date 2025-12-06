"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";

interface SubscriptionActionsProps {
  onCreateSubscription?: () => void;
  onCreateSubscriptionPlan?: () => void;
  onSearch: (searchTerm: string) => void;
  searchPlaceholder?: string;
  showCreatePlan?: boolean;
}

export function SubscriptionActions({
  onCreateSubscription,
  onCreateSubscriptionPlan,
  onSearch,
  searchPlaceholder = "Search subscriptions...",
  showCreatePlan = false,
}: SubscriptionActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <SearchBar placeholder={searchPlaceholder} onSearch={onSearch} className="max-w-md flex-1" />
      <div className="flex items-center gap-2">
        {showCreatePlan && onCreateSubscriptionPlan && (
          <Button onClick={onCreateSubscriptionPlan} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        )}
        {onCreateSubscription && (
          <Button onClick={onCreateSubscription} className="bg-white text-gray-900 hover:bg-gray-100">
            <Plus className="mr-2 h-4 w-4" />
            Create Subscription
          </Button>
        )}
      </div>
    </div>
  );
}
