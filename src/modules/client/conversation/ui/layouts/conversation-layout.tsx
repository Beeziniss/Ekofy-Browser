import ConversationList from "../components/conversation-list";

interface ConversationDetailLayoutProps {
  children: React.ReactNode;
}

const ConversationLayout = ({ children }: ConversationDetailLayoutProps) => {
  return (
    <div className="grid h-[calc(100dvh-64px-48px)] w-full grid-cols-12 gap-6 p-6">
      <div className="bg-main-dark-1 col-span-3 flex h-full flex-col overflow-hidden rounded-md py-6">
        <ConversationList />
      </div>
      <div className="bg-main-dark-1 relative col-span-6 flex h-full flex-col overflow-hidden rounded-md">
        {children}
      </div>
      <div className="bg-main-dark-1 col-span-3 h-full overflow-hidden rounded-md px-2 py-6">Conversation Info</div>
    </div>
  );
};

export default ConversationLayout;
