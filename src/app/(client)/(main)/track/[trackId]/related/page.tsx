import RelatedTracksView from "@/modules/client/track/ui/views/related-tracks-view";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { trackId } = await params;

  return <RelatedTracksView trackId={trackId} />;
};

export default Page;
