/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query TracksWithFilters(\n    $skip: Int!\n    $take: Int!\n    $where: TrackFilterInput\n    $order: [TrackSortInput!]\n  ) {\n    tracks(skip: $skip, take: $take, where: $where, order: $order) {\n      totalCount\n      items {\n        id\n        name\n        mainArtistIds\n        streamCount\n        favoriteCount\n        coverImage\n        isExplicit\n        releaseInfo {\n          releaseDate\n          isReleased\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": typeof types.TracksWithFiltersDocument,
    "\n  query TrackListHome($take: Int!) {\n    tracks(take: $take) {\n      totalCount\n      items {\n        id\n        name\n        coverImage\n        mainArtistIds\n        artist {\n          id\n          stageName\n        }\n      }\n    }\n  }\n": typeof types.TrackListHomeDocument,
};
const documents: Documents = {
    "\n  query TracksWithFilters(\n    $skip: Int!\n    $take: Int!\n    $where: TrackFilterInput\n    $order: [TrackSortInput!]\n  ) {\n    tracks(skip: $skip, take: $take, where: $where, order: $order) {\n      totalCount\n      items {\n        id\n        name\n        mainArtistIds\n        streamCount\n        favoriteCount\n        coverImage\n        isExplicit\n        releaseInfo {\n          releaseDate\n          isReleased\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.TracksWithFiltersDocument,
    "\n  query TrackListHome($take: Int!) {\n    tracks(take: $take) {\n      totalCount\n      items {\n        id\n        name\n        coverImage\n        mainArtistIds\n        artist {\n          id\n          stageName\n        }\n      }\n    }\n  }\n": types.TrackListHomeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TracksWithFilters(\n    $skip: Int!\n    $take: Int!\n    $where: TrackFilterInput\n    $order: [TrackSortInput!]\n  ) {\n    tracks(skip: $skip, take: $take, where: $where, order: $order) {\n      totalCount\n      items {\n        id\n        name\n        mainArtistIds\n        streamCount\n        favoriteCount\n        coverImage\n        isExplicit\n        releaseInfo {\n          releaseDate\n          isReleased\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): typeof import('./graphql').TracksWithFiltersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TrackListHome($take: Int!) {\n    tracks(take: $take) {\n      totalCount\n      items {\n        id\n        name\n        coverImage\n        mainArtistIds\n        artist {\n          id\n          stageName\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').TrackListHomeDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
