"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
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
        onSuccess: async () => {
          // Invalidate and refetch disputed orders to remove processed order
          await queryClient.invalidateQueries({ 
            queryKey: ["moderator-disputed-package-orders"] 
          });
          await queryClient.refetchQueries({ 
            queryKey: ["moderator-disputed-package-orders"] 
          });
          
          toast.success("Refund processed successfully!");
          onClose();
          router.push("/moderator/order-disputed");
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
  const artistAmountAfterFee = artistAmountBeforeFee - platformFee;

  // Minimum amount: 27,000 VND (equivalent to ~$1 USD)
  const getMinimumAmount = (currency?: string): number => {
    const currencyUpper = currency?.toUpperCase() || "VND";
    // Using 27,000 VND as the minimum threshold (equivalent to ~$1 USD)
    if (currencyUpper === "VND") {
      return 27000;
    }
    // For other currencies, use approximate $1 USD equivalent
    const exchangeRates: Record<string, number> = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 150,
      AUD: 1.52,
      CAD: 1.35,
      CNY: 7.2,
      CHF: 0.88,
      SGD: 1.34,
    };
    return exchangeRates[currencyUpper] || 1;
  };

  const minimumAmount = getMinimumAmount(currency);
  const isClientAmountValid = clientAmount >= minimumAmount || clientPercentage === 0;
  const isArtistAmountValid = artistAmountAfterFee >= minimumAmount || artistPercentage === 0;
  
  // Build warning message for minimum amount - always show
  const getMinimumAmountWarning = (): { message: string; isValid: boolean } => {
    const issues: string[] = [];
    if (!isClientAmountValid && clientPercentage > 0) {
      issues.push(`Listener refund (${formatCurrencyVND(clientAmount)} ${currency?.toUpperCase()})`);
    }
    if (!isArtistAmountValid && artistPercentage > 0) {
      issues.push(`Artist payout (${formatCurrencyVND(artistAmountAfterFee)} ${currency?.toUpperCase()})`);
    }
    if (issues.length > 0) {
      return {
        message: `The following amounts are below the minimum of ${formatCurrencyVND(minimumAmount)} ${currency?.toUpperCase()}: ${issues.join(", ")}`,
        isValid: false,
      };
    }
    return {
      message: `All amounts meet the minimum requirement of ${formatCurrencyVND(minimumAmount)} ${currency?.toUpperCase()}`,
      isValid: true,
    };
  };

  const minimumAmountWarning = getMinimumAmountWarning();
  
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
          {/* Minimum Amount Warning - Always visible */}
          <div className={`rounded-lg border p-3 ${
            minimumAmountWarning.isValid 
              ? "border-green-500/20 bg-green-500/10" 
              : "border-orange-500/20 bg-orange-500/10"
          }`}>
            <p className={`text-sm ${
              minimumAmountWarning.isValid 
                ? "text-green-400" 
                : "text-orange-400"
            }`}>
              {minimumAmountWarning.message}
            </p>
          </div>

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
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-gray-400">
                    Artist will receive: <span className="font-semibold text-blue-400">{formatCurrencyVND(artistAmountAfterFee)} {currency?.toUpperCase()}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Platform fee ({platformFeePercentage}% of payout): <span className="text-red-400">-{formatCurrencyVND(platformFee)} {currency?.toUpperCase()}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Payout amount before fee: {formatCurrencyVND(artistAmountBeforeFee)} {currency?.toUpperCase()}
                  </p>
                </div>
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
            <div className="space-y-1">
              <p className="text-right text-sm font-medium text-blue-400">
                Payout: {formatCurrencyVND(artistAmountBeforeFee)} {currency?.toUpperCase()}
              </p>
              <p className="text-right text-xs text-gray-500">
                After fee: {formatCurrencyVND(artistAmountAfterFee)} {currency?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Validation Messages */}
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
            disabled={isPending || clientPercentage + artistPercentage !== 100 || !isClientAmountValid || !isArtistAmountValid}
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
