"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Scale } from "lucide-react";
import { RefundModal } from "./refund-modal";

interface OrderDetailActionsProps {
  orderId: string;
  orderAmount: number;
}

export function OrderDetailActions({ orderId, orderAmount }: OrderDetailActionsProps) {
  const [showRefundModal, setShowRefundModal] = useState(false);

  return (
    <>
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-gray-100">
            <Scale className="mr-2 h-5 w-5" />
            Moderator Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-500">Dispute Resolution Required</h4>
                <p className="mt-1 text-sm text-gray-300">
                  This order is in dispute. Review the details carefully and decide on the appropriate refund split
                  between the client and artist.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => setShowRefundModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Scale className="mr-2 h-4 w-4" />
              Process Refund
            </Button>
            <p className="text-center text-xs text-gray-400">
              Determine refund percentages for client and artist
            </p>
          </div>
        </CardContent>
      </Card>

      <RefundModal
        open={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        orderId={orderId}
        orderAmount={orderAmount}
      />
    </>
  );
}
