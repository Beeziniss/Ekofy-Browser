import OrderDetailSection from "../sections/order-detail-section";

interface OrderDetailViewProps {
  orderId: string;
}

const OrderDetailView = ({ orderId }: OrderDetailViewProps) => {
  return (
    <div className="bg-main-grey-1 w-full rounded-md p-4">
      <OrderDetailSection orderId={orderId} />
    </div>
  );
};

export default OrderDetailView;
