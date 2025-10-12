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
    "\n  query Users($where: UserFilterInput) {\n    users(where: $where) {\n      items {\n        id\n        email\n        fullName\n        gender\n        birthDate\n        role\n        phoneNumber\n        status\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.UsersDocument,
    "\n  query TracksWithFilters(\n    $skip: Int!\n    $take: Int!\n    $where: TrackFilterInput\n    $order: [TrackSortInput!]\n  ) {\n    tracks(skip: $skip, take: $take, where: $where, order: $order) {\n      totalCount\n      items {\n        id\n        name\n        mainArtistIds\n        streamCount\n        favoriteCount\n        coverImage\n        isExplicit\n        releaseInfo {\n          releaseDate\n          isReleased\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": typeof types.TracksWithFiltersDocument,
    "\n  query TrackListHome($take: Int!) {\n    tracks(take: $take) {\n      totalCount\n      items {\n        id\n        name\n        coverImage\n        mainArtistIds\n        artist {\n          id\n          stageName\n        }\n      }\n    }\n  }\n": typeof types.TrackListHomeDocument,
    "\n  query Artists($skip: Int, $take: Int, $where: ArtistFilterInput!) {\n    artists(skip: $skip, take: $take, where: $where) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        id\n        userId\n        stageName\n        email\n        artistType\n        isVerified\n        verifiedAt\n        createdAt\n        updatedAt\n        user {\n          status\n          gender\n          phoneNumber\n        }\n        members {\n          fullName\n          email\n          phoneNumber\n          isLeader\n          gender\n        }\n        avatarImage\n        bannerImage\n        identityCard {\n          number\n          fullName\n          dateOfBirth\n          gender\n          placeOfOrigin\n          nationality\n          frontImage\n          backImage\n          validUntil\n          placeOfResidence {\n            street\n            ward\n            province\n            oldDistrict\n            oldWard\n            oldProvince\n            addressLine\n          }\n        }\n      }\n    }\n  }\n": typeof types.ArtistsDocument,
};
const documents: Documents = {
    "\n  query Users($where: UserFilterInput) {\n    users(where: $where) {\n      items {\n        id\n        email\n        fullName\n        gender\n        birthDate\n        role\n        phoneNumber\n        status\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.UsersDocument,
    "\n  query TracksWithFilters(\n    $skip: Int!\n    $take: Int!\n    $where: TrackFilterInput\n    $order: [TrackSortInput!]\n  ) {\n    tracks(skip: $skip, take: $take, where: $where, order: $order) {\n      totalCount\n      items {\n        id\n        name\n        mainArtistIds\n        streamCount\n        favoriteCount\n        coverImage\n        isExplicit\n        releaseInfo {\n          releaseDate\n          isReleased\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.TracksWithFiltersDocument,
    "\n  query TrackListHome($take: Int!) {\n    tracks(take: $take) {\n      totalCount\n      items {\n        id\n        name\n        coverImage\n        mainArtistIds\n        artist {\n          id\n          stageName\n        }\n      }\n    }\n  }\n": types.TrackListHomeDocument,
    "\n  query Artists($skip: Int, $take: Int, $where: ArtistFilterInput!) {\n    artists(skip: $skip, take: $take, where: $where) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        id\n        userId\n        stageName\n        email\n        artistType\n        isVerified\n        verifiedAt\n        createdAt\n        updatedAt\n        user {\n          status\n          gender\n          phoneNumber\n        }\n        members {\n          fullName\n          email\n          phoneNumber\n          isLeader\n          gender\n        }\n        avatarImage\n        bannerImage\n        identityCard {\n          number\n          fullName\n          dateOfBirth\n          gender\n          placeOfOrigin\n          nationality\n          frontImage\n          backImage\n          validUntil\n          placeOfResidence {\n            street\n            ward\n            province\n            oldDistrict\n            oldWard\n            oldProvince\n            addressLine\n          }\n        }\n      }\n    }\n  }\n": types.ArtistsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Users($where: UserFilterInput) {\n    users(where: $where) {\n      items {\n        id\n        email\n        fullName\n        gender\n        birthDate\n        role\n        phoneNumber\n        status\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): typeof import('./graphql').UsersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TracksWithFilters(\n    $skip: Int!\n    $take: Int!\n    $where: TrackFilterInput\n    $order: [TrackSortInput!]\n  ) {\n    tracks(skip: $skip, take: $take, where: $where, order: $order) {\n      totalCount\n      items {\n        id\n        name\n        mainArtistIds\n        streamCount\n        favoriteCount\n        coverImage\n        isExplicit\n        releaseInfo {\n          releaseDate\n          isReleased\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): typeof import('./graphql').TracksWithFiltersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TrackListHome($take: Int!) {\n    tracks(take: $take) {\n      totalCount\n      items {\n        id\n        name\n        coverImage\n        mainArtistIds\n        artist {\n          id\n          stageName\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').TrackListHomeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Artists($skip: Int, $take: Int, $where: ArtistFilterInput!) {\n    artists(skip: $skip, take: $take, where: $where) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        id\n        userId\n        stageName\n        email\n        artistType\n        isVerified\n        verifiedAt\n        createdAt\n        updatedAt\n        user {\n          status\n          gender\n          phoneNumber\n        }\n        members {\n          fullName\n          email\n          phoneNumber\n          isLeader\n          gender\n        }\n        avatarImage\n        bannerImage\n        identityCard {\n          number\n          fullName\n          dateOfBirth\n          gender\n          placeOfOrigin\n          nationality\n          frontImage\n          backImage\n          validUntil\n          placeOfResidence {\n            street\n            ward\n            province\n            oldDistrict\n            oldWard\n            oldProvince\n            addressLine\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ArtistsDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
