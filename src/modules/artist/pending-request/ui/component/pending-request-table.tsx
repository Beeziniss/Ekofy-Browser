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
import { Eye, CheckCircle, XCircle, MoreHorizontal, ShoppingCart, MessageSquare } from "lucide-react";
import { RequestStatus, GetPendingArtistRequestQuery } from "@/gql/graphql";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/format-date";
import { conversationDetailByRequestOptions } from "@/gql/options/client-options";

type PendingRequestItem = NonNullable<NonNullable<GetPendingArtistRequestQuery["requests"]>["items"]>[0];

const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  [RequestStatus.Pending]: {
    label: "PENDING",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
  },
  [RequestStatus.Confirmed]: {
    label: "CONFIRMED",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20",
  },
  [RequestStatus.Rejected]: {
    label: "REJECTED",
    className: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
  },
  [RequestStatus.Canceled]: {
    label: "CANCELED",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20",
  },
  [RequestStatus.Blocked]: {
    label: "BLOCKED",
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
  },
  [RequestStatus.Closed]: {
    label: "CLOSED",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  },
  [RequestStatus.Deleted]: {
    label: "DELETED",
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20",
  },
  [RequestStatus.Open]: {
    label: "OPEN",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
  },
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

  // Component to render each request row with conversation query
  const RequestTableRow = ({ request }: { request: PendingRequestItem }) => {
    const { data: conversationData } = useQuery(conversationDetailByRequestOptions(request.id));
    const conversationId = conversationData?.conversations?.items?.[0]?.id;

    return (
      <TableRow key={request.id}>
        <TableCell>
          <div className="text-sm">{request.type || "N/A"}</div>
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
            {request.budget ? (
              <>
                {new Intl.NumberFormat("vi-VN").format(request.budget.min)} {request.currency}
                {request.budget.min !== request.budget.max && (
                  <>
                    {" - "}
                    {new Intl.NumberFormat("vi-VN").format(request.budget.max)} {request.currency}
                  </>
                )}
              </>
            ) : request.artistPackage && request.artistPackage[0] ? (
              <>
                {new Intl.NumberFormat("vi-VN").format(request.artistPackage[0].amount)}{" "}
                {request.artistPackage[0].currency}
              </>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Badge
            className={`${STATUS_CONFIG[request.status as RequestStatus]?.className} border font-semibold transition-colors`}
          >
            {STATUS_CONFIG[request.status as RequestStatus]?.label}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="text-sm">{formatDate(request.requestCreatedTime)}</div>
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
                
                {/* View Order - only show if orderId exists */}
                {request.orderId && (
                  <DropdownMenuItem asChild>
                    <Link href={`/artist/studio/orders/${request.orderId}`} className="flex items-center">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View Order
                    </Link>
                  </DropdownMenuItem>
                )}

                {/* View Conversation - only show if conversationId exists */}
                {conversationId && (
                  <DropdownMenuItem asChild>
                    <Link href={`/inbox/${conversationId}`} className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View Conversation
                    </Link>
                  </DropdownMenuItem>
                )}

                {canProcessRequest(request.status) && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        openConfirmDialog(
                          "approve",
                          request.id,
                          request.artistPackage && request.artistPackage[0]
                            ? request.artistPackage[0].packageName
                            : "Custom Request",
                        )
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
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Title</TableHead> */}
            <TableHead>Type</TableHead>
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
            requests.map((request) => <RequestTableRow key={request.id} request={request} />)
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
              Are you sure you want to {confirmDialog.type} the request with package name{" "}
              <strong>
                &quot;
                {confirmDialog.requestTitle}&quot;
              </strong>
              ?
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
