import { AdminTransactionDetail } from "@/modules/admin/transactions/ui/views/admin-transaction-detail";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const TransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  return <AdminTransactionDetail transactionId={transactionId} />;
};

export default TransactionDetailPage;
