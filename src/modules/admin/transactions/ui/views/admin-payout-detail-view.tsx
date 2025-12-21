"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { payoutStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import { PayoutTransactionStatus } from "@/gql/graphql";

type DetailRow = { label: string; value: string | number | React.ReactNode };

interface PayoutData {
  id: string;
  createdAt: string;
  amount: number;
  currency: string;
  status: PayoutTransactionStatus;
  method: string;
  stripePayoutId: string;
  description: string;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  userId: string;
}

interface OrderSection {
  orderId: string;
  orderLink: string;
  status: string;
  
  startedAt: string;
  completedAt: string;
  totalAmount: string;
}

interface AdminPayoutDetailViewProps {
  payoutData: PayoutData;
  payoutTypeBadge: React.ReactNode;
  platformFee?: number | null;
  userData: UserData | null;
  orderSection?: OrderSection;
  backHref: string;
}

// Helper component for detail rows
function DetailRow({ label, value }: DetailRow) {
  return (
    <div>
      <dt className="text-muted-foreground mb-1 text-sm">{label}</dt>
      <dd className="text-sm text-white">{value}</dd>
    </div>
  );
}

export default function AdminPayoutDetailView({
  payoutData,
  payoutTypeBadge,
  platformFee,
  userData,
  orderSection,
  backHref,
}: AdminPayoutDetailViewProps) {
  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payout Detail</h1>
        </div>
        <Link
          href={backHref}
          className="text-primary hover:border-main-white flex items-center pb-0.5 text-sm transition hover:border-b"
        >
          <ArrowLeftIcon className="mr-1 size-5" />
          Back to Transactions
        </Link>
      </div>

      {/* Section 1: Payout Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <span>Payout: #{payoutData.id}</span>
            {payoutStatusBadge(payoutData.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow label="Created at" value={formatDate(payoutData.createdAt)} />
            <DetailRow
              label="Amount"
              value={`${payoutData.amount.toLocaleString()} ${payoutData.currency}`}
            />
            <DetailRow label="Type" value={payoutTypeBadge} />
            <DetailRow
              label="Platform Fee"
              value={platformFee !== undefined && platformFee !== null ? `${platformFee}%` : "-"}
            />
            <DetailRow label="Method" value={payoutData.method} />
            <DetailRow label="Stripe Payout ID" value={payoutData.stripePayoutId} />
            {/* Admin specific field */}
            <div className="sm:col-span-2">
              <DetailRow label="Description" value={payoutData.description} />
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Section 2: User Information (Admin specific) */}
      {userData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-white">User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailRow
                label="Full Name"
                value={
                  <Link
                    href={`/admin/user-management/${userData.id}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {userData.fullName}
                  </Link>
                }
              />
              <DetailRow label="Email" value={userData.email} />
              <DetailRow label="Role" value={userData.role} />
              <DetailRow label="User ID" value={userData.userId} />
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Section 3: Order Information (Conditional - only for service payouts) */}
      {orderSection && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Link href={orderSection.orderLink} className="text-primary hover:underline">
                Order: #{orderSection.orderId}
              </Link>
             
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailRow label="Started At" value={orderSection.startedAt} />
              <DetailRow label="Completed At" value={orderSection.completedAt} />
              <DetailRow label="Total Amount" value={orderSection.totalAmount} />
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}