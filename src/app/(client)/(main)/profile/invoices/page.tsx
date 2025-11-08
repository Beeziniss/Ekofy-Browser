import Link from "next/link";
import { Button } from "@/components/ui/button";
import SharedInvoicesTable from "@/modules/shared/ui/components/activity/invoices-table";

export default function InvoicesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link href="/profile">
          <Button variant="ghost">&larr; Back to Profile</Button>
        </Link>
      </div>
      <p className="text-muted-foreground mb-2 text-sm">All invoices associated with your account.</p>
      <SharedInvoicesTable
        source="listener"
        invoiceLinkPrefix="/profile/invoices"
        txLinkPrefix="/profile/payment-history"
      />
    </div>
  );
}
