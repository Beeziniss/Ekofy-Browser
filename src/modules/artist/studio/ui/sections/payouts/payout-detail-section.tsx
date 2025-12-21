"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";

type DetailRow = { label: string; value: string | number | React.ReactNode };

interface PayoutDetailSectionProps {
  title: string;
  backHref: string;
  backLabel?: string;
  headerId: string; // shown as #xxxx in header
  statusBadge?: React.ReactNode;
  rows: DetailRow[];
  orderSection?: OrderSection;
}
interface OrderSection {
  orderLink: string;
  rows: DetailRow[];
}
export default function PayoutDetailSection({
  title,
  backHref,
  backLabel = "Back",
  headerId,
  statusBadge,
  rows,
  orderSection,
}: PayoutDetailSectionProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <Link
          href={backHref}
          className="text-primary hover:border-main-white flex items-center pb-0.5 text-sm transition hover:border-b"
        >
          <ArrowLeftIcon className="mr-1 size-5" />
          {backLabel}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Payout: #{headerId}</span>
            {statusBadge}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rows.map((r, i) => (
              <div key={i}>
                <dt className="text-muted-foreground text-sm">{r.label}</dt>
                <dd className="text-sm">{r.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      {orderSection && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Link href={orderSection.orderLink} className="text-primary hover:underline">
                Order Information
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {orderSection.rows.map((r, i) => (
                <div key={i}>
                  <dt className="text-muted-foreground text-sm">{r.label}</dt>
                  <dd className="text-sm">{r.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
