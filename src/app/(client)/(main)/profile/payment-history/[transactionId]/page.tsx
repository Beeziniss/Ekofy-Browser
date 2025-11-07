import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PaymentTransactionStatus } from "@/gql/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageProps {
  params: Promise<{ transactionId: string }>;
}

const TransactionDetailPage = async ({ params }: PageProps) => {
  const { transactionId } = await params;

  // Mock one transaction. We ignore params.transactionId for now and show a fixed example.
  const tx = {
    id: "tx_mock_1001",
    stripePaymentId: "pi_mock_1001",
    amount: 12900,
    currency: "USD",
    createdAt: new Date().toISOString(),
    paymentStatus: PaymentTransactionStatus.Paid as const,
    stripePaymentMethod: ["card", "apple_pay"],
  };

  const statusBadge = (status: PaymentTransactionStatus) => {
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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaction Detail</h1>
          <p className="text-muted-foreground text-sm">Reference: {transactionId}</p>
        </div>
        <Link href="/profile/payment-history" className="text-primary text-sm hover:underline">
          &larr; Back to Payment History
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>#{tx.id.slice(-8)}</span>
            {statusBadge(tx.paymentStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm">Created at</dt>
              <dd className="text-sm">{new Date(tx.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Amount</dt>
              <dd className="text-sm">
                {tx.amount.toLocaleString()} {tx.currency}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Payment methods</dt>
              <dd className="text-sm">{tx.stripePaymentMethod.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Stripe Payment ID</dt>
              <dd className="text-sm">{tx.stripePaymentId}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetailPage;
