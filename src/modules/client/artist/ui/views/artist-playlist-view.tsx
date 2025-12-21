import ArtistPlaylistSection from "../sections/artist-playlist-section";

interface ArtistPLaylistViewProps {
  artistId: string;
}

const ArtistPLaylistView = ({ artistId }: ArtistPLaylistViewProps) => {
  return (
    <div className="w-full">
      <ArtistPlaylistSection artistId={artistId} />
    </div>
  );
};

export default ArtistPLaylistView;
