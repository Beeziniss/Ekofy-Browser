interface ArtistDetailViewProps {
  artistId: string;
}

const ArtistDetailView = ({ artistId }: ArtistDetailViewProps) => {
  return (
    <div className="w-full">
      <h1 className="text-main-purple text-lg font-semibold">This is artist with ID of {artistId}</h1>
    </div>
  );
};

export default ArtistDetailView;
