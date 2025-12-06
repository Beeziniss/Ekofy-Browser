import { OrderDetailLayout } from "../layout";
import { OrderDetailSection } from "../section";

interface OrderDetailViewProps {
  orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  return (
    <OrderDetailLayout>
      <OrderDetailSection orderId={orderId} />
    </OrderDetailLayout>
  );
}
