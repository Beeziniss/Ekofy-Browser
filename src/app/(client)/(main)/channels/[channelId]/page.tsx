import ChannelDetailView from "@/modules/client/channels/ui/views/channel-detail-view";

interface PageProps {
  params: Promise<{ channelId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { channelId } = await params;

  return <ChannelDetailView channelId={channelId} />;
};

export default Page;
