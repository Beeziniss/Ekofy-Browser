import { AdminRefundTransactionDetail } from "@/modules/admin/transactions/ui/views";

interface RefundTransactionDetailPageProps {
  params: Promise<{
    transactionId: string;
  }>;
}

const RefundTransactionDetailPage = async ({ params }: RefundTransactionDetailPageProps) => {
  const resolvedParams = await params;
  return <AdminRefundTransactionDetail transactionId={resolvedParams.transactionId} />;
};

export default RefundTransactionDetailPage;
