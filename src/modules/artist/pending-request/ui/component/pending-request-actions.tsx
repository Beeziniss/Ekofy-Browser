"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Package, MessageCircle } from "lucide-react";
import { RequestStatus } from "@/gql/graphql";

interface PendingRequestActionsProps {
  requestId: string;
  status: RequestStatus;
  requestTitle: string;
  orderId?: string | null;
  conversationId?: string | null;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

export function PendingRequestActions({
  status,
  requestTitle,
  orderId,
  conversationId,
  onApprove,
  onReject,
  isProcessing,
}: PendingRequestActionsProps) {
  const canProcessRequest = status === RequestStatus.Pending || status === RequestStatus.Open;

  return (
    <div className="sticky top-20 space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* View Order and View Conversation Buttons */}
        {orderId && (
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href={`/orders/${orderId}/details`}>
              <Package className="h-4 w-4" />
              View Order
            </Link>
          </Button>
        )}
        
        {conversationId && (
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href={`/inbox/${conversationId}`}>
              <MessageCircle className="h-4 w-4" />
              View Conversation
            </Link>
          </Button>
        )}

        {/* Action Buttons */}
        {canProcessRequest ? (
          <>
            {/* Approve Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-main-white" 
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-4 w-4 text-main-white" />
                  Approve Request
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve the request &ldquo;{requestTitle}&rdquo;? 
                    This action will confirm the collaboration and notify the requestor.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                  <Button 
                    onClick={onApprove}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 text-main-white"
                  >
                    {isProcessing ? "Processing..." : "Yes, Approve"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Reject Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full gap-2 bg-red-600 hover:bg-red-700 text-main-white" 
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 text-main-white" />
                  Reject Request
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Request</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reject the request &ldquo;{requestTitle}&rdquo;? 
                    This action cannot be undone and will notify the requestor of the rejection.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                  <Button 
                    onClick={onReject}
                    disabled={isProcessing}
                    className="bg-red-600 hover:bg-red-700 text-main-white"
                  >
                    {isProcessing ? "Processing..." : "Yes, Reject"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              This request has already been processed.
            </p>
            <p className="text-xs text-muted-foreground">
              Current status: {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
}