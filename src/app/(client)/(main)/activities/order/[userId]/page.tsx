import ActivityOrderView from "@/modules/client/activities/ui/views/activity-order-view";

interface PageProps {
  params: Promise<{ userId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;

  return <ActivityOrderView userId={userId} />;
};

export default Page;
