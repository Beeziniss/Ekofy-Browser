"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ invoiceId: string }>();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role !== UserRole.LISTENER) {
      clearUserData();
      router.replace("/login");
    }
  }, [isAuthenticated, user?.role, router, clearUserData]);

  if (!isAuthenticated || user?.role !== UserRole.LISTENER) return null;

  // Mock one invoice. We ignore params.invoiceId for now and show an example.
  const inv = {
    id: "inv_mock_5001",
    amount: 12900,
    currency: "USD",
    to: "Customer 1001",
    from: "Ekofy Inc.",
    email: "customer1001@example.com",
    paidAt: new Date().toISOString(),
    paymentTransactionId: "tx_mock_1001",
  };

  return (
    <Suspense fallback={<div className="p-4">Loading invoice…</div>}>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoice Detail</h1>
            <p className="text-muted-foreground text-sm">Reference: {params.invoiceId}</p>
          </div>
          <Link href="/profile/invoices" className="text-primary text-sm hover:underline">
            &larr; Back to Invoices
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>#{inv.id.slice(-8)}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-sm">Paid at</dt>
                <dd className="text-sm">{new Date(inv.paidAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Amount</dt>
                <dd className="text-sm">
                  {inv.amount.toLocaleString()} {inv.currency}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Billed to</dt>
                <dd className="text-sm">
                  {inv.to} ({inv.email})
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Billed from</dt>
                <dd className="text-sm">{inv.from}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Transaction</dt>
                <dd className="text-sm">{inv.paymentTransactionId}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
