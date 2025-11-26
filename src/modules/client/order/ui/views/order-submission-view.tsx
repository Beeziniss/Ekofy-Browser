import OrderSubmissionSection from "../sections/order-submission-section";

interface OrderSubmissionViewProps {
  orderId: string;
}

const OrderSubmissionView = ({ orderId }: OrderSubmissionViewProps) => {
  return (
    <div className="w-full">
      <OrderSubmissionSection orderId={orderId} />
    </div>
  );
};

export default OrderSubmissionView;
