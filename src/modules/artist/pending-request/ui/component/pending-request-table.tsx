"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { RequestStatus, GetPendingArtistRequestQuery } from "@/gql/graphql";
import Link from "next/link";
import { useState } from "react";

type PendingRequestItem = NonNullable<NonNullable<GetPendingArtistRequestQuery["requests"]>["items"]>[0];

const STATUS_VARIANTS: Record<RequestStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [RequestStatus.Pending]: "outline",
  [RequestStatus.Confirmed]: "default",
  [RequestStatus.Rejected]: "destructive",
  [RequestStatus.Canceled]: "secondary",
  [RequestStatus.Blocked]: "destructive",
  [RequestStatus.Closed]: "secondary",
  [RequestStatus.Deleted]: "destructive",
  [RequestStatus.Open]: "outline",
};

const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: "PENDING",
  [RequestStatus.Confirmed]: "CONFIRMED",
  [RequestStatus.Rejected]: "REJECTED",
  [RequestStatus.Canceled]: "CANCELED",
  [RequestStatus.Blocked]: "BLOCKED",
  [RequestStatus.Closed]: "CLOSED",
  [RequestStatus.Deleted]: "DELETED",
  [RequestStatus.Open]: "OPEN",
};

interface PendingRequestTableProps {
  requests: PendingRequestItem[];
  isLoading: boolean;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isProcessing: boolean;
}

export function PendingRequestTable({
  requests,
  isLoading,
  onApprove,
  onReject,
  isProcessing,
}: PendingRequestTableProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
    requestId: string;
    requestTitle: string;
  }>({ isOpen: false, type: null, requestId: "", requestTitle: "" });

  const canProcessRequest = (status: RequestStatus) => {
    return status === RequestStatus.Pending || status === RequestStatus.Open;
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === "approve") {
      onApprove(confirmDialog.requestId);
    } else if (confirmDialog.type === "reject") {
      onReject(confirmDialog.requestId);
    }
    setConfirmDialog({ isOpen: false, type: null, requestId: "", requestTitle: "" });
  };

  const openConfirmDialog = (type: "approve" | "reject", requestId: string, requestTitle: string) => {
    setConfirmDialog({ isOpen: true, type, requestId, requestTitle });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Requestor</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                No pending requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.title}</div>
                  <div className="text-muted-foreground text-sm">{request.type}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{request.requestor[0]?.displayName || "Unknown"}</div>
                </TableCell>
                <TableCell>
                  {request.artistPackage && request.artistPackage[0] ? (
                    <div className="text-sm">{request.artistPackage[0].packageName}</div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Custom Request</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Intl.NumberFormat("vi-VN").format(request.budget.min)} {request.currency}
                    {request.budget.min !== request.budget.max && (
                      <>
                        {" - "}
                        {new Intl.NumberFormat("vi-VN").format(request.budget.max)} {request.currency}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[request.status]}>{STATUS_LABELS[request.status]}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{format(new Date(request.requestCreatedTime), "dd/MM/yyyy")}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="lg" variant="outline" disabled={isProcessing} className="gap-1">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/artist/studio/pending-request/${request.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {canProcessRequest(request.status) && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmDialog("approve", request.id, request.title || "Untitled Request")
                              }
                              className="text-green-600 focus:text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                openConfirmDialog("reject", request.id, request.title || "Untitled Request")
                              }
                              className="text-red-600 focus:text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          !open && setConfirmDialog({ isOpen: false, type: null, requestId: "", requestTitle: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "approve" ? "Approve Request" : "Reject Request"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmDialog.type} the request &ldquo;{confirmDialog.requestTitle}&rdquo;?
              {confirmDialog.type === "approve"
                ? " This action will confirm the collaboration and notify the requestor."
                : " This action cannot be undone and will notify the requestor of the rejection."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleConfirmAction}
              disabled={isProcessing}
              variant={confirmDialog.type === "approve" ? "default" : "destructive"}
              className={
                confirmDialog.type === "approve"
                  ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                  : "border-red-600 bg-red-600 text-white hover:bg-red-700"
              }
            >
              {isProcessing ? "Processing..." : `Yes, ${confirmDialog.type === "approve" ? "Approve" : "Reject"}`}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
