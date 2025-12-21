/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { PayoutTransactionStatus, PackageOrderStatus } from "@/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import {
  adminPayoutTransactionByIdOptions,
  platformFeeByPayoutIdOptions,
  artistPackageByIdOptions,
} from "@/gql/options/transaction-options";
import { Badge } from "@/components/ui/badge";
import { payoutStatusBadge } from "@/modules/shared/ui/components/status/status-badges";
import AdminPayoutDetailView from "../views/admin-payout-detail-view";

type Props = {
  referenceId: string;
  backHref?: string;
};

export default function AdminPayoutDetailContainer({
  referenceId,
  backHref = "/admin/transactions",
}: Props) {
  // Query payout transaction
  const { data, isLoading, isError } = useQuery({
    ...adminPayoutTransactionByIdOptions({ id: referenceId }),
  });

  // Query platform fee and order data
//   const { data: platformFeeData } = useQuery({
//     ...platformFeeByPayoutIdOptions({ payoutTransactionId: referenceId }),
//   });

  // Extract artistPackageId and query package data
//   const artistPackageId = platformFeeData?.packageOrders?.items?.[0]?.artistPackageId;

//   const { data: packageData, isLoading: isLoadingPackage } = useQuery({
//     ...artistPackageByIdOptions({ artistPackageId: artistPackageId || "" }),
//     enabled: !!artistPackageId,
//   });

  // Loading and error states
  if (isLoading) return <div className="p-4">Loading payout transaction…</div>;
if (isError || !data) return <div className="p-4 text-red-500">Failed to load payout transaction.</div>;

  const transaction = (data as any)?.payoutTransactions?.items?.[0];
  if (!transaction) return <div className="p-4">Payout transaction not found.</div>;

  // Determine payout type
//   const platformFee = platformFeeData?.packageOrders?.items?.[0]?.platformFeePercentage;
const platformFee = null; // Temporary fix
//   const isService = platformFee !== undefined && platformFee !== null;
const isService = !transaction.royaltyReportId; // Temporary fix
  const payoutTypeBadge = isService ? (
    <Badge variant="ekofy">Service</Badge>
  ) : (
    <Badge variant="secondary">Streaming</Badge>
  );

  // Prepare payout data
  const payoutData = {
    id: transaction.id,
    createdAt: transaction.createdAt as unknown as string,
    amount: transaction.amount,
    currency: transaction.currency,
    status: transaction.status as PayoutTransactionStatus,
    method: transaction.method ?? "-",
    stripePayoutId: transaction.stripePayoutId,
    description: transaction.description || "-",
  };

  // Prepare user data
  const userData = transaction.user?.[0]
    ? {
        id: transaction.user[0].id,
        fullName: transaction.user[0].fullName,
        email: transaction.user[0].email,
        role: transaction.user[0].role,
        userId: transaction.userId,
      }
    : null;

  // Prepare order data
//   const orderData = platformFeeData?.packageOrders?.items?.[0];
//   const orderSection = isService && orderData
//     ? {
//         orderId: orderData.id,
//         orderLink: `/moderator/orders/${orderData.id}`, // Or /admin/orders if exists
//         status: orderData.status,
//         startedAt: orderData.startedAt
//           ? new Date(orderData.startedAt as unknown as string).toLocaleString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//             })
//           : "-",
//         completedAt: orderData.completedAt
//           ? new Date(orderData.completedAt as unknown as string).toLocaleString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//             })
//           : "-",
//         totalAmount:
//           isLoadingPackage
//             ? "Loading..."
//             : packageData?.artistPackages?.items?.[0]?.amount && packageData?.artistPackages?.items?.[0]?.currency
//               ? `${packageData.artistPackages.items[0].amount.toLocaleString()} ${packageData.artistPackages.items[0].currency}`
//               : "-",
//       }
//     : undefined;
const orderSection = undefined;
  return (
    <AdminPayoutDetailView
      payoutData={payoutData}
      payoutTypeBadge={payoutTypeBadge}
      platformFee={platformFee}
      userData={userData}
      orderSection={orderSection}
      backHref={backHref}
    />
  );
}