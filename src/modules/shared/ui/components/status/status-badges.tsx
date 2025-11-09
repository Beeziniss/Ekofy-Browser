import { Badge } from "@/components/ui/badge";
import { PaymentTransactionStatus, PayoutTransactionStatus } from "@/gql/graphql";

export const paymentStatusBadge = (status: PaymentTransactionStatus) => {
  switch (status) {
    case PaymentTransactionStatus.Paid:
      return <Badge className="border-green-200 bg-green-100 text-green-800">Paid</Badge>;
    case PaymentTransactionStatus.Pending:
      return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">Pending</Badge>;
    case PaymentTransactionStatus.Unpaid:
      return <Badge className="border-red-200 bg-red-100 text-red-800">Unpaid</Badge>;
    default:
      return <Badge className="border-gray-200 bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};

export const payoutStatusBadge = (status: PayoutTransactionStatus) => {
  switch (status) {
    case PayoutTransactionStatus.Paid:
      return <Badge className="border-green-200 bg-green-100 text-green-800">Paid</Badge>;
    case PayoutTransactionStatus.Pending:
      return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">Pending</Badge>;
    case PayoutTransactionStatus.InTransit:
      return <Badge className="border-blue-200 bg-blue-100 text-blue-800">In transit</Badge>;
    case PayoutTransactionStatus.Failed:
      return <Badge className="border-red-200 bg-red-100 text-red-800">Failed</Badge>;
    case PayoutTransactionStatus.Canceled:
      return <Badge className="border-gray-200 bg-gray-100 text-gray-800">Canceled</Badge>;
    default:
      return <Badge className="border-gray-200 bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};
