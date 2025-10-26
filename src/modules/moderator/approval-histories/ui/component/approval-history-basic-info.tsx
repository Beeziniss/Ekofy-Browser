"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { format } from "date-fns";

interface ApprovalHistoryBasicInfoProps {
  history: {
    id: string;
    approvalType: string;
    action: string;
    actionAt: string;
    targetId: string;
    notes?: string | null;
  };
}

export const ApprovalHistoryBasicInfo = ({ history }: ApprovalHistoryBasicInfoProps) => {
  const getActionBadge = (action: string) => {
    switch (action) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">Type:</span>
          <Badge variant="outline">
            {history.approvalType.replace("_", " ")}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Action:</span>
          {getActionBadge(history.action)}
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Action Date:</span>
          <span>{format(new Date(history.actionAt), "MMM dd, yyyy HH:mm:ss")}</span>
        </div>
        {history.notes && (
          <div>
            <span className="font-medium text-red-500">Reason Reject:</span>
            <p className="mt-1 text-sm text-muted-foreground">{history.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};