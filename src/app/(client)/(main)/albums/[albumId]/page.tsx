import AlbumDetailView from "@/modules/client/albums/ui/views/album-detail-view";

interface PageProps {
  params: Promise<{ albumId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { albumId } = await params;

  return <AlbumDetailView albumId={albumId}  />
};
export default Page;
