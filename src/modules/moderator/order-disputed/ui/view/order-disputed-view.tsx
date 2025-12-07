import { OrderDisputedLayout } from "../layout";
import { OrderDisputedSection } from "../section";

export function OrderDisputedView() {
  return (
    <OrderDisputedLayout title="Disputed Orders" description="Manage and resolve order disputes">
      <OrderDisputedSection />
    </OrderDisputedLayout>
  );
}
