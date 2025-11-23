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
      {children}
    </div>
  );
};

export default ConversationLayout;
