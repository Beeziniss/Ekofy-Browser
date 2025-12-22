import { AdminPayoutTransactionDetail } from "@/modules/admin/transactions/ui/views";

interface PayoutTransactionDetailPageProps {
  params: Promise<{
    transactionId: string;
  }>;
}

const PayoutTransactionDetailPage = async ({ params }: PayoutTransactionDetailPageProps) => {
  const resolvedParams = await params;
  return <AdminPayoutTransactionDetail transactionId={resolvedParams.transactionId} />;
};

export default PayoutTransactionDetailPage;
