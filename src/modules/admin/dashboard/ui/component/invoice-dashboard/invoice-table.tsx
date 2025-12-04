"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvoicesDashBoardQuery } from "@/gql/graphql";
import { formatDate } from "@/utils/format-date";
import { formatCurrencyVND } from "@/utils/format-currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { InvoiceDetailModal } from "./invoice-detail-modal";

type Invoice = NonNullable<NonNullable<InvoicesDashBoardQuery["invoices"]>["items"]>[number];

interface InvoiceTableProps {
  invoices: Invoice[];
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

const getTypeInfo = (invoice: Invoice) => {
  if (invoice.oneOffSnapshot) {
    return {
      type: "Service",
      name: invoice.oneOffSnapshot.packageName || "N/A",
      color: "bg-blue-500/10 text-blue-500",
    };
  }
  if (invoice.subscriptionSnapshot) {
    return {
      type: "Subscription",
      name: invoice.subscriptionSnapshot.subscriptionName || "N/A",
      color: "bg-purple-500/10 text-purple-500",
    };
  }
  return {
    type: "Unknown",
    name: "N/A",
    color: "bg-gray-500/10 text-gray-500",
  };
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Paid Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              No invoices found
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => {
            const typeInfo = getTypeInfo(invoice);
            const transaction = invoice.transaction?.[0]; // Get first transaction from array

            return (
              <TableRow key={invoice.id}>
                <TableCell>{invoices.indexOf(invoice) + 1}</TableCell>
                <TableCell>
                  <Badge className={typeInfo.color}>{typeInfo.type}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {typeInfo.name}
                </TableCell>
                <TableCell>
                  {transaction
                    ? `${formatCurrencyVND(transaction.amount)} ${transaction.currency}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {transaction?.stripePaymentMethod ? (
                    Array.isArray(transaction.stripePaymentMethod) ? (
                      transaction.stripePaymentMethod.join(", ")
                    ) : (
                      transaction.stripePaymentMethod
                    )
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {transaction ? (
                    <Badge className={getStatusColor(transaction.paymentStatus)}>
                      {transaction.paymentStatus}
                    </Badge>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {invoice?.paidAt
                    ? formatDate(invoice.paidAt)
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedInvoiceId(invoice.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
      </Table>

      <InvoiceDetailModal
        invoiceId={selectedInvoiceId || ""}
        open={!!selectedInvoiceId}
        onOpenChange={(open) => !open && setSelectedInvoiceId(null)}
      />
    </>
  );
}
