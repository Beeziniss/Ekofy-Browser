import Link from "next/link";
import { Button } from "@/components/ui/button";
import PaymentTransactionsTable from "@/modules/client/profile/ui/components/activity/payment-transactions-table";

export default function PaymentHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment History</h1>
        <Button variant="ghost" asChild>
          <Link href="/profile">&larr; Back to Profile</Link>
        </Button>
      </div>
      <p className="text-muted-foreground mb-2 text-sm">All payments you made on Ekofy.</p>
      <PaymentTransactionsTable />
    </div>
  );
}
