import { graphql } from "@/gql";

export const TrackListHomeQuery = graphql(`
  query TrackListHome($take: Int!) {
    tracks(take: $take) {
      totalCount
      items {
        id
        name
        coverImage
        mainArtistIds
        mainArtists {
          items {
            id
            stageName
          }
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
