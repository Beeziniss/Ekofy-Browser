"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

interface PlanDetailHeaderProps {
  subscriptionId: string;
  onEdit?: () => void;
}

export function PlanDetailHeader({ subscriptionId, onEdit }: PlanDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href={`/admin/subscription/${subscriptionId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Subscription Plan
        </Button>
      </div>
    </div>
  );
}
