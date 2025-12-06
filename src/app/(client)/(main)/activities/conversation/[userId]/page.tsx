import ActivityConversationView from "@/modules/client/activities/ui/views/activity-conversation-view";

interface PageProps {
  params: Promise<{ userId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;

  return <ActivityConversationView userId={userId} />;
};

export default Page;
