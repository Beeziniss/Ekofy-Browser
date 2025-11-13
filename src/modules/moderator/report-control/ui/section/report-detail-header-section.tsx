"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReportDetailQueryQuery, ReportStatus } from "@/gql/graphql";

type ReportItem = NonNullable<NonNullable<ReportDetailQueryQuery["reports"]>["items"]>[0];

interface ReportDetailHeaderSectionProps {
  report: ReportItem;
  onProcessClick: () => void;
}

export function ReportDetailHeaderSection({ report, onProcessClick }: ReportDetailHeaderSectionProps) {
  const canProcess = report.status === ReportStatus.Pending || report.status === ReportStatus.UnderReview;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/moderator/report-control">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Report Details</h1>
      </div>
      {canProcess && (
        <Button onClick={onProcessClick}>
          Process Report
        </Button>
      )}
    </div>
  );
}
