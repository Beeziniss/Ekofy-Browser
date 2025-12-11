"use client";

import RefundDetailSection from "../sections/refund-detail-section";

interface ListenerRefundHistoryDetailProps {
  refundId: string;
}

export function ListenerRefundHistoryDetail({ refundId }: ListenerRefundHistoryDetailProps) {
  return <RefundDetailSection referenceId={refundId} />;
}
