"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface TrackDetailSidebarProps {
  onDownloadOriginal: () => void;
  onApprove: () => void;
  onReject: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function TrackDetailSidebar({
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: TrackDetailSidebarProps) {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Action Buttons - Sticky */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Moderation Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Approve/Reject Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full bg-green-600 text-white hover:bg-green-700"
              onClick={onApprove}
              disabled={isApproving || isRejecting}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isApproving ? "Approving..." : "Approve Track"}
            </Button>

            <Button
              variant="outline"
              className="w-full border-red-400 text-red-400 hover:bg-red-400/10"
              onClick={onReject}
              disabled={isApproving || isRejecting}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {isRejecting ? "Rejecting..." : "Reject Track"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
