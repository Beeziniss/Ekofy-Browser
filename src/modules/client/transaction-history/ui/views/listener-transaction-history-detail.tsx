import { TransactionDetailSection } from "../sections";

interface ListenerTransactionHistoryDetailProps {
  transactionId: string;
}

export function ListenerTransactionHistoryDetail({ transactionId }: ListenerTransactionHistoryDetailProps) {
  return <TransactionDetailSection referenceId={transactionId} />;
}
