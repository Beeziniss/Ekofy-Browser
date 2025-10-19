import { graphql } from "@/gql";
import TrackTrendingSection from "../sections/track-trending-section";

export const TrackListHomeQuery = graphql(`
  query TrackListHome($take: Int!) {
    tracks(take: $take) {
      totalCount
      items {
        id
        name
        coverImage
        mainArtistIds
        artist {
          id
          stageName
        }
      }
    }
  }
`);

const HomeView = () => {
  return (
    <div className="w-full p-2">
      {/* Trending section coming soon */}
      {/* <TrackTrendingSection /> */}
    </div>
  );
};

export default HomeView;
