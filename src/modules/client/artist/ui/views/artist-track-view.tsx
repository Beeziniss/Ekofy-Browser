import ArtistTrackSection from "../sections/artist-track-section";

interface ArtistTrackViewProps {
  artistId: string;
}

const ArtistTrackView = ({ artistId }: ArtistTrackViewProps) => {
  return (
    <div className="w-full">
      <ArtistTrackSection artistId={artistId} />
    </div>
  );
};

export default ArtistTrackView;
