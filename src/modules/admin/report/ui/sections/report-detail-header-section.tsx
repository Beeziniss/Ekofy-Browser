"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReportDetailQueryQuery } from "@/gql/graphql";

type ReportItem = NonNullable<NonNullable<ReportDetailQueryQuery["reports"]>["items"]>[0];

interface ReportDetailHeaderSectionProps {
  report: ReportItem;
}

export function ReportDetailHeaderSection({ }: ReportDetailHeaderSectionProps) {
  return (
    <div className="space-y-4">
      {/* Back Button - Separate */}
      <Link href="/admin/report">
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Button>
      </Link>

      {/* Report Details Header */}
      <div className="rounded-lg border bg-card p-6 mt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">Report Details</h1>
              <p className="text-sm text-muted-foreground">
                Viewing report information
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {/* Show view-only badge */}
            <Badge 
              variant="outline" 
              className="text-sm px-4 py-2"
            >
              View Only
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
