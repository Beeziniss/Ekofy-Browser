import Link from "next/link";
import SharedPaymentTransactionsTable from "@/modules/shared/ui/components/activity/payment-transactions-table";
import { ArrowLeftIcon } from "lucide-react";

export default function PaymentHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment History</h1>
        <Link
          href="/profile"
          className="hover:border-main-white flex items-center gap-x-2 pb-0.5 font-normal transition hover:border-b"
        >
          <ArrowLeftIcon className="size-4" /> Back to Profile
        </Link>
      </div>
      <p className="text-muted-foreground mb-2 text-sm">All payments you made on Ekofy.</p>
      <SharedPaymentTransactionsTable source="listener" linkPrefix="/profile/payment-history" />
    </div>
  );
}
