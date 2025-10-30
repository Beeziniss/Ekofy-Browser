import TrackTrendingSection from "../sections/track-trending-section";
// import PlaylistTrendingSection from "../sections/playlist-trending-section";

const HomeView = () => {
  return (
    <div className="w-full space-y-4 p-2">
      {/* Trending section coming soon */}
      <TrackTrendingSection />

      {/* Playlist Trending Section */}
      {/* <PlaylistTrendingSection /> */}
    </div>
  );
};

export default HomeView;
