import ArtistAlbumSection from "../sections/artist-album-section";

interface ArtistAlbumViewProps {
  artistId: string;
}

const ArtistAlbumView = ({ artistId }: ArtistAlbumViewProps) => {
  return (
    <div className="w-full">
      <ArtistAlbumSection artistId={artistId} />
    </div>
  );
};

export default ArtistAlbumView;
