"use client";

import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EllipsisVertical, FileIcon, ArrowUpRightIcon, EyeIcon, Edit } from "lucide-react";
import { orderPackageDetailOptions } from "@/gql/options/client-options";
import { PackageOrderStatus } from "@/gql/graphql";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderSubmissionDeliveryDialog, { type DeliveryItem } from "../components/order-submission-delivery-dialog";
import OrderSubmissionSubmitDialog from "../components/order-submission-submit-dialog";
import OrderSubmissionRevisionDialog from "../components/order-submission-revision-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "date-fns";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderSubmissionSectionProps {
  orderId: string;
}

const OrderSubmissionSection = ({ orderId }: OrderSubmissionSectionProps) => {
  return (
    <Suspense fallback={<OrderSubmissionSectionSkeleton />}>
      <OrderSubmissionSectionSuspense orderId={orderId} />
    </Suspense>
  );
};

const OrderSubmissionSectionSkeleton = () => {
  return (
    <Card>
      <CardContent className="flex flex-col space-y-6 rounded-md">
        <h3 className="text-xl font-semibold">Order Submission</h3>
        <Skeleton className="h-40 w-full rounded-md" />
      </CardContent>
    </Card>
  );
};

const OrderSubmissionSectionSuspense = ({ orderId }: OrderSubmissionSectionProps) => {
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: orderPackageDetail } = useSuspenseQuery(orderPackageDetailOptions(orderId));
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
  const [isRevisionDialogOpen, setIsRevisionDialogOpen] = useState(false);
  const [selectedRevisionDelivery, setSelectedRevisionDelivery] = useState<DeliveryItem | null>(null);

  const deliveries = orderPackageDetail?.deliveries || [];
  const isOrderDisputed = orderPackageDetail?.status === PackageOrderStatus.Disputed;

  // Function to get presigned URL for file access
  const getFileUrl = async (fileKey: string): Promise<string> => {
    try {
      const response = await fetch(`/api/s3/presign?key=${encodeURIComponent(fileKey)}`);

      if (!response.ok) {
        throw new Error("Failed to get file URL");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error getting file URL:", error);
      toast.error("Failed to access file. Please try again.");
      throw error;
    }
  };

  // Function to handle file access (either direct URL or S3 key)
  const handleFileAccess = async (deliveryFileUrl: string) => {
    try {
      // Check if it's a direct URL or an S3 key
      if (deliveryFileUrl.startsWith("http")) {
        // Direct URL - open it
        window.open(deliveryFileUrl, "_blank");
      } else {
        // S3 key - get presigned URL first
        const actualUrl = await getFileUrl(deliveryFileUrl);
        window.open(actualUrl, "_blank");
      }
    } catch {
      // Error already handled in getFileUrl
    }
  };

  const handleViewDetails = (delivery: DeliveryItem) => {
    setSelectedDelivery(delivery);
  };

  const handleCloseDetailsDialog = () => {
    setSelectedDelivery(null);
  };

  const handleRequestRevision = (delivery: DeliveryItem) => {
    setSelectedRevisionDelivery(delivery);
    setIsRevisionDialogOpen(true);
  };

  const handleCloseRevisionDialog = () => {
    setIsRevisionDialogOpen(false);
    setSelectedRevisionDelivery(null);
  };

  return (
    <Card>
      <CardContent className="flex flex-col space-y-6 rounded-md">
        {/* Header with Submit Button */}
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">Order Submission</h3>
          {orderPackageDetail?.providerId === user?.userId && !isOrderDisputed && (
            <OrderSubmissionSubmitDialog orderId={orderId} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
          )}

          <OrderSubmissionDeliveryDialog
            isOpen={selectedDelivery !== null}
            onClose={handleCloseDetailsDialog}
            delivery={selectedDelivery}
          />

          {selectedRevisionDelivery && (
            <OrderSubmissionRevisionDialog
              isOpen={isRevisionDialogOpen}
              onClose={handleCloseRevisionDialog}
              packageOrderId={orderId}
              revisionNumber={selectedRevisionDelivery.revisionNumber || 1}
            />
          )}
        </div>
        {deliveries.length > 0 ? (
          <div className="overflow-x-auto rounded-md border pb-2">
            <Table>
              <TableCaption>
                <strong>FD:</strong> <strong className="text-main-purple/85">First Delivery</strong> (does not count as
                a revision)
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Revision No.</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Client Feedback</TableHead>
                  <TableHead>Delivered at</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-32 font-medium">{delivery.revisionNumber || "FD"}</TableCell>
                    <TableCell className="w-50">
                      {delivery.deliveryFileUrl ? (
                        <div
                          className="hover:text-main-purple/80 flex w-fit cursor-pointer items-center gap-2 p-2 pl-0 transition-colors"
                          onClick={() => handleFileAccess(delivery.deliveryFileUrl!)}
                        >
                          <FileIcon className="text-main-purple h-4 w-4" />
                          <span className="text-sm">Delivery File</span>
                          <ArrowUpRightIcon className="h-4 w-4" />
                        </div>
                      ) : (
                        <span className="text-gray-400">No file</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {delivery.clientFeedback ? (
                        <div className="max-w-xs truncate" title={delivery.clientFeedback}>
                          {delivery.clientFeedback}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No feedback</span>
                      )}
                    </TableCell>
                    <TableCell className="w-44">
                      {delivery.deliveredAt ? formatDate(new Date(delivery.deliveredAt), "PPp") : "-"}
                    </TableCell>
                    <TableCell className="w-12">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(delivery)}>
                            <EyeIcon className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {delivery.deliveryFileUrl && (
                            <DropdownMenuItem onClick={() => handleFileAccess(delivery.deliveryFileUrl!)}>
                              <ArrowUpRightIcon className="h-4 w-4" />
                              Open File
                            </DropdownMenuItem>
                          )}
                          {orderPackageDetail?.clientId === user?.userId && !isOrderDisputed && (
                            <DropdownMenuItem onClick={() => handleRequestRevision(delivery)}>
                              <Edit className="h-4 w-4" />
                              Request Revision
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border-main-grey text-main-white rounded-md border border-dashed py-8 text-center">
            <FileIcon className="mx-auto mb-4 h-12 w-12 opacity-80" />
            <p>{isOrderDisputed ? "Order is disputed - submissions disabled" : "No deliveries yet"}</p>
          </div>
        )}

        {isOrderDisputed && deliveries.length > 0 && (
          <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-400">
            ⚠️ This order is disputed. All submission features are disabled.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSubmissionSection;
