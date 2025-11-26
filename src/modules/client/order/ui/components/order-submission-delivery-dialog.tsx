import React from "react";
import { FileIcon, ArrowUpRightIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";

type DeliveryItem = {
  revisionNumber?: number;
  deliveryFileUrl?: string;
  clientFeedback?: string | null;
  deliveredAt?: string;
  notes?: string | null;
};

interface OrderSubmissionDeliveryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: DeliveryItem | null;
}

const OrderSubmissionDeliveryDialog = ({ isOpen, onClose, delivery }: OrderSubmissionDeliveryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-main-grey/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-main-white">Delivery Details</DialogTitle>
        </DialogHeader>
        {delivery && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-main-white text-sm font-medium">Revision Number</label>
                <p className="text-main-white bg-input/30 border-input mt-1 rounded-md border p-2">
                  {delivery.revisionNumber || 1}
                </p>
              </div>
              <div>
                <label className="text-main-white text-sm font-medium">Delivered At</label>
                <p className="text-main-white bg-input/30 border-input mt-1 rounded-md border p-2">
                  {delivery.deliveredAt ? formatDate(delivery.deliveredAt) : "Not delivered yet"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-main-white text-sm font-medium">Delivery File</label>
              <div className="bg-input/30 border-input rounded-md border p-2">
                {delivery.deliveryFileUrl ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileIcon className="text-main-purple h-4 w-4" />
                      <span className="text-main-white text-sm">Delivery File</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(delivery.deliveryFileUrl, "_blank")}
                      className="text-main-purple hover:text-main-purple/80"
                    >
                      <ArrowUpRightIcon className="h-4 w-4" />
                      Open
                    </Button>
                  </div>
                ) : (
                  <span className="text-gray-400">No file attached</span>
                )}
              </div>
            </div>

            {delivery.notes && (
              <div>
                <label className="text-main-white text-sm font-medium">Delivery Notes</label>
                <div className="text-main-white bg-input/30 border-input mt-1 min-h-20 rounded-md border p-3">
                  <p className="text-sm whitespace-pre-wrap">{delivery.notes}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-main-white text-sm font-medium">Client Feedback</label>
              <div className="text-main-white bg-input/30 border-input mt-1 min-h-20 rounded-md border p-3">
                {delivery.clientFeedback ? (
                  <p className="text-sm whitespace-pre-wrap">{delivery.clientFeedback}</p>
                ) : (
                  <span className="text-gray-400">No feedback provided yet</span>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderSubmissionDeliveryDialog;
export type { DeliveryItem };
