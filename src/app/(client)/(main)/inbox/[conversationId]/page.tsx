import ConversationDetailView from "@/modules/client/conversation/ui/views/conversation-detail-view";

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { conversationId } = await params;

  return <ConversationDetailView conversationId={conversationId} />;
};

export default Page;
