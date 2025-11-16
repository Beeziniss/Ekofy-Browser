interface ConversationDetailViewProps {
  conversationId: string;
}

const ConversationDetailView = ({ conversationId }: ConversationDetailViewProps) => {
  return <div>Conversation Id: {conversationId}</div>;
};

export default ConversationDetailView;
