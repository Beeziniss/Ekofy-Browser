import ActivityConversationSection from "../section/activity-conversation-section";

interface ActivityConversationViewProps {
  userId: string;
}

const ActivityConversationView = ({ userId }: ActivityConversationViewProps) => {
  return (
    <div className="container mx-auto py-12">
      <ActivityConversationSection userId={userId} />
    </div>
  );
};

export default ActivityConversationView;
