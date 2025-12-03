"use client";

import { useQuery } from "@tanstack/react-query";
import { invoiceDetailsOptions } from "@/gql/options/dashboard-options";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/format-date";
import { formatCurrencyVND } from "@/utils/format-currency";
import { 
  Calendar, 
  User, 
  Mail, 
  MapPin, 
} from "lucide-react";

interface InvoiceDetailModalProps {
  invoiceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-500/10 text-green-500";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-500";
    case "FAILED":
      return "bg-red-500/10 text-red-500";
    case "CANCELED":
      return "bg-gray-500/10 text-gray-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

export function InvoiceDetailModal({ invoiceId, open, onOpenChange }: InvoiceDetailModalProps) {
  const { data: invoice, isLoading } = useQuery({
    ...invoiceDetailsOptions({ id: { eq: invoiceId } }),
    enabled: open && !!invoiceId,
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="!max-w-7xl max-h-[90vh] overflow-y-auto !border-2 border-main-grey scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invoice Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : invoice ? (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Payment Transaction ID</p>
                <p className="font-mono text-sm font-semibold">{invoice.paymentTransactionId}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-semibold text-lg">Customer Information</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name:
                  <span className="text-sm">{invoice.fullName || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email:
                  <span className="text-sm">{invoice.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                    Country:
                  <span className="text-sm">{invoice.country || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                    Paid At:
                  <span className="text-sm">{invoice.paidAt ? formatDate(invoice.paidAt) : "Not paid"}</span>
                </div>
              </div>
            </div>

            {/* Amount Info */}
            <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount:</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrencyVND(invoice.amount || 0)} {invoice.currency}
                  </p>
                </div>
              </div>
            </div>

            {/* Service/Subscription Details */}
            {invoice.oneOffSnapshot && (
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold text-lg">Service Package</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Package Name:</span>
                    <span className="text-sm font-medium">{invoice.oneOffSnapshot.packageName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="text-sm font-medium">
                      {formatCurrencyVND(invoice.oneOffSnapshot.packageAmount)} {invoice.oneOffSnapshot.packageCurrency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm font-medium">{invoice.oneOffSnapshot.oneOffType}</span>
                  </div>
                  {invoice.oneOffSnapshot.estimateDeliveryDays && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Delivery Time:</span>
                      <span className="text-sm font-medium">
                        {invoice.oneOffSnapshot.estimateDeliveryDays} days
                      </span>
                    </div>
                  )}
                  {invoice.oneOffSnapshot.maxRevision !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Max Revisions:</span>
                      <span className="text-sm font-medium">{invoice.oneOffSnapshot.maxRevision}</span>
                    </div>
                  )}
                  {invoice.oneOffSnapshot.packageDescription && (
                    <div className="md:col-span-2 flex items-start gap-2">
                      <span className="text-sm text-muted-foreground">Description:</span>
                      <span className="text-sm font-medium flex-1">{invoice.oneOffSnapshot.packageDescription}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {invoice.subscriptionSnapshot && (
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold text-lg">Subscription Details</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Subscription Name:</span>
                    <span className="text-sm font-medium">{invoice.subscriptionSnapshot.subscriptionName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="text-sm font-medium">
                      {formatCurrencyVND(invoice.subscriptionSnapshot.subscriptionAmount)} {invoice.subscriptionSnapshot.subscriptionCurrency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Tier:</span>
                    <Badge>{invoice.subscriptionSnapshot.subscriptionTier}</Badge>
                  </div>
                  {invoice.subscriptionSnapshot.subscriptionDescription && (
                    <div className="md:col-span-2 flex items-start gap-2">
                      <span className="text-sm text-muted-foreground">Description:</span>
                      <span className="text-sm font-medium flex-1">{invoice.subscriptionSnapshot.subscriptionDescription}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transaction Details */}
            {invoice.transaction && invoice.transaction.length > 0 && (
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold text-lg">Transaction History</h3>
                <div className="space-y-4">
                  {invoice.transaction.map((txn) => (
                    <div key={txn.id}>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Stripe Payment Id:</span>
                          <span className="text-sm font-medium">{txn.stripePaymentId || txn.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Payment Status:</span>
                          <Badge className={getStatusColor(txn.paymentStatus)}>
                            {txn.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Amount:</span>
                          <span className="text-sm font-medium">
                            {formatCurrencyVND(txn.amount)} {txn.currency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Payment Method:</span>
                          <span className="text-sm font-medium">
                            {Array.isArray(txn.stripePaymentMethod) 
                              ? txn.stripePaymentMethod.join(", ") 
                              : txn.stripePaymentMethod}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Created Transaction Date:</span>
                          <span className="text-sm font-medium">{formatDate(txn.createdAt)}</span>
                        </div>
                        {Array.isArray(txn.listener) && txn.listener.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Payer:</span>
                            <span className="text-sm font-medium">{txn.listener[0].displayName}</span>
                          </div>
                        )}
                        {Array.isArray(txn.artist) && txn.artist.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Payer:</span>
                            <span className="text-sm font-medium">{txn.artist[0].stageName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Invoice not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
