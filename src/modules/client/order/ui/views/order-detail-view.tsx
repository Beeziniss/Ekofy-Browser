import OrderDetailSection from "../sections/order-detail-section";

interface OrderDetailViewProps {
  orderId: string;
}

const OrderDetailView = ({ orderId }: OrderDetailViewProps) => {
  return (
    <div className="w-full">
      <OrderDetailSection orderId={orderId} />
    </div>
  );
};

export default OrderDetailView;
