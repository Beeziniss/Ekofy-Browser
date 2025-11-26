// EXAMPLE: Example of how client-options.ts would change with cursor-based pagination
/* 
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type PlaylistEdge {
  node: Playlist!
  cursor: String!
}

type PlaylistConnection {
  edges: [PlaylistEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}


type Query {
  playlists(
    first: Int
    after: String
    last: Int
    before: String
    where: PlaylistFilterInput
    order: [PlaylistSortInput!]
  ): PlaylistConnection
}



export const playlistCursorOptions = (name?: string, first: number = 12) =>
  infiniteQueryOptions({
    queryKey: ["playlists-cursor", name],
    queryFn: async ({ pageParam }) => {
      return await execute(PlaylistsCursorQuery, {
        name,
        first,
        after: pageParam,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.playlists?.pageInfo.hasNextPage
        ? lastPage.playlists?.pageInfo.endCursor
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.playlists?.pageInfo.hasPreviousPage
        ? firstPage.playlists?.pageInfo.startCursor
        : undefined;
    },
  });

// The GraphQL query would also need to change
export const PlaylistsCursorQuery = graphql(`
  query PlaylistsCursor($name: String, $first: Int, $after: String) {
    playlists(
      where: {
        or: { name: { contains: $name }, nameUnsigned: { contains: $name } }
      }
      order: { createdAt: DESC }
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          name
          coverImage
          isPublic
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`); */
