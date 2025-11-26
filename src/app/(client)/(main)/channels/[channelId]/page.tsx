interface PageProps {
  params: Promise<{ channelId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { channelId } = await params;

  return <div>Channel about {channelId}</div>;
};

export default Page;
