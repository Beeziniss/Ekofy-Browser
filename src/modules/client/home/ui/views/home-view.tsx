import NewReleasesSection from "../sections/new-releases-section";
import TopCategoriesSection from "../sections/top-categories-section";
import TracksYouLoveSection from "../sections/tracks-you-love-section";
import PlaylistTrendingSection from "../sections/playlist-trending-section";
// import PlaylistsYouLoveSection from "../sections/playlists-you-love-section";
import PlaylistsYouLoveSecondSection from "../sections/playlists-you-love-second-section";

const HomeView = () => {
  return (
    <div className="w-full space-y-8 px-2 pt-6 pb-10">
      {/* New releases for you */}
      <NewReleasesSection />

      {/* Your top categories */}
      <TopCategoriesSection />

      {/* Playlists you'll love */}
      {/* <PlaylistsYouLoveSection /> */}
      <PlaylistTrendingSection />

      {/* Tracks you love */}
      <TracksYouLoveSection />

      {/* More playlists for you */}
      <PlaylistsYouLoveSecondSection />
    </div>
  );
};

export default HomeView;
