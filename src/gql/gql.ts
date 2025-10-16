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
    "\n  query UsersList($skip: Int, $take: Int, $where: UserFilterInput) {\n    users(skip: $skip, take: $take, where: $where) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        id\n        email\n        fullName\n        gender\n        birthDate\n        role\n        phoneNumber\n        status\n        isLinkedWithGoogle\n        stripeCustomerId\n        stripeAccountId\n        lastLoginAt\n        createdAt\n        updatedAt\n      }\n    }\n    artists {\n      items {\n        id\n        userId\n        stageName\n        email\n        artistType\n        categoryIds\n        biography\n        followerCount\n        popularity\n        avatarImage\n        bannerImage\n        isVerified\n        verifiedAt\n        createdAt\n        updatedAt\n        members {\n          fullName\n          email\n          phoneNumber\n          isLeader\n          gender\n        }\n        identityCard {\n          number\n          fullName\n          dateOfBirth\n          gender\n          placeOfOrigin\n          nationality\n          validUntil\n          placeOfResidence {\n            street\n            ward\n            province\n            oldDistrict\n            oldWard\n            oldProvince\n            addressLine\n          }\n        }\n      }\n    }\n    listeners {\n      items {\n        id\n        userId\n        displayName\n        email\n        avatarImage\n        bannerImage\n        isVerified\n        verifiedAt\n        followerCount\n        followingCount\n        lastFollowers\n        lastFollowing\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.UsersListDocument,
    "\n  mutation CreateModerator(\n    $createModeratorRequest: CreateModeratorRequestInput!\n  ) {\n    createModerator(createModeratorRequest: $createModeratorRequest)\n  }\n": typeof types.CreateModeratorDocument,
    "\n  mutation banUser($targetUserId: String!) {\n    banUser(targetUserId: $targetUserId)\n  }\n": typeof types.BanUserDocument,
    "\n  mutation ReActiveUser($targetUserId: String!) {\n    reActiveUser(targetUserId: $targetUserId)\n  }\n": typeof types.ReActiveUserDocument,
    "\n  query TracksWithFilters(\n    $skip: Int!\n    $take: Int!\n    $where: TrackFilterInput\n    $order: [TrackSortInput!]\n  ) {\n    tracks(skip: $skip, take: $take, where: $where, order: $order) {\n      totalCount\n      items {\n        id\n        name\n        mainArtistIds\n        streamCount\n        favoriteCount\n        coverImage\n        isExplicit\n        releaseInfo {\n          releaseDate\n          isReleased\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": typeof types.TracksWithFiltersDocument,
    "\n  query TrackListHome($take: Int!) {\n    tracks(take: $take) {\n      totalCount\n      items {\n        id\n        name\n        coverImage\n        mainArtistIds\n        artist {\n          id\n          stageName\n        }\n      }\n    }\n  }\n": typeof types.TrackListHomeDocument,
    "\n  mutation createPlaylist($createPlaylistRequest: CreatePlaylistRequestInput!) {\n    createPlaylist(createPlaylistRequest: $createPlaylistRequest)\n  }\n": typeof types.CreatePlaylistDocument,
    "\n  mutation deletePlaylist($playlistId: String!) {\n    deletePlaylist(playlistId: $playlistId)\n  }\n": typeof types.DeletePlaylistDocument,
    "\n  query Playlists {\n    playlists {\n      items {\n        id\n        name\n        coverImage\n        isPublic\n      }\n      totalCount\n    }\n  }\n": typeof types.PlaylistsDocument,
    "\n  mutation AddToPlaylist($addToPlaylistRequest: AddToPlaylistRequestInput!) {\n    addToPlaylist(addToPlaylistRequest: $addToPlaylistRequest)\n  }\n": typeof types.AddToPlaylistDocument,
    "\n  mutation RemoveFromPlaylist(\n    $addToPlaylistRequest: AddToPlaylistRequestInput!\n  ) {\n    removeFromPlaylist(addToPlaylistRequest: $addToPlaylistRequest)\n  }\n": typeof types.RemoveFromPlaylistDocument,
    "\n  query PlaylistBrief {\n    playlists {\n      items {\n        id\n        name\n        coverImage\n        isPublic\n      }\n    }\n  }\n": typeof types.PlaylistBriefDocument,
    "\n  query CheckTrackInPlaylist($trackId: String!) {\n    playlists(where: { tracksInfo: { some: { trackId: { eq: $trackId } } } }) {\n      items {\n        id\n      }\n    }\n  }\n": typeof types.CheckTrackInPlaylistDocument,
    "\n  query PlaylistDetail($playlistId: String!) {\n    playlists(where: { id: { eq: $playlistId } }) {\n      items {\n        id\n        name\n        coverImage\n        description\n        isPublic\n        user {\n          id\n          fullName\n        }\n        userId\n        tracks {\n          id\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.PlaylistDetailDocument,
    "\n  query PlaylistDetailTrackList($playlistId: String!) {\n    playlists(where: { id: { eq: $playlistId } }) {\n      items {\n        id\n        tracks {\n          id\n          name\n        }\n        tracksInfo {\n          trackId\n        }\n      }\n    }\n  }\n": typeof types.PlaylistDetailTrackListDocument,
    "\n  query TrackDetail($trackId: String!) {\n    tracks(where: { id: { eq: $trackId } }) {\n      items {\n        id\n        name\n        coverImage\n        favoriteCount\n        streamCount\n        mainArtistIds\n        artist {\n          id\n          stageName\n          followerCount\n        }\n      }\n    }\n  }\n": typeof types.TrackDetailDocument,
    "\n  query PendingArtistRegistrationsView($pageNumber: Int!, $pageSize: Int!, $where: PendingArtistRegistrationResponseFilterInput) {\n    pendingArtistRegistrations(pageNumber: $pageNumber, pageSize: $pageSize, where: $where) {\n      email\n      fullName\n      stageName\n      artistType\n      gender\n      birthDate\n      phoneNumber\n      avatarImage\n      id\n      totalCount\n    }\n  }\n": typeof types.PendingArtistRegistrationsViewDocument,
    "\n  query PendingArtistRegistrationsDetail($id: String) {\n    pendingArtistRegistrations(where: { id: { eq: $id } }) {\n      email\n      fullName\n      stageName\n      artistType\n      gender\n      birthDate\n      phoneNumber\n      avatarImage\n      id\n      members {\n        fullName\n        email\n        phoneNumber\n        isLeader\n        gender\n      }\n      requestedAt\n      timeToLive\n      identityCardNumber\n      identityCardDateOfBirth\n      identityCardFullName\n      placeOfOrigin\n      placeOfResidence\n      frontImageUrl\n      backImageUrl\n    }\n  }\n": typeof types.PendingArtistRegistrationsDetailDocument,
    "\n  mutation ApproveArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {\n    approveArtistRegistration(request: $request)\n  }\n": typeof types.ApproveArtistRegistrationDocument,
    "\n  mutation RejectArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {\n    rejectArtistRegistration(request: $request)\n  }\n": typeof types.RejectArtistRegistrationDocument,
};
const documents: Documents = {
    "\n  query Users($where: UserFilterInput) {\n    users(where: $where) {\n      items {\n        id\n        email\n        fullName\n        gender\n        birthDate\n        role\n        phoneNumber\n        status\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.UsersDocument,
    "\n  query UsersList($skip: Int, $take: Int, $where: UserFilterInput) {\n    users(skip: $skip, take: $take, where: $where) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        id\n        email\n        fullName\n        gender\n        birthDate\n        role\n        phoneNumber\n        status\n        isLinkedWithGoogle\n        stripeCustomerId\n        stripeAccountId\n        lastLoginAt\n        createdAt\n        updatedAt\n      }\n    }\n    artists {\n      items {\n        id\n        userId\n        stageName\n        email\n        artistType\n        categoryIds\n        biography\n        followerCount\n        popularity\n        avatarImage\n        bannerImage\n        isVerified\n        verifiedAt\n        createdAt\n        updatedAt\n        members {\n          fullName\n          email\n          phoneNumber\n          isLeader\n          gender\n        }\n        identityCard {\n          number\n          fullName\n          dateOfBirth\n          gender\n          placeOfOrigin\n          nationality\n          validUntil\n          placeOfResidence {\n            street\n            ward\n            province\n            oldDistrict\n            oldWard\n            oldProvince\n            addressLine\n          }\n        }\n      }\n    }\n    listeners {\n      items {\n        id\n        userId\n        displayName\n        email\n        avatarImage\n        bannerImage\n        isVerified\n        verifiedAt\n        followerCount\n        followingCount\n        lastFollowers\n        lastFollowing\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.UsersListDocument,
    "\n  mutation CreateModerator(\n    $createModeratorRequest: CreateModeratorRequestInput!\n  ) {\n    createModerator(createModeratorRequest: $createModeratorRequest)\n  }\n": types.CreateModeratorDocument,
    "\n  mutation banUser($targetUserId: String!) {\n    banUser(targetUserId: $targetUserId)\n  }\n": types.BanUserDocument,
    "\n  mutation ReActiveUser($targetUserId: String!) {\n    reActiveUser(targetUserId: $targetUserId)\n  }\n": types.ReActiveUserDocument,
    "\n  query TracksWithFilters(\n    $skip: Int!\n    $take: Int!\n    $where: TrackFilterInput\n    $order: [TrackSortInput!]\n  ) {\n    tracks(skip: $skip, take: $take, where: $where, order: $order) {\n      totalCount\n      items {\n        id\n        name\n        mainArtistIds\n        streamCount\n        favoriteCount\n        coverImage\n        isExplicit\n        releaseInfo {\n          releaseDate\n          isReleased\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.TracksWithFiltersDocument,
    "\n  query TrackListHome($take: Int!) {\n    tracks(take: $take) {\n      totalCount\n      items {\n        id\n        name\n        coverImage\n        mainArtistIds\n        artist {\n          id\n          stageName\n        }\n      }\n    }\n  }\n": types.TrackListHomeDocument,
    "\n  mutation createPlaylist($createPlaylistRequest: CreatePlaylistRequestInput!) {\n    createPlaylist(createPlaylistRequest: $createPlaylistRequest)\n  }\n": types.CreatePlaylistDocument,
    "\n  mutation deletePlaylist($playlistId: String!) {\n    deletePlaylist(playlistId: $playlistId)\n  }\n": types.DeletePlaylistDocument,
    "\n  query Playlists {\n    playlists {\n      items {\n        id\n        name\n        coverImage\n        isPublic\n      }\n      totalCount\n    }\n  }\n": types.PlaylistsDocument,
    "\n  mutation AddToPlaylist($addToPlaylistRequest: AddToPlaylistRequestInput!) {\n    addToPlaylist(addToPlaylistRequest: $addToPlaylistRequest)\n  }\n": types.AddToPlaylistDocument,
    "\n  mutation RemoveFromPlaylist(\n    $addToPlaylistRequest: AddToPlaylistRequestInput!\n  ) {\n    removeFromPlaylist(addToPlaylistRequest: $addToPlaylistRequest)\n  }\n": types.RemoveFromPlaylistDocument,
    "\n  query PlaylistBrief {\n    playlists {\n      items {\n        id\n        name\n        coverImage\n        isPublic\n      }\n    }\n  }\n": types.PlaylistBriefDocument,
    "\n  query CheckTrackInPlaylist($trackId: String!) {\n    playlists(where: { tracksInfo: { some: { trackId: { eq: $trackId } } } }) {\n      items {\n        id\n      }\n    }\n  }\n": types.CheckTrackInPlaylistDocument,
    "\n  query PlaylistDetail($playlistId: String!) {\n    playlists(where: { id: { eq: $playlistId } }) {\n      items {\n        id\n        name\n        coverImage\n        description\n        isPublic\n        user {\n          id\n          fullName\n        }\n        userId\n        tracks {\n          id\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.PlaylistDetailDocument,
    "\n  query PlaylistDetailTrackList($playlistId: String!) {\n    playlists(where: { id: { eq: $playlistId } }) {\n      items {\n        id\n        tracks {\n          id\n          name\n        }\n        tracksInfo {\n          trackId\n        }\n      }\n    }\n  }\n": types.PlaylistDetailTrackListDocument,
    "\n  query TrackDetail($trackId: String!) {\n    tracks(where: { id: { eq: $trackId } }) {\n      items {\n        id\n        name\n        coverImage\n        favoriteCount\n        streamCount\n        mainArtistIds\n        artist {\n          id\n          stageName\n          followerCount\n        }\n      }\n    }\n  }\n": types.TrackDetailDocument,
    "\n  query PendingArtistRegistrationsView($pageNumber: Int!, $pageSize: Int!, $where: PendingArtistRegistrationResponseFilterInput) {\n    pendingArtistRegistrations(pageNumber: $pageNumber, pageSize: $pageSize, where: $where) {\n      email\n      fullName\n      stageName\n      artistType\n      gender\n      birthDate\n      phoneNumber\n      avatarImage\n      id\n      totalCount\n    }\n  }\n": types.PendingArtistRegistrationsViewDocument,
    "\n  query PendingArtistRegistrationsDetail($id: String) {\n    pendingArtistRegistrations(where: { id: { eq: $id } }) {\n      email\n      fullName\n      stageName\n      artistType\n      gender\n      birthDate\n      phoneNumber\n      avatarImage\n      id\n      members {\n        fullName\n        email\n        phoneNumber\n        isLeader\n        gender\n      }\n      requestedAt\n      timeToLive\n      identityCardNumber\n      identityCardDateOfBirth\n      identityCardFullName\n      placeOfOrigin\n      placeOfResidence\n      frontImageUrl\n      backImageUrl\n    }\n  }\n": types.PendingArtistRegistrationsDetailDocument,
    "\n  mutation ApproveArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {\n    approveArtistRegistration(request: $request)\n  }\n": types.ApproveArtistRegistrationDocument,
    "\n  mutation RejectArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {\n    rejectArtistRegistration(request: $request)\n  }\n": types.RejectArtistRegistrationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Users($where: UserFilterInput) {\n    users(where: $where) {\n      items {\n        id\n        email\n        fullName\n        gender\n        birthDate\n        role\n        phoneNumber\n        status\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): typeof import('./graphql').UsersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UsersList($skip: Int, $take: Int, $where: UserFilterInput) {\n    users(skip: $skip, take: $take, where: $where) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        id\n        email\n        fullName\n        gender\n        birthDate\n        role\n        phoneNumber\n        status\n        isLinkedWithGoogle\n        stripeCustomerId\n        stripeAccountId\n        lastLoginAt\n        createdAt\n        updatedAt\n      }\n    }\n    artists {\n      items {\n        id\n        userId\n        stageName\n        email\n        artistType\n        categoryIds\n        biography\n        followerCount\n        popularity\n        avatarImage\n        bannerImage\n        isVerified\n        verifiedAt\n        createdAt\n        updatedAt\n        members {\n          fullName\n          email\n          phoneNumber\n          isLeader\n          gender\n        }\n        identityCard {\n          number\n          fullName\n          dateOfBirth\n          gender\n          placeOfOrigin\n          nationality\n          validUntil\n          placeOfResidence {\n            street\n            ward\n            province\n            oldDistrict\n            oldWard\n            oldProvince\n            addressLine\n          }\n        }\n      }\n    }\n    listeners {\n      items {\n        id\n        userId\n        displayName\n        email\n        avatarImage\n        bannerImage\n        isVerified\n        verifiedAt\n        followerCount\n        followingCount\n        lastFollowers\n        lastFollowing\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): typeof import('./graphql').UsersListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateModerator(\n    $createModeratorRequest: CreateModeratorRequestInput!\n  ) {\n    createModerator(createModeratorRequest: $createModeratorRequest)\n  }\n"): typeof import('./graphql').CreateModeratorDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation banUser($targetUserId: String!) {\n    banUser(targetUserId: $targetUserId)\n  }\n"): typeof import('./graphql').BanUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReActiveUser($targetUserId: String!) {\n    reActiveUser(targetUserId: $targetUserId)\n  }\n"): typeof import('./graphql').ReActiveUserDocument;
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
export function graphql(source: "\n  mutation createPlaylist($createPlaylistRequest: CreatePlaylistRequestInput!) {\n    createPlaylist(createPlaylistRequest: $createPlaylistRequest)\n  }\n"): typeof import('./graphql').CreatePlaylistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deletePlaylist($playlistId: String!) {\n    deletePlaylist(playlistId: $playlistId)\n  }\n"): typeof import('./graphql').DeletePlaylistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Playlists {\n    playlists {\n      items {\n        id\n        name\n        coverImage\n        isPublic\n      }\n      totalCount\n    }\n  }\n"): typeof import('./graphql').PlaylistsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddToPlaylist($addToPlaylistRequest: AddToPlaylistRequestInput!) {\n    addToPlaylist(addToPlaylistRequest: $addToPlaylistRequest)\n  }\n"): typeof import('./graphql').AddToPlaylistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveFromPlaylist(\n    $addToPlaylistRequest: AddToPlaylistRequestInput!\n  ) {\n    removeFromPlaylist(addToPlaylistRequest: $addToPlaylistRequest)\n  }\n"): typeof import('./graphql').RemoveFromPlaylistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PlaylistBrief {\n    playlists {\n      items {\n        id\n        name\n        coverImage\n        isPublic\n      }\n    }\n  }\n"): typeof import('./graphql').PlaylistBriefDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CheckTrackInPlaylist($trackId: String!) {\n    playlists(where: { tracksInfo: { some: { trackId: { eq: $trackId } } } }) {\n      items {\n        id\n      }\n    }\n  }\n"): typeof import('./graphql').CheckTrackInPlaylistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PlaylistDetail($playlistId: String!) {\n    playlists(where: { id: { eq: $playlistId } }) {\n      items {\n        id\n        name\n        coverImage\n        description\n        isPublic\n        user {\n          id\n          fullName\n        }\n        userId\n        tracks {\n          id\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): typeof import('./graphql').PlaylistDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PlaylistDetailTrackList($playlistId: String!) {\n    playlists(where: { id: { eq: $playlistId } }) {\n      items {\n        id\n        tracks {\n          id\n          name\n        }\n        tracksInfo {\n          trackId\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').PlaylistDetailTrackListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TrackDetail($trackId: String!) {\n    tracks(where: { id: { eq: $trackId } }) {\n      items {\n        id\n        name\n        coverImage\n        favoriteCount\n        streamCount\n        mainArtistIds\n        artist {\n          id\n          stageName\n          followerCount\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').TrackDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PendingArtistRegistrationsView($pageNumber: Int!, $pageSize: Int!, $where: PendingArtistRegistrationResponseFilterInput) {\n    pendingArtistRegistrations(pageNumber: $pageNumber, pageSize: $pageSize, where: $where) {\n      email\n      fullName\n      stageName\n      artistType\n      gender\n      birthDate\n      phoneNumber\n      avatarImage\n      id\n      totalCount\n    }\n  }\n"): typeof import('./graphql').PendingArtistRegistrationsViewDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PendingArtistRegistrationsDetail($id: String) {\n    pendingArtistRegistrations(where: { id: { eq: $id } }) {\n      email\n      fullName\n      stageName\n      artistType\n      gender\n      birthDate\n      phoneNumber\n      avatarImage\n      id\n      members {\n        fullName\n        email\n        phoneNumber\n        isLeader\n        gender\n      }\n      requestedAt\n      timeToLive\n      identityCardNumber\n      identityCardDateOfBirth\n      identityCardFullName\n      placeOfOrigin\n      placeOfResidence\n      frontImageUrl\n      backImageUrl\n    }\n  }\n"): typeof import('./graphql').PendingArtistRegistrationsDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ApproveArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {\n    approveArtistRegistration(request: $request)\n  }\n"): typeof import('./graphql').ApproveArtistRegistrationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RejectArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {\n    rejectArtistRegistration(request: $request)\n  }\n"): typeof import('./graphql').RejectArtistRegistrationDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
