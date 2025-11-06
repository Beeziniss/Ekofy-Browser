import ArtistServiceSection from "../sections/services/artist-service-section";

interface ArtistDetailServiceViewProps {
  artistId: string;
}

const ArtistDetailServiceView = ({ artistId }: ArtistDetailServiceViewProps) => {
  return (
    <div className="w-full">
      <ArtistServiceSection artistId={artistId} />
    </div>
  );
};

export default ArtistDetailServiceView;
