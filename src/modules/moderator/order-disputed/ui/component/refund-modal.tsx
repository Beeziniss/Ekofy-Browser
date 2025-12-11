"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useRefundPartially } from "@/gql/client-mutation-options/moderator-mutation";
import { toast } from "sonner";
import { formatCurrencyVND } from "@/utils/format-currency";
import { Loader2 } from "lucide-react";

interface RefundModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  orderAmount: number;
  currency?: string;
}

export function RefundModal({ open, onClose, orderId, orderAmount, currency }: RefundModalProps) {
  const router = useRouter();
  const [clientPercentage, setClientPercentage] = useState(50);
  const [artistPercentage, setArtistPercentage] = useState(50);
  const { mutate: refundPartially, isPending } = useRefundPartially();
  
  // Platform fee percentage (adjust this based on your business logic)
  const platformFeePercentage = 10;

  const handleClientPercentageChange = (value: number) => {
    setClientPercentage(value);
    setArtistPercentage(100 - value);
  };

  const handleArtistPercentageChange = (value: number) => {
    setArtistPercentage(value);
    setClientPercentage(100 - value);
  };

  const handleConfirm = () => {
    refundPartially(
      {
        id: orderId,
        artistPercentageAmount: artistPercentage,
        requestorPercentageAmount: clientPercentage,
      },
      {
        onSuccess: () => {
          toast.success("Refund processed successfully!");
          onClose();
          router.push("/moderator/order-disputed");
          router.refresh();
        },
        onError: (error) => {
          toast.error(`Failed to process refund: ${error.message}`);
        },
      }
    );
  };

  // Calculate amounts based on total order amount
  const clientAmount = (orderAmount * clientPercentage) / 100;
  const artistAmountBeforeFee = (orderAmount * artistPercentage) / 100;
  const platformFee = (artistAmountBeforeFee * platformFeePercentage) / 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-gray-700 bg-gray-800 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Process Partial Refund</DialogTitle>
          <DialogDescription className="text-gray-400">
            Determine the refund split between the client and artist. The total must equal 100%.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Total Amount Display */}
          <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-300">Total Order Amount</p>
              <p className="text-xl font-bold text-blue-400">{formatCurrencyVND(orderAmount)} {currency?.toUpperCase()}</p>
            </div>
          </div>

          {/* Client Refund */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="client-percentage" className="text-gray-300">
                Listener Refund
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="client-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={clientPercentage}
                  onChange={(e) => handleClientPercentageChange(Number(e.target.value))}
                  className="w-20 border-gray-700 bg-gray-900 text-right text-gray-200"
                />
                <span className="text-gray-400">%</span>
              </div>
            </div>
            <Slider
              value={[clientPercentage]}
              onValueChange={(value) => handleClientPercentageChange(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-right text-sm font-medium text-blue-400">{formatCurrencyVND(clientAmount)} {currency?.toUpperCase()}</p>
          </div>

          {/* Artist Payment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="artist-percentage" className="text-gray-300">
                  Artist Payout
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  (The artist will bear the platform&apos;s fees. Platform fee: {platformFeePercentage}% = -{formatCurrencyVND(platformFee)} {currency?.toUpperCase()})
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="artist-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={artistPercentage}
                  onChange={(e) => handleArtistPercentageChange(Number(e.target.value))}
                  className="w-20 border-gray-700 bg-gray-900 text-right text-gray-200"
                />
                <span className="text-gray-400">%</span>
              </div>
            </div>
            <Slider
              value={[artistPercentage]}
              onValueChange={(value) => handleArtistPercentageChange(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-right text-sm font-medium text-blue-400">{formatCurrencyVND(artistAmountBeforeFee)} {currency?.toUpperCase()}</p>
          </div>

          {/* Validation Message */}
          {clientPercentage + artistPercentage !== 100 && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">Total must equal 100%. Currently: {clientPercentage + artistPercentage}%</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending} className="border-gray-700 text-gray-300">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || clientPercentage + artistPercentage !== 100}
            className="bg-main-blue hover:bg-blue-700 text-main-white"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
