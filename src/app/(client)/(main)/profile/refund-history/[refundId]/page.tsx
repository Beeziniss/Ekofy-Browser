import { ListenerRefundHistoryDetail } from "@/modules/client/refund-history/ui/views";

interface RefundDetailPageProps {
  params: Promise<{
    refundId: string;
  }>;
}

export default async function RefundDetailPage({ params }: RefundDetailPageProps) {
  const { refundId } = await params;
  return <ListenerRefundHistoryDetail refundId={refundId} />;
}
