import ActivityOrderSection from "../section/activity-order-section";

interface ActivityOrderViewProps {
  userId: string;
}

const ActivityOrderView = ({ userId }: ActivityOrderViewProps) => {
  return (
    <div className="container mx-auto py-12">
      <ActivityOrderSection userId={userId} />
    </div>
  );
};

export default ActivityOrderView;
