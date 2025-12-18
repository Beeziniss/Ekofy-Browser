import { ListenerTransactionHistoryDetail } from "@/modules/client/transaction-history/ui/views";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const TransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  return <ListenerTransactionHistoryDetail transactionId={transactionId} />;
};

export default TransactionDetailPage;
