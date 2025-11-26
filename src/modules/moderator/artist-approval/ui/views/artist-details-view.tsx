import { ArtistDetailsLayout } from "../layout";
import { ArtistDetailsSection } from "../section";

interface ArtistDetailsViewProps {
  userId: string;
}

const ArtistDetailsView = ({ userId }: ArtistDetailsViewProps) => {
  return (
    <ArtistDetailsLayout
      title="Artist information"
      description="Review artist details and approve or reject the application"
    >
      <ArtistDetailsSection userId={userId} />
    </ArtistDetailsLayout>
  );
};

export default ArtistDetailsView;
