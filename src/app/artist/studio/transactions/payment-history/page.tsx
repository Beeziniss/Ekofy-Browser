import SharedPaymentTransactionsTable from "@/modules/shared/ui/components/activity/payment-transactions-table";

export default function TransactionsPaymentHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment History</h1>
      </div>
      <p className="text-muted-foreground mb-2 text-sm">All payments associated with your artist account.</p>
      <SharedPaymentTransactionsTable source="artist" linkPrefix="/artist/studio/transactions/payment-history" />
    </div>
  );
}
