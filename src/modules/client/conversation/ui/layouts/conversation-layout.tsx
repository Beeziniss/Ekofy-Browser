interface ConversationDetailLayoutProps {
  children: React.ReactNode;
}

const ConversationLayout = ({ children }: ConversationDetailLayoutProps) => {
  return (
    <div className="grid h-[calc(100dvh-64px-48px)] w-full grid-cols-12 gap-6 p-6">
      <div className="bg-main-dark-1 col-span-3 rounded-md px-2 py-6">Conversation List</div>
      <div className="bg-main-dark-1 col-span-6 rounded-md">{children}</div>
      <div className="bg-main-dark-1 col-span-3 rounded-md px-2 py-6">Conversation Info</div>
    </div>
  );
};

export default ConversationLayout;
