interface OrderDetailSectionProps {
  orderId: string;
}

const OrderDetailSection = ({ orderId }: OrderDetailSectionProps) => {
  return <div>Detail with id {orderId}</div>;
};

export default OrderDetailSection;
