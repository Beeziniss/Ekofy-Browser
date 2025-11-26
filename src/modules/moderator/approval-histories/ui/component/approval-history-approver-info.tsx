"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface ApprovalHistoryApproverInfoProps {
  approvedBy: Array<{
    id: string;
    email: string;
    fullName: string;
    role: string;
  }>;
}

export const ApprovalHistoryApproverInfo = ({ approvedBy }: ApprovalHistoryApproverInfoProps) => {
  const approver = approvedBy[0];

  if (!approver) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Approved By
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No approver information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Approved By
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">FullName:</span>
          {approver.fullName}
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          {approver.email}
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <Badge variant="outline">{approver.role}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
