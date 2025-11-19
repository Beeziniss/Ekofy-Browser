/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Byte` scalar type represents non-fractional whole numeric values. Byte can represent values between 0 and 255. */
  Byte: { input: any; output: any; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  /** The `Decimal` scalar type represents a decimal floating-point number. */
  Decimal: { input: any; output: any; }
  /** Polymorphic scalar for String, Int, Long, Double, Decimal, Boolean, DateTime, Object, Array. */
  EntitlementValue: { input: any; output: any; }
  JSON: { input: any; output: any; }
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: { input: any; output: any; }
  /** The `TimeSpan` scalar represents an ISO-8601 compliant duration type. */
  TimeSpan: { input: any; output: any; }
  UInt32: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type AccountLinkResponse = {
  __typename?: 'AccountLinkResponse';
  accountId: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  expired: Scalars['DateTime']['output'];
  refreshUrl: Scalars['String']['output'];
  returnUrl: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type AddToPlaylistRequestInput = {
  playlistId?: InputMaybe<Scalars['String']['input']>;
  playlistName?: InputMaybe<Scalars['String']['input']>;
  trackId: Scalars['String']['input'];
};

export type AddTrackToAlbumRequestInput = {
  albumId?: InputMaybe<Scalars['String']['input']>;
  albumName?: InputMaybe<Scalars['String']['input']>;
  trackId: Scalars['String']['input'];
};

export type Address = {
  __typename?: 'Address';
  addressLine?: Maybe<Scalars['String']['output']>;
  oldDistrict?: Maybe<Scalars['String']['output']>;
  oldProvince?: Maybe<Scalars['String']['output']>;
  oldWard?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  ward?: Maybe<Scalars['String']['output']>;
};

export type AddressFilterInput = {
  addressLine?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<AddressFilterInput>>;
  oldDistrict?: InputMaybe<StringOperationFilterInput>;
  oldProvince?: InputMaybe<StringOperationFilterInput>;
  oldWard?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AddressFilterInput>>;
  province?: InputMaybe<StringOperationFilterInput>;
  street?: InputMaybe<StringOperationFilterInput>;
  ward?: InputMaybe<StringOperationFilterInput>;
};

export type AddressInput = {
  addressLine?: InputMaybe<Scalars['String']['input']>;
  oldDistrict?: InputMaybe<Scalars['String']['input']>;
  oldProvince?: InputMaybe<Scalars['String']['input']>;
  oldWard?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type AddressSortInput = {
  addressLine?: InputMaybe<SortEnumType>;
  oldDistrict?: InputMaybe<SortEnumType>;
  oldProvince?: InputMaybe<SortEnumType>;
  oldWard?: InputMaybe<SortEnumType>;
  province?: InputMaybe<SortEnumType>;
  street?: InputMaybe<SortEnumType>;
  ward?: InputMaybe<SortEnumType>;
};

export enum AggregationLevel {
  Full = 'FULL',
  None = 'NONE',
  Recording = 'RECORDING',
  Work = 'WORK'
}

export type AggregationLevelOperationFilterInput = {
  eq?: InputMaybe<AggregationLevel>;
  in?: InputMaybe<Array<AggregationLevel>>;
  neq?: InputMaybe<AggregationLevel>;
  nin?: InputMaybe<Array<AggregationLevel>>;
};

export type Album = {
  __typename?: 'Album';
  artists: Array<Artist>;
  checkAlbumInFavorite: Scalars['Boolean']['output'];
  contributingArtists: Array<ContributingArtist>;
  coverImage: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isVisible: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nameUnsigned: Scalars['String']['output'];
  releaseInfo: ReleaseInfo;
  thumbnailImage?: Maybe<Scalars['String']['output']>;
  trackIds: Array<Scalars['String']['output']>;
  tracks?: Maybe<TracksCollectionSegment>;
  type: AlbumType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type AlbumArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type AlbumTracksArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackFilterInput>;
};

export type AlbumFilterInput = {
  and?: InputMaybe<Array<AlbumFilterInput>>;
  contributingArtists?: InputMaybe<ListFilterInputTypeOfContributingArtistFilterInput>;
  coverImage?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isVisible?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  nameUnsigned?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AlbumFilterInput>>;
  releaseInfo?: InputMaybe<ReleaseInfoFilterInput>;
  thumbnailImage?: InputMaybe<StringOperationFilterInput>;
  trackIds?: InputMaybe<ListStringOperationFilterInput>;
  type?: InputMaybe<AlbumTypeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type AlbumSortInput = {
  coverImage?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isVisible?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  nameUnsigned?: InputMaybe<SortEnumType>;
  releaseInfo?: InputMaybe<ReleaseInfoSortInput>;
  thumbnailImage?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum AlbumType {
  Album = 'ALBUM',
  Compilation = 'COMPILATION',
  Ep = 'EP',
  Live = 'LIVE',
  Remix = 'REMIX',
  Single = 'SINGLE',
  Soundtrack = 'SOUNDTRACK'
}

export type AlbumTypeOperationFilterInput = {
  eq?: InputMaybe<AlbumType>;
  in?: InputMaybe<Array<AlbumType>>;
  neq?: InputMaybe<AlbumType>;
  nin?: InputMaybe<Array<AlbumType>>;
};

/** A segment of a collection. */
export type AlbumsCollectionSegment = {
  __typename?: 'AlbumsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Album>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

/** A segment of a collection. */
export type ApprovalHistoriesCollectionSegment = {
  __typename?: 'ApprovalHistoriesCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<ApprovalHistory>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type ApprovalHistory = {
  __typename?: 'ApprovalHistory';
  action: HistoryActionType;
  actionAt: Scalars['DateTime']['output'];
  approvalType: ApprovalType;
  approvedBy: Array<User>;
  approvedByUserId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  snapshot: Scalars['JSON']['output'];
  targetId: Scalars['String']['output'];
  targetOwnerId?: Maybe<Scalars['String']['output']>;
  track: Array<Track>;
  user: Array<User>;
};


export type ApprovalHistoryApprovedByArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};


export type ApprovalHistoryTrackArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  where?: InputMaybe<TrackFilterInput>;
};


export type ApprovalHistoryUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type ApprovalHistoryFilterInput = {
  action?: InputMaybe<HistoryActionTypeOperationFilterInput>;
  actionAt?: InputMaybe<DateTimeOperationFilterInput>;
  and?: InputMaybe<Array<ApprovalHistoryFilterInput>>;
  approvalType?: InputMaybe<ApprovalTypeOperationFilterInput>;
  approvedByUserId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ApprovalHistoryFilterInput>>;
  snapshot?: InputMaybe<StringOperationFilterInput>;
  targetId?: InputMaybe<StringOperationFilterInput>;
  targetOwnerId?: InputMaybe<StringOperationFilterInput>;
};

export type ApprovalHistorySortInput = {
  action?: InputMaybe<SortEnumType>;
  actionAt?: InputMaybe<SortEnumType>;
  approvalType?: InputMaybe<SortEnumType>;
  approvedByUserId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  snapshot?: InputMaybe<SortEnumType>;
  targetId?: InputMaybe<SortEnumType>;
  targetOwnerId?: InputMaybe<SortEnumType>;
};

export enum ApprovalType {
  ArtistRegistration = 'ARTIST_REGISTRATION',
  RecordingUpload = 'RECORDING_UPLOAD',
  TrackUpload = 'TRACK_UPLOAD',
  WorkUpload = 'WORK_UPLOAD'
}

export type ApprovalTypeOperationFilterInput = {
  eq?: InputMaybe<ApprovalType>;
  in?: InputMaybe<Array<ApprovalType>>;
  neq?: InputMaybe<ApprovalType>;
  nin?: InputMaybe<Array<ApprovalType>>;
};

export type Artist = {
  __typename?: 'Artist';
  artistType: ArtistType;
  avatarImage?: Maybe<Scalars['String']['output']>;
  bannerImage?: Maybe<Scalars['String']['output']>;
  biography?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<CategoriesCollectionSegment>;
  categoryIds: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  followerCount: Scalars['Long']['output'];
  grossRevenue: Scalars['Decimal']['output'];
  id: Scalars['String']['output'];
  identityCard: IdentityCard;
  isVerified: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  legalDocuments: Array<LegalDocument>;
  members: Array<ArtistMember>;
  netEarnings: Scalars['Decimal']['output'];
  popularity: Scalars['Long']['output'];
  refundAmount: Scalars['Decimal']['output'];
  royaltyEarnings: Scalars['Decimal']['output'];
  serviceRevenue: Scalars['Decimal']['output'];
  stageName: Scalars['String']['output'];
  stageNameUnsigned: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: Array<User>;
  userId: Scalars['String']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ArtistCategoriesArgs = {
  order?: InputMaybe<Array<CategorySortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CategoryFilterInput>;
};


export type ArtistUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type ArtistFilterInput = {
  and?: InputMaybe<Array<ArtistFilterInput>>;
  artistType?: InputMaybe<ArtistTypeOperationFilterInput>;
  avatarImage?: InputMaybe<StringOperationFilterInput>;
  bannerImage?: InputMaybe<StringOperationFilterInput>;
  biography?: InputMaybe<StringOperationFilterInput>;
  categoryIds?: InputMaybe<ListStringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  followerCount?: InputMaybe<LongOperationFilterInput>;
  grossRevenue?: InputMaybe<DecimalOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  identityCard?: InputMaybe<IdentityCardFilterInput>;
  isVerified?: InputMaybe<BooleanOperationFilterInput>;
  isVisible?: InputMaybe<BooleanOperationFilterInput>;
  legalDocuments?: InputMaybe<ListFilterInputTypeOfLegalDocumentFilterInput>;
  members?: InputMaybe<ListFilterInputTypeOfArtistMemberFilterInput>;
  or?: InputMaybe<Array<ArtistFilterInput>>;
  popularity?: InputMaybe<LongOperationFilterInput>;
  refundAmount?: InputMaybe<DecimalOperationFilterInput>;
  royaltyEarnings?: InputMaybe<DecimalOperationFilterInput>;
  serviceRevenue?: InputMaybe<DecimalOperationFilterInput>;
  stageName?: InputMaybe<StringOperationFilterInput>;
  stageNameUnsigned?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  verifiedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ArtistInfo = {
  __typename?: 'ArtistInfo';
  avatarImage?: Maybe<Scalars['String']['output']>;
  followerCount: Scalars['Long']['output'];
  id: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  popularity: Scalars['Long']['output'];
  stageName: Scalars['String']['output'];
};

export type ArtistMember = {
  __typename?: 'ArtistMember';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  gender: UserGender;
  isLeader: Scalars['Boolean']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type ArtistMemberFilterInput = {
  and?: InputMaybe<Array<ArtistMemberFilterInput>>;
  email?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<UserGenderOperationFilterInput>;
  isLeader?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ArtistMemberFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
};

export type ArtistPackage = {
  __typename?: 'ArtistPackage';
  amount: Scalars['Decimal']['output'];
  artist: Array<Artist>;
  artistId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: CurrencyType;
  description?: Maybe<Scalars['String']['output']>;
  estimateDeliveryDays: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isDelete: Scalars['Boolean']['output'];
  maxRevision: Scalars['Int']['output'];
  packageName: Scalars['String']['output'];
  review: ReviewResponse;
  serviceDetails: Array<Metadata>;
  status: ArtistPackageStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ArtistPackageArtistArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  where?: InputMaybe<ArtistFilterInput>;
};

export type ArtistPackageFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<ArtistPackageFilterInput>>;
  artistId?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  estimateDeliveryDays?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isDelete?: InputMaybe<BooleanOperationFilterInput>;
  maxRevision?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<ArtistPackageFilterInput>>;
  packageName?: InputMaybe<StringOperationFilterInput>;
  serviceDetails?: InputMaybe<ListFilterInputTypeOfMetadataFilterInput>;
  status?: InputMaybe<ArtistPackageStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ArtistPackageSortInput = {
  amount?: InputMaybe<SortEnumType>;
  artistId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  estimateDeliveryDays?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isDelete?: InputMaybe<SortEnumType>;
  maxRevision?: InputMaybe<SortEnumType>;
  packageName?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum ArtistPackageStatus {
  Disabled = 'DISABLED',
  Enabled = 'ENABLED'
}

export type ArtistPackageStatusOperationFilterInput = {
  eq?: InputMaybe<ArtistPackageStatus>;
  in?: InputMaybe<Array<ArtistPackageStatus>>;
  neq?: InputMaybe<ArtistPackageStatus>;
  nin?: InputMaybe<Array<ArtistPackageStatus>>;
};

/** A segment of a collection. */
export type ArtistPackagesCollectionSegment = {
  __typename?: 'ArtistPackagesCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<ArtistPackage>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type ArtistPackagesInConversationCollectionSegment = {
  __typename?: 'ArtistPackagesInConversationCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<ArtistPackage>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArtistRegistrationApprovalRequestInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type ArtistRevenueResponse = {
  __typename?: 'ArtistRevenueResponse';
  grossRevenue: Scalars['Decimal']['output'];
  refundAmount: Scalars['Decimal']['output'];
  royaltyEarnings: Scalars['Decimal']['output'];
  serviceRevenue: Scalars['Decimal']['output'];
};

export enum ArtistRole {
  Composer = 'COMPOSER',
  Featured = 'FEATURED',
  Main = 'MAIN',
  Remixer = 'REMIXER'
}

export type ArtistRoleOperationFilterInput = {
  eq?: InputMaybe<ArtistRole>;
  in?: InputMaybe<Array<ArtistRole>>;
  neq?: InputMaybe<ArtistRole>;
  nin?: InputMaybe<Array<ArtistRole>>;
};

export type ArtistSortInput = {
  artistType?: InputMaybe<SortEnumType>;
  avatarImage?: InputMaybe<SortEnumType>;
  bannerImage?: InputMaybe<SortEnumType>;
  biography?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  followerCount?: InputMaybe<SortEnumType>;
  grossRevenue?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  identityCard?: InputMaybe<IdentityCardSortInput>;
  isVerified?: InputMaybe<SortEnumType>;
  isVisible?: InputMaybe<SortEnumType>;
  popularity?: InputMaybe<SortEnumType>;
  refundAmount?: InputMaybe<SortEnumType>;
  royaltyEarnings?: InputMaybe<SortEnumType>;
  serviceRevenue?: InputMaybe<SortEnumType>;
  stageName?: InputMaybe<SortEnumType>;
  stageNameUnsigned?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
  verifiedAt?: InputMaybe<SortEnumType>;
};

export enum ArtistType {
  Band = 'BAND',
  Group = 'GROUP',
  Individual = 'INDIVIDUAL'
}

export type ArtistTypeOperationFilterInput = {
  eq?: InputMaybe<ArtistType>;
  in?: InputMaybe<Array<ArtistType>>;
  neq?: InputMaybe<ArtistType>;
  nin?: InputMaybe<Array<ArtistType>>;
};

/** A segment of a collection. */
export type ArtistsCollectionSegment = {
  __typename?: 'ArtistsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Artist>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type AudioFeature = {
  __typename?: 'AudioFeature';
  acousticness: Scalars['Float']['output'];
  chromaMean: Array<Scalars['Float']['output']>;
  danceability: Scalars['Float']['output'];
  duration: Scalars['Float']['output'];
  energy: Scalars['Float']['output'];
  key: Scalars['String']['output'];
  keyNumber: Scalars['Int']['output'];
  mfccMean: Array<Scalars['Float']['output']>;
  mode: Scalars['String']['output'];
  modeNumber: Scalars['Int']['output'];
  spectralCentroid: Scalars['Float']['output'];
  tempo: Scalars['Float']['output'];
  zeroCrossingRate: Scalars['Float']['output'];
};

export type AudioFeatureFilterInput = {
  acousticness?: InputMaybe<FloatOperationFilterInput>;
  and?: InputMaybe<Array<AudioFeatureFilterInput>>;
  chromaMean?: InputMaybe<ListFloatOperationFilterInput>;
  danceability?: InputMaybe<FloatOperationFilterInput>;
  duration?: InputMaybe<FloatOperationFilterInput>;
  energy?: InputMaybe<FloatOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  keyNumber?: InputMaybe<IntOperationFilterInput>;
  mfccMean?: InputMaybe<ListFloatOperationFilterInput>;
  mode?: InputMaybe<StringOperationFilterInput>;
  modeNumber?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<AudioFeatureFilterInput>>;
  spectralCentroid?: InputMaybe<FloatOperationFilterInput>;
  tempo?: InputMaybe<FloatOperationFilterInput>;
  zeroCrossingRate?: InputMaybe<FloatOperationFilterInput>;
};

export type AudioFeatureSortInput = {
  acousticness?: InputMaybe<SortEnumType>;
  danceability?: InputMaybe<SortEnumType>;
  duration?: InputMaybe<SortEnumType>;
  energy?: InputMaybe<SortEnumType>;
  key?: InputMaybe<SortEnumType>;
  keyNumber?: InputMaybe<SortEnumType>;
  mode?: InputMaybe<SortEnumType>;
  modeNumber?: InputMaybe<SortEnumType>;
  spectralCentroid?: InputMaybe<SortEnumType>;
  tempo?: InputMaybe<SortEnumType>;
  zeroCrossingRate?: InputMaybe<SortEnumType>;
};

export type AudioFeatureWeightInput = {
  acousticness?: InputMaybe<Scalars['Float']['input']>;
  danceability?: InputMaybe<Scalars['Float']['input']>;
  energy?: InputMaybe<Scalars['Float']['input']>;
  tempo?: InputMaybe<Scalars['Float']['input']>;
};

export type AudioFingerprint = {
  __typename?: 'AudioFingerprint';
  compressedFingerprints: Array<Array<Scalars['Byte']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  duration: Scalars['Float']['output'];
  originalPoints: Array<Array<Scalars['Byte']['output']>>;
  sequenceNumbers: Array<Scalars['UInt32']['output']>;
  startsAt: Array<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AudioFingerprintFilterInput = {
  and?: InputMaybe<Array<AudioFingerprintFilterInput>>;
  compressedFingerprints?: InputMaybe<ListListByteOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  duration?: InputMaybe<FloatOperationFilterInput>;
  or?: InputMaybe<Array<AudioFingerprintFilterInput>>;
  originalPoints?: InputMaybe<ListListByteOperationFilterInput>;
  sequenceNumbers?: InputMaybe<ListOfUInt32FilterInput>;
  startsAt?: InputMaybe<ListFloatOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type AudioFingerprintSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  duration?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum AudioFormat {
  Mp3 = 'MP3',
  Wav = 'WAV'
}

export enum BillingPortalConfigStatus {
  Active = 'ACTIVE',
  Deprecated = 'DEPRECATED',
  Inactive = 'INACTIVE'
}

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ByteOperationFilterInput = {
  eq?: InputMaybe<Scalars['Byte']['input']>;
  gt?: InputMaybe<Scalars['Byte']['input']>;
  gte?: InputMaybe<Scalars['Byte']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Byte']['input']>>>;
  lt?: InputMaybe<Scalars['Byte']['input']>;
  lte?: InputMaybe<Scalars['Byte']['input']>;
  neq?: InputMaybe<Scalars['Byte']['input']>;
  ngt?: InputMaybe<Scalars['Byte']['input']>;
  ngte?: InputMaybe<Scalars['Byte']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Byte']['input']>>>;
  nlt?: InputMaybe<Scalars['Byte']['input']>;
  nlte?: InputMaybe<Scalars['Byte']['input']>;
};

/** A segment of a collection. */
export type CategoriesCollectionSegment = {
  __typename?: 'CategoriesCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Category>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type Category = {
  __typename?: 'Category';
  aliases: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isVisible: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  popularity: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  type: CategoryType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CategoryFilterInput = {
  aliases?: InputMaybe<ListStringOperationFilterInput>;
  and?: InputMaybe<Array<CategoryFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isVisible?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CategoryFilterInput>>;
  popularity?: InputMaybe<IntOperationFilterInput>;
  slug?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<CategoryTypeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type CategorySortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isVisible?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  popularity?: InputMaybe<SortEnumType>;
  slug?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum CategoryType {
  Genre = 'GENRE',
  Mood = 'MOOD'
}

export type CategoryTypeOperationFilterInput = {
  eq?: InputMaybe<CategoryType>;
  in?: InputMaybe<Array<CategoryType>>;
  neq?: InputMaybe<CategoryType>;
  nin?: InputMaybe<Array<CategoryType>>;
};

export type ChangeOrderStatusRequestInput = {
  id: Scalars['String']['input'];
  status: PackageOrderStatus;
};

export type ChangeStatusRequestInput = {
  requestId: Scalars['String']['input'];
  status: RequestStatus;
};

export type CheckoutSessionResponse = {
  __typename?: 'CheckoutSessionResponse';
  cancelUrl: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  expired: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  mode: Scalars['String']['output'];
  status: Scalars['String']['output'];
  successUrl: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

/** Information about the offset pagination. */
export type CollectionSegmentInfo = {
  __typename?: 'CollectionSegmentInfo';
  /** Indicates whether more items exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more items exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
};

export type CombinedUploadRequest = {
  __typename?: 'CombinedUploadRequest';
  createdBy: Scalars['String']['output'];
  featuredArtists?: Maybe<FeaturedArtistsCollectionSegment>;
  id: Scalars['String']['output'];
  mainArtists?: Maybe<MainArtistsCollectionSegment>;
  recording: RecordingTempRequest;
  recordingUsers?: Maybe<RecordingUsersCollectionSegment>;
  requestedAt: Scalars['DateTime']['output'];
  track: TrackTempRequest;
  work: WorkTempRequest;
  workUsers?: Maybe<WorkUsersCollectionSegment>;
};


export type CombinedUploadRequestFeaturedArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type CombinedUploadRequestMainArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type CombinedUploadRequestRecordingUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
};


export type CombinedUploadRequestWorkUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
};

export type Comment = {
  __typename?: 'Comment';
  artist: Array<Artist>;
  commentType: CommentType;
  commenterId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  depth: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isEdited: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  listener: Array<Listener>;
  parentCommentId?: Maybe<Scalars['String']['output']>;
  replyCount: Scalars['Long']['output'];
  rootCommentId?: Maybe<Scalars['String']['output']>;
  sortOrder: Scalars['Int']['output'];
  targetId: Scalars['String']['output'];
  threadPath: Array<Scalars['String']['output']>;
  threadUpdatedAt: Scalars['DateTime']['output'];
  totalRepliesCount: Scalars['Long']['output'];
  track: Array<Track>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: Array<User>;
};


export type CommentArtistArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type CommentListenerArgs = {
  order?: InputMaybe<Array<ListenerSortInput>>;
  where?: InputMaybe<ListenerFilterInput>;
};


export type CommentTrackArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  where?: InputMaybe<TrackFilterInput>;
};


export type CommentUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type CommentFilterInput = {
  and?: InputMaybe<Array<CommentFilterInput>>;
  commentType?: InputMaybe<CommentTypeOperationFilterInput>;
  commenterId?: InputMaybe<StringOperationFilterInput>;
  content?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  depth?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  isEdited?: InputMaybe<BooleanOperationFilterInput>;
  isVisible?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CommentFilterInput>>;
  parentCommentId?: InputMaybe<StringOperationFilterInput>;
  replyCount?: InputMaybe<LongOperationFilterInput>;
  rootCommentId?: InputMaybe<StringOperationFilterInput>;
  sortOrder?: InputMaybe<IntOperationFilterInput>;
  targetId?: InputMaybe<StringOperationFilterInput>;
  threadPath?: InputMaybe<ListStringOperationFilterInput>;
  threadUpdatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  totalRepliesCount?: InputMaybe<LongOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type CommentRepliesRequestInput = {
  commentId: Scalars['String']['input'];
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortOrder: CommentSortOrder;
};

export type CommentRepliesResponse = {
  __typename?: 'CommentRepliesResponse';
  hasNextPage: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  parentCommentId: Scalars['String']['output'];
  replies: Array<CommentResponse>;
  totalReplies: Scalars['Int']['output'];
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  commentType: CommentType;
  commenter: CommenterInfo;
  commenterId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  depth: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isEdited: Scalars['Boolean']['output'];
  parentCommentId?: Maybe<Scalars['String']['output']>;
  replyCount: Scalars['Long']['output'];
  rootCommentId?: Maybe<Scalars['String']['output']>;
  targetId: Scalars['String']['output'];
  threadPath: Array<Scalars['String']['output']>;
  threadUpdatedAt: Scalars['DateTime']['output'];
  totalRepliesCount: Scalars['Long']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CommentSortInput = {
  commentType?: InputMaybe<SortEnumType>;
  commenterId?: InputMaybe<SortEnumType>;
  content?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  depth?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isDeleted?: InputMaybe<SortEnumType>;
  isEdited?: InputMaybe<SortEnumType>;
  isVisible?: InputMaybe<SortEnumType>;
  parentCommentId?: InputMaybe<SortEnumType>;
  replyCount?: InputMaybe<SortEnumType>;
  rootCommentId?: InputMaybe<SortEnumType>;
  sortOrder?: InputMaybe<SortEnumType>;
  targetId?: InputMaybe<SortEnumType>;
  threadUpdatedAt?: InputMaybe<SortEnumType>;
  totalRepliesCount?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum CommentSortOrder {
  Chronological = 'CHRONOLOGICAL',
  PopularityBased = 'POPULARITY_BASED',
  ReverseChronological = 'REVERSE_CHRONOLOGICAL',
  ThreadActivity = 'THREAD_ACTIVITY'
}

export type CommentThread = {
  __typename?: 'CommentThread';
  hasMoreReplies: Scalars['Boolean']['output'];
  lastActivity: Scalars['DateTime']['output'];
  replies: Array<CommentResponse>;
  rootComment: CommentResponse;
  totalReplies: Scalars['Int']['output'];
};

export type CommentThreadRequestInput = {
  commentId: Scalars['String']['input'];
  includeDeleted: Scalars['Boolean']['input'];
};

export enum CommentType {
  Album = 'ALBUM',
  Playlist = 'PLAYLIST',
  Request = 'REQUEST',
  Track = 'TRACK'
}

export type CommentTypeOperationFilterInput = {
  eq?: InputMaybe<CommentType>;
  in?: InputMaybe<Array<CommentType>>;
  neq?: InputMaybe<CommentType>;
  nin?: InputMaybe<Array<CommentType>>;
};

export type CommenterInfo = {
  __typename?: 'CommenterInfo';
  artist?: Maybe<ArtistInfo>;
  avatar: Scalars['String']['output'];
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  listener?: Maybe<ListenerInfo>;
  role: UserRole;
  userId: Scalars['String']['output'];
};

export type ContributingArtist = {
  __typename?: 'ContributingArtist';
  artistId: Scalars['String']['output'];
  role: ArtistRole;
};

export type ContributingArtistFilterInput = {
  and?: InputMaybe<Array<ContributingArtistFilterInput>>;
  artistId?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ContributingArtistFilterInput>>;
  role?: InputMaybe<ArtistRoleOperationFilterInput>;
};

export type ContributingArtistInput = {
  artistId: Scalars['String']['input'];
  role: ArtistRole;
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['DateTime']['output'];
  deletedFor: Array<DeletedForEntry>;
  id: Scalars['String']['output'];
  lastMessage?: Maybe<LastMessage>;
  otherProfileConversation: ConversationResponse;
  ownerProfileConversation: ConversationResponse;
  requestHubId?: Maybe<Scalars['String']['output']>;
  status: ConversationStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userIds: Array<Scalars['String']['output']>;
};

export type ConversationFilterInput = {
  and?: InputMaybe<Array<ConversationFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  deletedFor?: InputMaybe<ListFilterInputTypeOfDeletedForEntryFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  lastMessage?: InputMaybe<LastMessageFilterInput>;
  or?: InputMaybe<Array<ConversationFilterInput>>;
  requestHubId?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<ConversationStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userIds?: InputMaybe<ListStringOperationFilterInput>;
};

export type ConversationResponse = {
  __typename?: 'ConversationResponse';
  avatar: Scalars['String']['output'];
  nickname: Scalars['String']['output'];
};

export type ConversationSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  lastMessage?: InputMaybe<LastMessageSortInput>;
  requestHubId?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum ConversationStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  None = 'NONE',
  Pending = 'PENDING'
}

export type ConversationStatusOperationFilterInput = {
  eq?: InputMaybe<ConversationStatus>;
  in?: InputMaybe<Array<ConversationStatus>>;
  neq?: InputMaybe<ConversationStatus>;
  nin?: InputMaybe<Array<ConversationStatus>>;
};

/** A segment of a collection. */
export type ConversationsByUserIdCollectionSegment = {
  __typename?: 'ConversationsByUserIdCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Conversation>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type ConversationsCollectionSegment = {
  __typename?: 'ConversationsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Conversation>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type Coupon = {
  __typename?: 'Coupon';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration: CouponDurationType;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  percentOff: Scalars['Decimal']['output'];
  purpose: CouponPurposeType;
  status: CouponStatus;
  stripeCouponId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum CouponDurationType {
  Forever = 'FOREVER',
  Once = 'ONCE',
  Repeating = 'REPEATING'
}

export type CouponDurationTypeOperationFilterInput = {
  eq?: InputMaybe<CouponDurationType>;
  in?: InputMaybe<Array<CouponDurationType>>;
  neq?: InputMaybe<CouponDurationType>;
  nin?: InputMaybe<Array<CouponDurationType>>;
};

export type CouponFilterInput = {
  and?: InputMaybe<Array<CouponFilterInput>>;
  code?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  duration?: InputMaybe<CouponDurationTypeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CouponFilterInput>>;
  percentOff?: InputMaybe<DecimalOperationFilterInput>;
  purpose?: InputMaybe<CouponPurposeTypeOperationFilterInput>;
  status?: InputMaybe<CouponStatusOperationFilterInput>;
  stripeCouponId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export enum CouponPurposeType {
  AnnualPlanDiscount = 'ANNUAL_PLAN_DISCOUNT',
  AutoService = 'AUTO_SERVICE',
  General = 'GENERAL'
}

export type CouponPurposeTypeOperationFilterInput = {
  eq?: InputMaybe<CouponPurposeType>;
  in?: InputMaybe<Array<CouponPurposeType>>;
  neq?: InputMaybe<CouponPurposeType>;
  nin?: InputMaybe<Array<CouponPurposeType>>;
};

export type CouponSortInput = {
  code?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  duration?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  percentOff?: InputMaybe<SortEnumType>;
  purpose?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  stripeCouponId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum CouponStatus {
  Active = 'ACTIVE',
  Deprecated = 'DEPRECATED',
  Expired = 'EXPIRED',
  Inactive = 'INACTIVE'
}

export type CouponStatusOperationFilterInput = {
  eq?: InputMaybe<CouponStatus>;
  in?: InputMaybe<Array<CouponStatus>>;
  neq?: InputMaybe<CouponStatus>;
  nin?: InputMaybe<Array<CouponStatus>>;
};

/** A segment of a collection. */
export type CouponsCollectionSegment = {
  __typename?: 'CouponsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Coupon>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type CreateAdminRequestInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateAlbumRequestInput = {
  artistInfos: Array<ContributingArtistInput>;
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isVisible: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  releaseInfo: ReleaseInfoInput;
  thumbnailImage?: InputMaybe<Scalars['String']['input']>;
  trackIds: Array<Scalars['String']['input']>;
  type: AlbumType;
};

export type CreateArtistPackageRequestInput = {
  amount: Scalars['Decimal']['input'];
  artistId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  estimateDeliveryDays: Scalars['Int']['input'];
  maxRevision: Scalars['Int']['input'];
  packageName: Scalars['String']['input'];
  serviceDetails: Array<MetadataInput>;
};

export type CreateArtistRequestInput = {
  biography: Scalars['String']['input'];
  identityCard: IdentityCardInput;
  name: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateBillingPortalConfigurationRequestInput = {
  allowedCustomerUpdates: Array<CustomerUpdate>;
  allowedSubscriptionUpdates: Array<StripeSubscriptionUpdate>;
  customerUpdateEnabled: Scalars['Boolean']['input'];
  invoiceHistoryEnabled: Scalars['Boolean']['input'];
  mode: StripeSubscriptionCancelMode;
  paymentMethodUpdateEnabled: Scalars['Boolean']['input'];
  products: Array<StripeProductRequestInput>;
  status: BillingPortalConfigStatus;
  subscriptionCancelEnabled: Scalars['Boolean']['input'];
  subscriptionTier: SubscriptionTier;
  subscriptionVersion: Scalars['Long']['input'];
  suscriptionUpdateEnabled: Scalars['Boolean']['input'];
  userRole: UserRole;
  version: Scalars['Long']['input'];
};

export type CreateCategoryRequestInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  type: CategoryType;
};

export type CreateCommentRequestInput = {
  commentType: CommentType;
  content: Scalars['String']['input'];
  parentCommentId?: InputMaybe<Scalars['String']['input']>;
  targetId: Scalars['String']['input'];
};

export type CreateConversationRequestInput = {
  otherUserId: Scalars['String']['input'];
  requestHubId: Scalars['String']['input'];
};

export type CreateCouponRequestInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  duration: CouponDurationType;
  name: Scalars['String']['input'];
  percentOff: Scalars['Decimal']['input'];
  purpose: CouponPurposeType;
  status: CouponStatus;
};

export type CreateDirectRequestInput = {
  artistId: Scalars['String']['input'];
  deadline: Scalars['DateTime']['input'];
  packageId: Scalars['String']['input'];
  publicRequestId?: InputMaybe<Scalars['String']['input']>;
  requirements?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEntitlementRequestInput = {
  code: Scalars['String']['input'];
  defaultValues: Scalars['EntitlementValue']['input'];
  description: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  subscriptionOverrides: Array<CreateEntitlementSubscriptionOverrideRequestInput>;
  valueType: EntitlementValueType;
};

export type CreateEntitlementSubscriptionOverrideRequestInput = {
  subscriptionCode: Scalars['String']['input'];
};

export type CreateEscrowCommissionPolicyRequestInput = {
  currency: CurrencyType;
  platformFeePercentage: Scalars['Decimal']['input'];
};

export type CreateLegalPolicyRequestInput = {
  content: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type CreateModeratorRequestInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateMomoPaymentRequestInput = {
  amount: Scalars['Long']['input'];
  orderId: Scalars['String']['input'];
  orderInfo: Scalars['String']['input'];
};

export type CreatePaymentCheckoutSessionRequestInput = {
  cancelUrl: Scalars['String']['input'];
  conversationId: Scalars['String']['input'];
  deadline: Scalars['DateTime']['input'];
  deliveries: Array<PackageOrderDeliveryInput>;
  isReceiptEmail: Scalars['Boolean']['input'];
  isSavePaymentMethod: Scalars['Boolean']['input'];
  packageId: Scalars['String']['input'];
  requestHubId: Scalars['String']['input'];
  requirementFiles: Array<Scalars['String']['input']>;
  successUrl: Scalars['String']['input'];
};

export type CreatePlaylistRequestInput = {
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  isPublic: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type CreatePriceRequestInput = {
  interval: PeriodTime;
  intervalCount: Scalars['Long']['input'];
  lookupKey: Scalars['String']['input'];
};

export type CreateRecordingRequestInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  recordingSplits: Array<CreateRecordingSplitRequestInput>;
};

export type CreateRecordingSplitRequest = {
  __typename?: 'CreateRecordingSplitRequest';
  artistRole: ArtistRole;
  percentage: Scalars['Decimal']['output'];
  userId: Scalars['String']['output'];
};

export type CreateRecordingSplitRequestInput = {
  artistRole: ArtistRole;
  percentage: Scalars['Decimal']['input'];
  userId: Scalars['String']['input'];
};

export type CreateReportRequestInput = {
  description: Scalars['String']['input'];
  evidences?: InputMaybe<Array<Scalars['String']['input']>>;
  relatedContentId?: InputMaybe<Scalars['String']['input']>;
  relatedContentType?: InputMaybe<ReportRelatedContentType>;
  reportType: ReportType;
  reportedUserId: Scalars['String']['input'];
};

export type CreateReviewRequestInput = {
  content: Scalars['String']['input'];
  packageOrderId: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
};

export type CreateRoyalPolicyRequestInput = {
  currency: CurrencyType;
  ratePerStream: Scalars['Decimal']['input'];
  recordingPercentage: Scalars['Decimal']['input'];
  workPercentage: Scalars['Decimal']['input'];
};

export type CreateSubScriptionPlanRequestInput = {
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata?: InputMaybe<Array<KeyValuePairOfStringAndStringInput>>;
  name: Scalars['String']['input'];
  prices: Array<CreatePriceRequestInput>;
  subscriptionCode: Scalars['String']['input'];
};

export type CreateSubscriptionCheckoutSessionRequestInput = {
  cancelUrl: Scalars['String']['input'];
  isSavePaymentMethod: Scalars['Boolean']['input'];
  period: PeriodTime;
  subscriptionCode: Scalars['String']['input'];
  successUrl: Scalars['String']['input'];
};

export type CreateSubscriptionRequestInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Decimal']['input'];
  tier: SubscriptionTier;
};

export type CreateTrackRequestInput = {
  categoryIds: Array<Scalars['String']['input']>;
  coverImage: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  featuredArtistIds: Array<Scalars['String']['input']>;
  isExplicit: Scalars['Boolean']['input'];
  isOriginal: Scalars['Boolean']['input'];
  isRelease: Scalars['Boolean']['input'];
  legalDocuments: Array<LegalDocumentInput>;
  lyrics?: InputMaybe<Scalars['String']['input']>;
  mainArtistIds: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  previewVideo?: InputMaybe<Scalars['String']['input']>;
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  releaseStatus: ReleaseStatus;
  tags: Array<Scalars['String']['input']>;
};

export type CreateWorkRequestInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  workSplits: Array<CreateWorkSplitRequestInput>;
};

export type CreateWorkSplitRequest = {
  __typename?: 'CreateWorkSplitRequest';
  artistRole: ArtistRole;
  percentage: Scalars['Decimal']['output'];
  userId: Scalars['String']['output'];
};

export type CreateWorkSplitRequestInput = {
  artistRole: ArtistRole;
  percentage: Scalars['Decimal']['input'];
  userId: Scalars['String']['input'];
};

export enum CurrencyType {
  Aud = 'AUD',
  Cad = 'CAD',
  Chf = 'CHF',
  Cny = 'CNY',
  Eur = 'EUR',
  Gbp = 'GBP',
  Jpy = 'JPY',
  Nzd = 'NZD',
  Sek = 'SEK',
  Sgd = 'SGD',
  Sgp = 'SGP',
  Usd = 'USD',
  Vnd = 'VND'
}

export type CurrencyTypeOperationFilterInput = {
  eq?: InputMaybe<CurrencyType>;
  in?: InputMaybe<Array<CurrencyType>>;
  neq?: InputMaybe<CurrencyType>;
  nin?: InputMaybe<Array<CurrencyType>>;
};

export enum CustomerUpdate {
  Address = 'ADDRESS',
  Email = 'EMAIL',
  Phone = 'PHONE',
  Shipping = 'SHIPPING',
  TaxId = 'TAX_ID'
}

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  neq?: InputMaybe<Scalars['Decimal']['input']>;
  ngt?: InputMaybe<Scalars['Decimal']['input']>;
  ngte?: InputMaybe<Scalars['Decimal']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Decimal']['input']>>>;
  nlt?: InputMaybe<Scalars['Decimal']['input']>;
  nlte?: InputMaybe<Scalars['Decimal']['input']>;
};

export type DeleteCommentRequestInput = {
  commentId: Scalars['String']['input'];
};

export type DeletedForEntry = {
  __typename?: 'DeletedForEntry';
  isDeleted: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};

export type DeletedForEntryFilterInput = {
  and?: InputMaybe<Array<DeletedForEntryFilterInput>>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<DeletedForEntryFilterInput>>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export enum DocumentType {
  Certificate = 'CERTIFICATE',
  Contract = 'CONTRACT',
  License = 'LICENSE',
  Other = 'OTHER'
}

export type DocumentTypeOperationFilterInput = {
  eq?: InputMaybe<DocumentType>;
  in?: InputMaybe<Array<DocumentType>>;
  neq?: InputMaybe<DocumentType>;
  nin?: InputMaybe<Array<DocumentType>>;
};

export type Entitlement = {
  __typename?: 'Entitlement';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  defaultValues: Array<EntitlementRoleDefault>;
  description: Scalars['String']['output'];
  expiredAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  subscriptionOverrides: Array<EntitlementSubscriptionOverride>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  value: Scalars['EntitlementValue']['output'];
  valueType: EntitlementValueType;
};

export type EntitlementFilterInput = {
  and?: InputMaybe<Array<EntitlementFilterInput>>;
  code?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  defaultValues?: InputMaybe<ListFilterInputTypeOfEntitlementRoleDefaultFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  expiredAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<EntitlementFilterInput>>;
  subscriptionOverrides?: InputMaybe<ListFilterInputTypeOfEntitlementSubscriptionOverrideFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  valueType?: InputMaybe<EntitlementValueTypeOperationFilterInput>;
};

export type EntitlementRoleDefault = {
  __typename?: 'EntitlementRoleDefault';
  role: UserRole;
};

export type EntitlementRoleDefaultFilterInput = {
  and?: InputMaybe<Array<EntitlementRoleDefaultFilterInput>>;
  or?: InputMaybe<Array<EntitlementRoleDefaultFilterInput>>;
  role?: InputMaybe<UserRoleOperationFilterInput>;
};

export type EntitlementSortInput = {
  code?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  expiredAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  valueType?: InputMaybe<SortEnumType>;
};

export type EntitlementSubscriptionOverride = {
  __typename?: 'EntitlementSubscriptionOverride';
  subscriptionCode: Scalars['String']['output'];
};

export type EntitlementSubscriptionOverrideFilterInput = {
  and?: InputMaybe<Array<EntitlementSubscriptionOverrideFilterInput>>;
  or?: InputMaybe<Array<EntitlementSubscriptionOverrideFilterInput>>;
  subscriptionCode?: InputMaybe<StringOperationFilterInput>;
};

export enum EntitlementValueType {
  Array = 'ARRAY',
  Boolean = 'BOOLEAN',
  DateTime = 'DATE_TIME',
  Decimal = 'DECIMAL',
  Double = 'DOUBLE',
  Int = 'INT',
  Long = 'LONG',
  Object = 'OBJECT',
  String = 'STRING'
}

export type EntitlementValueTypeOperationFilterInput = {
  eq?: InputMaybe<EntitlementValueType>;
  in?: InputMaybe<Array<EntitlementValueType>>;
  neq?: InputMaybe<EntitlementValueType>;
  nin?: InputMaybe<Array<EntitlementValueType>>;
};

/** A segment of a collection. */
export type EntitlementsCollectionSegment = {
  __typename?: 'EntitlementsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Entitlement>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type EscrowCommissionPoliciesCollectionSegment = {
  __typename?: 'EscrowCommissionPoliciesCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<EscrowCommissionPolicy>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type EscrowCommissionPolicy = {
  __typename?: 'EscrowCommissionPolicy';
  createdAt: Scalars['DateTime']['output'];
  currency: CurrencyType;
  id: Scalars['String']['output'];
  platformFeePercentage: Scalars['Decimal']['output'];
  status: PolicyStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version: Scalars['Long']['output'];
};

export type EscrowCommissionPolicyFilterInput = {
  and?: InputMaybe<Array<EscrowCommissionPolicyFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<EscrowCommissionPolicyFilterInput>>;
  platformFeePercentage?: InputMaybe<DecimalOperationFilterInput>;
  status?: InputMaybe<PolicyStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  version?: InputMaybe<LongOperationFilterInput>;
};

export type EscrowCommissionPolicySortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  platformFeePercentage?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  version?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type FavoriteAlbumsCollectionSegment = {
  __typename?: 'FavoriteAlbumsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Album>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type FavoritePlaylistsCollectionSegment = {
  __typename?: 'FavoritePlaylistsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Playlist>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type FavoriteTracksCollectionSegment = {
  __typename?: 'FavoriteTracksCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Track>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type FeaturedArtistsCollectionSegment = {
  __typename?: 'FeaturedArtistsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Artist>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type FloatOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
  ngt?: InputMaybe<Scalars['Float']['input']>;
  ngte?: InputMaybe<Scalars['Float']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  nlt?: InputMaybe<Scalars['Float']['input']>;
  nlte?: InputMaybe<Scalars['Float']['input']>;
};

/** A segment of a collection. */
export type FollowersCollectionSegment = {
  __typename?: 'FollowersCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type FollowersUserCollectionSegment = {
  __typename?: 'FollowersUserCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type FollowingsCollectionSegment = {
  __typename?: 'FollowingsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type FollowingsUserCollectionSegment = {
  __typename?: 'FollowingsUserCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export enum HistoryActionType {
  Approved = 'APPROVED',
  Dismissed = 'DISMISSED',
  Rejected = 'REJECTED',
  RequestChange = 'REQUEST_CHANGE'
}

export type HistoryActionTypeOperationFilterInput = {
  eq?: InputMaybe<HistoryActionType>;
  in?: InputMaybe<Array<HistoryActionType>>;
  neq?: InputMaybe<HistoryActionType>;
  nin?: InputMaybe<Array<HistoryActionType>>;
};

export type IdentityCard = {
  __typename?: 'IdentityCard';
  backImage?: Maybe<Scalars['String']['output']>;
  dateOfBirth: Scalars['DateTime']['output'];
  frontImage?: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  gender: UserGender;
  nationality: Scalars['String']['output'];
  number: Scalars['String']['output'];
  placeOfOrigin: Scalars['String']['output'];
  placeOfResidence: Address;
  validUntil?: Maybe<Scalars['DateTime']['output']>;
};

export type IdentityCardFilterInput = {
  and?: InputMaybe<Array<IdentityCardFilterInput>>;
  backImage?: InputMaybe<StringOperationFilterInput>;
  dateOfBirth?: InputMaybe<DateTimeOperationFilterInput>;
  frontImage?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<UserGenderOperationFilterInput>;
  nationality?: InputMaybe<StringOperationFilterInput>;
  number?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<IdentityCardFilterInput>>;
  placeOfOrigin?: InputMaybe<StringOperationFilterInput>;
  placeOfResidence?: InputMaybe<AddressFilterInput>;
  validUntil?: InputMaybe<DateTimeOperationFilterInput>;
};

export type IdentityCardInput = {
  backImage?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth: Scalars['DateTime']['input'];
  frontImage?: InputMaybe<Scalars['String']['input']>;
  fullName: Scalars['String']['input'];
  gender: UserGender;
  nationality: Scalars['String']['input'];
  number: Scalars['String']['input'];
  placeOfOrigin: Scalars['String']['input'];
  placeOfResidence: AddressInput;
  validUntil?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IdentityCardSortInput = {
  backImage?: InputMaybe<SortEnumType>;
  dateOfBirth?: InputMaybe<SortEnumType>;
  frontImage?: InputMaybe<SortEnumType>;
  fullName?: InputMaybe<SortEnumType>;
  gender?: InputMaybe<SortEnumType>;
  nationality?: InputMaybe<SortEnumType>;
  number?: InputMaybe<SortEnumType>;
  placeOfOrigin?: InputMaybe<SortEnumType>;
  placeOfResidence?: InputMaybe<AddressSortInput>;
  validUntil?: InputMaybe<SortEnumType>;
};

export enum ImageTag {
  UsersProfile = 'USERS_PROFILE'
}

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type Invoice = {
  __typename?: 'Invoice';
  amount: Scalars['Decimal']['output'];
  country: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  email: Scalars['String']['output'];
  from: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  oneOffSnapshot?: Maybe<OneOffSnapshot>;
  originContext?: Maybe<Scalars['String']['output']>;
  paidAt: Scalars['DateTime']['output'];
  paymentTransactionId: Scalars['String']['output'];
  stripeInvoiceId: Scalars['String']['output'];
  subscriptionSnapshot?: Maybe<SubscriptionSnapshot>;
  to: Scalars['String']['output'];
  transaction: Array<PaymentTransaction>;
  user: Array<User>;
  userId: Scalars['String']['output'];
};


export type InvoiceTransactionArgs = {
  order?: InputMaybe<Array<PaymentTransactionSortInput>>;
  where?: InputMaybe<PaymentTransactionFilterInput>;
};


export type InvoiceUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type InvoiceFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<InvoiceFilterInput>>;
  country?: InputMaybe<StringOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  from?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  oneOffSnapshot?: InputMaybe<OneOffSnapshotFilterInput>;
  or?: InputMaybe<Array<InvoiceFilterInput>>;
  originContext?: InputMaybe<StringOperationFilterInput>;
  paidAt?: InputMaybe<DateTimeOperationFilterInput>;
  paymentTransactionId?: InputMaybe<StringOperationFilterInput>;
  stripeInvoiceId?: InputMaybe<StringOperationFilterInput>;
  subscriptionSnapshot?: InputMaybe<SubscriptionSnapshotFilterInput>;
  to?: InputMaybe<StringOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type InvoiceSortInput = {
  amount?: InputMaybe<SortEnumType>;
  country?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  from?: InputMaybe<SortEnumType>;
  fullName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  oneOffSnapshot?: InputMaybe<OneOffSnapshotSortInput>;
  originContext?: InputMaybe<SortEnumType>;
  paidAt?: InputMaybe<SortEnumType>;
  paymentTransactionId?: InputMaybe<SortEnumType>;
  stripeInvoiceId?: InputMaybe<SortEnumType>;
  subscriptionSnapshot?: InputMaybe<SubscriptionSnapshotSortInput>;
  to?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type InvoicesByUserIdCollectionSegment = {
  __typename?: 'InvoicesByUserIdCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Invoice>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type InvoicesCollectionSegment = {
  __typename?: 'InvoicesCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Invoice>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export enum KeyTag {
  Delete = 'DELETE'
}

export type KeyValuePairOfStringAndInt32 = {
  __typename?: 'KeyValuePairOfStringAndInt32';
  key: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type KeyValuePairOfStringAndStringInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type LastMessage = {
  __typename?: 'LastMessage';
  isReadBy: Array<Scalars['String']['output']>;
  senderId: Scalars['String']['output'];
  sentAt: Scalars['DateTime']['output'];
  text: Scalars['String']['output'];
};

export type LastMessageFilterInput = {
  and?: InputMaybe<Array<LastMessageFilterInput>>;
  isReadBy?: InputMaybe<ListStringOperationFilterInput>;
  or?: InputMaybe<Array<LastMessageFilterInput>>;
  senderId?: InputMaybe<StringOperationFilterInput>;
  sentAt?: InputMaybe<DateTimeOperationFilterInput>;
  text?: InputMaybe<StringOperationFilterInput>;
};

export type LastMessageSortInput = {
  senderId?: InputMaybe<SortEnumType>;
  sentAt?: InputMaybe<SortEnumType>;
  text?: InputMaybe<SortEnumType>;
};

export type LegalDocument = {
  __typename?: 'LegalDocument';
  documentType: DocumentType;
  documentUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
};

export type LegalDocumentFilterInput = {
  and?: InputMaybe<Array<LegalDocumentFilterInput>>;
  documentType?: InputMaybe<DocumentTypeOperationFilterInput>;
  documentUrl?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  note?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<LegalDocumentFilterInput>>;
};

export type LegalDocumentInput = {
  documentType: DocumentType;
  documentUrl: Scalars['String']['input'];
  name: Scalars['String']['input'];
  note: Scalars['String']['input'];
};

/** A segment of a collection. */
export type LegalPoliciesCollectionSegment = {
  __typename?: 'LegalPoliciesCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<LegalPolicy>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type LegalPolicy = {
  __typename?: 'LegalPolicy';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  effectiveAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: PolicyStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version: Scalars['Long']['output'];
};

export type LegalPolicyFilterInput = {
  and?: InputMaybe<Array<LegalPolicyFilterInput>>;
  content?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  effectiveAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<LegalPolicyFilterInput>>;
  status?: InputMaybe<PolicyStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  version?: InputMaybe<LongOperationFilterInput>;
};

export type LegalPolicySortInput = {
  content?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  effectiveAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  version?: InputMaybe<SortEnumType>;
};

export type ListByteOperationFilterInput = {
  all?: InputMaybe<ByteOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ByteOperationFilterInput>;
  some?: InputMaybe<ByteOperationFilterInput>;
};

export type ListFilterInputTypeOfArtistMemberFilterInput = {
  all?: InputMaybe<ArtistMemberFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ArtistMemberFilterInput>;
  some?: InputMaybe<ArtistMemberFilterInput>;
};

export type ListFilterInputTypeOfContributingArtistFilterInput = {
  all?: InputMaybe<ContributingArtistFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ContributingArtistFilterInput>;
  some?: InputMaybe<ContributingArtistFilterInput>;
};

export type ListFilterInputTypeOfDeletedForEntryFilterInput = {
  all?: InputMaybe<DeletedForEntryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<DeletedForEntryFilterInput>;
  some?: InputMaybe<DeletedForEntryFilterInput>;
};

export type ListFilterInputTypeOfEntitlementRoleDefaultFilterInput = {
  all?: InputMaybe<EntitlementRoleDefaultFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<EntitlementRoleDefaultFilterInput>;
  some?: InputMaybe<EntitlementRoleDefaultFilterInput>;
};

export type ListFilterInputTypeOfEntitlementSubscriptionOverrideFilterInput = {
  all?: InputMaybe<EntitlementSubscriptionOverrideFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<EntitlementSubscriptionOverrideFilterInput>;
  some?: InputMaybe<EntitlementSubscriptionOverrideFilterInput>;
};

export type ListFilterInputTypeOfLegalDocumentFilterInput = {
  all?: InputMaybe<LegalDocumentFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<LegalDocumentFilterInput>;
  some?: InputMaybe<LegalDocumentFilterInput>;
};

export type ListFilterInputTypeOfMetadataFilterInput = {
  all?: InputMaybe<MetadataFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<MetadataFilterInput>;
  some?: InputMaybe<MetadataFilterInput>;
};

export type ListFilterInputTypeOfPackageOrderDeliveryFilterInput = {
  all?: InputMaybe<PackageOrderDeliveryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PackageOrderDeliveryFilterInput>;
  some?: InputMaybe<PackageOrderDeliveryFilterInput>;
};

export type ListFilterInputTypeOfPlaylistTracksInfoFilterInput = {
  all?: InputMaybe<PlaylistTracksInfoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PlaylistTracksInfoFilterInput>;
  some?: InputMaybe<PlaylistTracksInfoFilterInput>;
};

export type ListFilterInputTypeOfRecordingSplitFilterInput = {
  all?: InputMaybe<RecordingSplitFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<RecordingSplitFilterInput>;
  some?: InputMaybe<RecordingSplitFilterInput>;
};

export type ListFilterInputTypeOfRestrictionFilterInput = {
  all?: InputMaybe<RestrictionFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<RestrictionFilterInput>;
  some?: InputMaybe<RestrictionFilterInput>;
};

export type ListFilterInputTypeOfRoyaltySplitFilterInput = {
  all?: InputMaybe<RoyaltySplitFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<RoyaltySplitFilterInput>;
  some?: InputMaybe<RoyaltySplitFilterInput>;
};

export type ListFilterInputTypeOfSubscriptionPlanPriceFilterInput = {
  all?: InputMaybe<SubscriptionPlanPriceFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<SubscriptionPlanPriceFilterInput>;
  some?: InputMaybe<SubscriptionPlanPriceFilterInput>;
};

export type ListFilterInputTypeOfSyncedLineFilterInput = {
  all?: InputMaybe<SyncedLineFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<SyncedLineFilterInput>;
  some?: InputMaybe<SyncedLineFilterInput>;
};

export type ListFilterInputTypeOfWorkSplitFilterInput = {
  all?: InputMaybe<WorkSplitFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<WorkSplitFilterInput>;
  some?: InputMaybe<WorkSplitFilterInput>;
};

export type ListFloatOperationFilterInput = {
  all?: InputMaybe<FloatOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<FloatOperationFilterInput>;
  some?: InputMaybe<FloatOperationFilterInput>;
};

export type ListListByteOperationFilterInput = {
  all?: InputMaybe<ListByteOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ListByteOperationFilterInput>;
  some?: InputMaybe<ListByteOperationFilterInput>;
};

export type ListOfUInt32FilterInput = {
  and?: InputMaybe<Array<ListOfUInt32FilterInput>>;
  capacity?: InputMaybe<IntOperationFilterInput>;
  count?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<ListOfUInt32FilterInput>>;
};

export type ListStringOperationFilterInput = {
  all?: InputMaybe<StringOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<StringOperationFilterInput>;
  some?: InputMaybe<StringOperationFilterInput>;
};

export type Listener = {
  __typename?: 'Listener';
  avatarImage?: Maybe<Scalars['String']['output']>;
  bannerImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  displayNameUnsigned: Scalars['String']['output'];
  email: Scalars['String']['output'];
  followerCount: Scalars['Long']['output'];
  followersUser?: Maybe<FollowersUserCollectionSegment>;
  followingCount: Scalars['Long']['output'];
  followingsUser?: Maybe<FollowingsUserCollectionSegment>;
  id: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  lastFollowers: Array<Scalars['String']['output']>;
  lastFollowings: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: Array<User>;
  userId: Scalars['String']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type ListenerFollowersUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
};


export type ListenerFollowingsUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
};


export type ListenerUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type ListenerFilterInput = {
  and?: InputMaybe<Array<ListenerFilterInput>>;
  avatarImage?: InputMaybe<StringOperationFilterInput>;
  bannerImage?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  displayName?: InputMaybe<StringOperationFilterInput>;
  displayNameUnsigned?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  followerCount?: InputMaybe<LongOperationFilterInput>;
  followingCount?: InputMaybe<LongOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isVerified?: InputMaybe<BooleanOperationFilterInput>;
  isVisible?: InputMaybe<BooleanOperationFilterInput>;
  lastFollowers?: InputMaybe<ListStringOperationFilterInput>;
  lastFollowings?: InputMaybe<ListStringOperationFilterInput>;
  or?: InputMaybe<Array<ListenerFilterInput>>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  verifiedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ListenerInfo = {
  __typename?: 'ListenerInfo';
  avatarImage?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  followerCount: Scalars['Long']['output'];
  id: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
};

export type ListenerSortInput = {
  avatarImage?: InputMaybe<SortEnumType>;
  bannerImage?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  displayName?: InputMaybe<SortEnumType>;
  displayNameUnsigned?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  followerCount?: InputMaybe<SortEnumType>;
  followingCount?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isVerified?: InputMaybe<SortEnumType>;
  isVisible?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
  verifiedAt?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type ListenersCollectionSegment = {
  __typename?: 'ListenersCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Listener>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type LongOperationFilterInput = {
  eq?: InputMaybe<Scalars['Long']['input']>;
  gt?: InputMaybe<Scalars['Long']['input']>;
  gte?: InputMaybe<Scalars['Long']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  lt?: InputMaybe<Scalars['Long']['input']>;
  lte?: InputMaybe<Scalars['Long']['input']>;
  neq?: InputMaybe<Scalars['Long']['input']>;
  ngt?: InputMaybe<Scalars['Long']['input']>;
  ngte?: InputMaybe<Scalars['Long']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  nlt?: InputMaybe<Scalars['Long']['input']>;
  nlte?: InputMaybe<Scalars['Long']['input']>;
};

/** A segment of a collection. */
export type MainArtistsCollectionSegment = {
  __typename?: 'MainArtistsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Artist>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type Message = {
  __typename?: 'Message';
  conversationId: Scalars['String']['output'];
  deletedForIds: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  receiverId: Scalars['String']['output'];
  receiverProfileMessages: MessageResponse;
  senderId: Scalars['String']['output'];
  senderProfileMessages: MessageResponse;
  sentAt: Scalars['DateTime']['output'];
  text: Scalars['String']['output'];
};

export type MessageFilterInput = {
  and?: InputMaybe<Array<MessageFilterInput>>;
  conversationId?: InputMaybe<StringOperationFilterInput>;
  deletedForIds?: InputMaybe<ListStringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isRead?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<MessageFilterInput>>;
  receiverId?: InputMaybe<StringOperationFilterInput>;
  senderId?: InputMaybe<StringOperationFilterInput>;
  sentAt?: InputMaybe<DateTimeOperationFilterInput>;
  text?: InputMaybe<StringOperationFilterInput>;
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  avatar: Scalars['String']['output'];
  nickname: Scalars['String']['output'];
};

export type MessageSortInput = {
  conversationId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isRead?: InputMaybe<SortEnumType>;
  receiverId?: InputMaybe<SortEnumType>;
  senderId?: InputMaybe<SortEnumType>;
  sentAt?: InputMaybe<SortEnumType>;
  text?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type MessagesConnection = {
  __typename?: 'MessagesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MessagesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Message>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MessagesEdge = {
  __typename?: 'MessagesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Message;
};

export type Metadata = {
  __typename?: 'Metadata';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type MetadataFilterInput = {
  and?: InputMaybe<Array<MetadataFilterInput>>;
  key?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MetadataFilterInput>>;
  value?: InputMaybe<StringOperationFilterInput>;
};

export type MetadataInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type MomoPaymentResponse = {
  __typename?: 'MomoPaymentResponse';
  amount?: Maybe<Scalars['Long']['output']>;
  localMessage?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['String']['output']>;
  partnerCode?: Maybe<Scalars['String']['output']>;
  payUrl?: Maybe<Scalars['String']['output']>;
  requestId?: Maybe<Scalars['String']['output']>;
  responseTime?: Maybe<Scalars['Long']['output']>;
  resultCode?: Maybe<Scalars['Int']['output']>;
};

export type MonthlyStreamCount = {
  __typename?: 'MonthlyStreamCount';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  month: Scalars['Int']['output'];
  processedAt?: Maybe<Scalars['DateTime']['output']>;
  streamCount: Scalars['Long']['output'];
  track: Array<Track>;
  trackId: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};


export type MonthlyStreamCountTrackArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  where?: InputMaybe<TrackFilterInput>;
};

export type MonthlyStreamCountFilterInput = {
  and?: InputMaybe<Array<MonthlyStreamCountFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  month?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<MonthlyStreamCountFilterInput>>;
  processedAt?: InputMaybe<DateTimeOperationFilterInput>;
  streamCount?: InputMaybe<LongOperationFilterInput>;
  trackId?: InputMaybe<StringOperationFilterInput>;
  year?: InputMaybe<IntOperationFilterInput>;
};

export type MonthlyStreamCountSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  processedAt?: InputMaybe<SortEnumType>;
  streamCount?: InputMaybe<SortEnumType>;
  trackId?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type MonthlyStreamCountsCollectionSegment = {
  __typename?: 'MonthlyStreamCountsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<MonthlyStreamCount>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export enum MoodType {
  Angry = 'ANGRY',
  Calm = 'CALM',
  Chill = 'CHILL',
  Dark = 'DARK',
  Energetic = 'ENERGETIC',
  Happy = 'HAPPY',
  Relaxed = 'RELAXED',
  Romantic = 'ROMANTIC',
  Sad = 'SAD'
}

export type MutationInitialization = {
  __typename?: 'MutationInitialization';
  activateSubscription: Scalars['Boolean']['output'];
  addConversationFromRequestHub: Scalars['String']['output'];
  addConversationGeneral: Scalars['String']['output'];
  addToFavoriteAlbum: Scalars['Boolean']['output'];
  addToFavoritePlaylist: Scalars['Boolean']['output'];
  addToFavoriteTrack: Scalars['Boolean']['output'];
  addToPlaylist: Scalars['Boolean']['output'];
  addTrackToAlbum: Scalars['Boolean']['output'];
  approveArtistRegistration: Scalars['Boolean']['output'];
  approveTrackUploadRequest: Scalars['Boolean']['output'];
  assignReportToModerator: Scalars['Boolean']['output'];
  banUser: Scalars['Boolean']['output'];
  blockPublicRequest: Scalars['Boolean']['output'];
  cancelSubscriptionAtPeriodEnd: Scalars['Boolean']['output'];
  changeArtistPackageStatus: Scalars['Boolean']['output'];
  changeRequestStatus: Scalars['Boolean']['output'];
  computeArtistRevenueByArtistId: ArtistRevenueResponse;
  computePlatformRevenue: PlatformRevenue;
  createAdmin: Scalars['Boolean']['output'];
  createAlbum: Scalars['Boolean']['output'];
  createArtistPackage: Scalars['Boolean']['output'];
  createBillingPortalConfiguration: Scalars['Boolean']['output'];
  createCategory: Scalars['Boolean']['output'];
  createComment: Scalars['Boolean']['output'];
  createCoupon: Scalars['Boolean']['output'];
  createCustomerPortalSession: Scalars['String']['output'];
  createEntitlement: Scalars['Boolean']['output'];
  createEscrowCommissionPolicy: Scalars['Boolean']['output'];
  createExpressConnectedAccount: AccountLinkResponse;
  createLegalPolicy: Scalars['Boolean']['output'];
  createModerator: Scalars['Boolean']['output'];
  createMomoPaymentQR: MomoPaymentResponse;
  createMomoPaymentVisa: MomoPaymentResponse;
  createPaymentCheckoutSession: CheckoutSessionResponse;
  createPlaylist: Scalars['Boolean']['output'];
  createPublicRequest: Scalars['Boolean']['output'];
  createReport: Scalars['Boolean']['output'];
  createRoyaltyPolicy: Scalars['Boolean']['output'];
  createSubscription: Scalars['Boolean']['output'];
  createSubscriptionCheckoutSession: CheckoutSessionResponse;
  createSubscriptionPlan: Scalars['Boolean']['output'];
  deactiveEntitlement: Scalars['Boolean']['output'];
  deleteAlbum: Scalars['Boolean']['output'];
  deleteArtistPackage: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deleteCoupon: Scalars['Boolean']['output'];
  deletePlaylist: Scalars['Boolean']['output'];
  deleteReport: Scalars['Boolean']['output'];
  deleteUserManual: Scalars['Boolean']['output'];
  deprecateCoupon: Scalars['Boolean']['output'];
  downgradeEscrowCommissionPolicyVersion: Scalars['Boolean']['output'];
  downgradeRoyaltyPolicyVersion: Scalars['Boolean']['output'];
  entitlementUserCount: Scalars['Long']['output'];
  escalateReport: Scalars['Boolean']['output'];
  followUser: Scalars['Boolean']['output'];
  initialize: Scalars['String']['output'];
  processReport: Scalars['Boolean']['output'];
  reactiveEntitlement: Scalars['Boolean']['output'];
  refund: Scalars['Boolean']['output'];
  registerArtistManual: Scalars['Boolean']['output'];
  rejectArtistRegistration: Scalars['Boolean']['output'];
  rejectTrackUploadRequest: Scalars['Boolean']['output'];
  removeFromPlaylist: Scalars['Boolean']['output'];
  removeTrackFromAlbum: Scalars['Boolean']['output'];
  restoreContent: Scalars['Boolean']['output'];
  restoreUser: Scalars['Boolean']['output'];
  resumeSubscription: Scalars['Boolean']['output'];
  seedEntitlements: Scalars['Boolean']['output'];
  seedEscrowCommissionPolicyData: Scalars['Boolean']['output'];
  seedMonthlyStreamCountByTrackId: Scalars['Boolean']['output'];
  seedRoyaltyPolicyData: Scalars['Boolean']['output'];
  sendRequest: Scalars['Boolean']['output'];
  testGenrateMonthlyRoyaltyReportsAynsc: Scalars['Boolean']['output'];
  testTransferMoneyToArtist: TransferResponse;
  unbanUser: Scalars['Boolean']['output'];
  unfollowUser: Scalars['Boolean']['output'];
  updateArtistPackage: Scalars['Boolean']['output'];
  updateArtistProfile: Scalars['Boolean']['output'];
  updateComment: Scalars['Boolean']['output'];
  updateConversationStatus: Scalars['Boolean']['output'];
  updateEscrowCommissionPolicy: Scalars['Boolean']['output'];
  updateListenerProfile: Scalars['Boolean']['output'];
  updatePlaylist: Scalars['Boolean']['output'];
  updatePublicRequest: Scalars['Boolean']['output'];
  updateReportPriority: Scalars['Boolean']['output'];
  updateRoyaltyPolicy: Scalars['Boolean']['output'];
  updateSubscriptionPlan: Scalars['Boolean']['output'];
  uploadTrack: Scalars['Boolean']['output'];
  uploadTrackFingerprint: Scalars['String']['output'];
  upsertTopTrackCount: Scalars['Boolean']['output'];
};


export type MutationInitializationActivateSubscriptionArgs = {
  subscriptionId: Scalars['String']['input'];
};


export type MutationInitializationAddConversationFromRequestHubArgs = {
  request: CreateConversationRequestInput;
};


export type MutationInitializationAddConversationGeneralArgs = {
  otherUserId: Scalars['String']['input'];
};


export type MutationInitializationAddToFavoriteAlbumArgs = {
  albumId: Scalars['String']['input'];
  isAdding: Scalars['Boolean']['input'];
};


export type MutationInitializationAddToFavoritePlaylistArgs = {
  isAdding: Scalars['Boolean']['input'];
  playlistId: Scalars['String']['input'];
};


export type MutationInitializationAddToFavoriteTrackArgs = {
  isAdding: Scalars['Boolean']['input'];
  trackId: Scalars['String']['input'];
};


export type MutationInitializationAddToPlaylistArgs = {
  addToPlaylistRequest: AddToPlaylistRequestInput;
};


export type MutationInitializationAddTrackToAlbumArgs = {
  addTrackToAlbumRequest: AddTrackToAlbumRequestInput;
};


export type MutationInitializationApproveArtistRegistrationArgs = {
  request: ArtistRegistrationApprovalRequestInput;
};


export type MutationInitializationApproveTrackUploadRequestArgs = {
  uploadId: Scalars['String']['input'];
};


export type MutationInitializationAssignReportToModeratorArgs = {
  moderatorId: Scalars['String']['input'];
  reportId: Scalars['String']['input'];
};


export type MutationInitializationBanUserArgs = {
  targetUserId: Scalars['String']['input'];
};


export type MutationInitializationBlockPublicRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type MutationInitializationChangeArtistPackageStatusArgs = {
  updateStatusRequest: UpdateStatusArtistPackageRequestInput;
};


export type MutationInitializationChangeRequestStatusArgs = {
  request: ChangeStatusRequestInput;
};


export type MutationInitializationComputeArtistRevenueByArtistIdArgs = {
  artistId: Scalars['String']['input'];
};


export type MutationInitializationCreateAdminArgs = {
  createAdminRequest: CreateAdminRequestInput;
};


export type MutationInitializationCreateAlbumArgs = {
  createAlbumRequest: CreateAlbumRequestInput;
};


export type MutationInitializationCreateArtistPackageArgs = {
  createRequest: CreateArtistPackageRequestInput;
};


export type MutationInitializationCreateBillingPortalConfigurationArgs = {
  createBillingPortalConfigurationRequest: CreateBillingPortalConfigurationRequestInput;
};


export type MutationInitializationCreateCategoryArgs = {
  categoryRequest: CreateCategoryRequestInput;
};


export type MutationInitializationCreateCommentArgs = {
  request: CreateCommentRequestInput;
};


export type MutationInitializationCreateCouponArgs = {
  createCouponRequest: CreateCouponRequestInput;
};


export type MutationInitializationCreateCustomerPortalSessionArgs = {
  returnUrl: Scalars['String']['input'];
  version: Scalars['Long']['input'];
};


export type MutationInitializationCreateEntitlementArgs = {
  createEntitlementRequest: CreateEntitlementRequestInput;
};


export type MutationInitializationCreateEscrowCommissionPolicyArgs = {
  createRequest: CreateEscrowCommissionPolicyRequestInput;
};


export type MutationInitializationCreateExpressConnectedAccountArgs = {
  refreshUrl?: Scalars['String']['input'];
  returnUrl?: Scalars['String']['input'];
};


export type MutationInitializationCreateLegalPolicyArgs = {
  createLegalPolicyRequest: CreateLegalPolicyRequestInput;
};


export type MutationInitializationCreateModeratorArgs = {
  createModeratorRequest: CreateModeratorRequestInput;
};


export type MutationInitializationCreateMomoPaymentQrArgs = {
  createMomoPaymentRequest: CreateMomoPaymentRequestInput;
};


export type MutationInitializationCreateMomoPaymentVisaArgs = {
  createMomoPaymentRequest: CreateMomoPaymentRequestInput;
};


export type MutationInitializationCreatePaymentCheckoutSessionArgs = {
  createPaymentCheckoutSessionRequest: CreatePaymentCheckoutSessionRequestInput;
};


export type MutationInitializationCreatePlaylistArgs = {
  createPlaylistRequest: CreatePlaylistRequestInput;
};


export type MutationInitializationCreatePublicRequestArgs = {
  request: RequestCreatingRequestInput;
};


export type MutationInitializationCreateReportArgs = {
  request: CreateReportRequestInput;
};


export type MutationInitializationCreateRoyaltyPolicyArgs = {
  createRoyalPolicyRequest: CreateRoyalPolicyRequestInput;
};


export type MutationInitializationCreateSubscriptionArgs = {
  createSubscriptionRequest: CreateSubscriptionRequestInput;
};


export type MutationInitializationCreateSubscriptionCheckoutSessionArgs = {
  createCheckoutSessionRequest: CreateSubscriptionCheckoutSessionRequestInput;
};


export type MutationInitializationCreateSubscriptionPlanArgs = {
  createSubScriptionPlanRequest: CreateSubScriptionPlanRequestInput;
};


export type MutationInitializationDeactiveEntitlementArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationDeleteAlbumArgs = {
  albumId: Scalars['String']['input'];
};


export type MutationInitializationDeleteArtistPackageArgs = {
  artistPackageId: Scalars['String']['input'];
};


export type MutationInitializationDeleteCommentArgs = {
  request: DeleteCommentRequestInput;
};


export type MutationInitializationDeleteCouponArgs = {
  couponIds: Array<Scalars['String']['input']>;
};


export type MutationInitializationDeletePlaylistArgs = {
  playlistId: Scalars['String']['input'];
};


export type MutationInitializationDeleteReportArgs = {
  reportId: Scalars['String']['input'];
};


export type MutationInitializationDeleteUserManualArgs = {
  userId: Scalars['String']['input'];
};


export type MutationInitializationDeprecateCouponArgs = {
  couponIds: Array<Scalars['String']['input']>;
};


export type MutationInitializationDowngradeEscrowCommissionPolicyVersionArgs = {
  version?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationInitializationDowngradeRoyaltyPolicyVersionArgs = {
  version?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationInitializationEntitlementUserCountArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationEscalateReportArgs = {
  reportId: Scalars['String']['input'];
};


export type MutationInitializationFollowUserArgs = {
  request: UserEngagementRequestInput;
};


export type MutationInitializationProcessReportArgs = {
  request: ProcessReportRequestInput;
};


export type MutationInitializationReactiveEntitlementArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationRefundArgs = {
  amount: Scalars['Decimal']['input'];
  paymentIntentId: Scalars['String']['input'];
  refundReasonType: RefundReasonType;
};


export type MutationInitializationRegisterArtistManualArgs = {
  createArtistRequest: CreateArtistRequestInput;
};


export type MutationInitializationRejectArtistRegistrationArgs = {
  request: ArtistRegistrationApprovalRequestInput;
};


export type MutationInitializationRejectTrackUploadRequestArgs = {
  reasonReject: Scalars['String']['input'];
  uploadId: Scalars['String']['input'];
};


export type MutationInitializationRemoveFromPlaylistArgs = {
  removeFromPlaylistRequest: RemoveFromPlaylistRequestInput;
};


export type MutationInitializationRemoveTrackFromAlbumArgs = {
  removeTrackFromAlbumRequest: RemoveTrackFromAlbumRequestInput;
};


export type MutationInitializationRestoreContentArgs = {
  reportId: Scalars['String']['input'];
};


export type MutationInitializationRestoreUserArgs = {
  reportId: Scalars['String']['input'];
};


export type MutationInitializationSeedEntitlementsArgs = {
  password: Scalars['String']['input'];
};


export type MutationInitializationSeedEscrowCommissionPolicyDataArgs = {
  password: Scalars['String']['input'];
};


export type MutationInitializationSeedMonthlyStreamCountByTrackIdArgs = {
  month: Scalars['Int']['input'];
  streamCount: Scalars['Long']['input'];
  trackId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type MutationInitializationSeedRoyaltyPolicyDataArgs = {
  password: Scalars['String']['input'];
};


export type MutationInitializationSendRequestArgs = {
  isDirectRequest?: Scalars['Boolean']['input'];
  request: CreateDirectRequestInput;
};


export type MutationInitializationTestGenrateMonthlyRoyaltyReportsAynscArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type MutationInitializationTestTransferMoneyToArtistArgs = {
  amount: Scalars['Decimal']['input'];
  artistAccountId: Scalars['String']['input'];
};


export type MutationInitializationUnbanUserArgs = {
  targetUserId: Scalars['String']['input'];
};


export type MutationInitializationUnfollowUserArgs = {
  request: UserEngagementRequestInput;
};


export type MutationInitializationUpdateArtistPackageArgs = {
  updateRequest: UpdateArtistPackageRequestInput;
};


export type MutationInitializationUpdateArtistProfileArgs = {
  updateArtistRequest: UpdateArtistRequestInput;
};


export type MutationInitializationUpdateCommentArgs = {
  request: UpdateTrackCommentRequestInput;
};


export type MutationInitializationUpdateConversationStatusArgs = {
  conversationId: Scalars['String']['input'];
  status: ConversationStatus;
};


export type MutationInitializationUpdateEscrowCommissionPolicyArgs = {
  updateRequest: UpdateEscrowCommissionPolicyRequestInput;
};


export type MutationInitializationUpdateListenerProfileArgs = {
  updateListenerRequest: UpdateListenerRequestInput;
};


export type MutationInitializationUpdatePlaylistArgs = {
  updatePlaylistRequest: UpdatePlaylistRequestInput;
};


export type MutationInitializationUpdatePublicRequestArgs = {
  request: RequestUpdatingRequestInput;
};


export type MutationInitializationUpdateReportPriorityArgs = {
  priority: Scalars['String']['input'];
  reportId: Scalars['String']['input'];
};


export type MutationInitializationUpdateRoyaltyPolicyArgs = {
  updateRoyalPolicyRequest: UpdateRoyalPolicyRequestInput;
};


export type MutationInitializationUpdateSubscriptionPlanArgs = {
  updateSubscriptionPlanRequest: UpdateSubscriptionPlanRequestInput;
};


export type MutationInitializationUploadTrackArgs = {
  createRecordingRequest: CreateRecordingRequestInput;
  createTrackRequest: CreateTrackRequestInput;
  createWorkRequest: CreateWorkRequestInput;
  file: Scalars['Upload']['input'];
  isTesting?: Scalars['Boolean']['input'];
};


export type MutationInitializationUploadTrackFingerprintArgs = {
  artistId: Scalars['String']['input'];
  artistName: Scalars['String']['input'];
  file: Scalars['Upload']['input'];
  trackId: Scalars['String']['input'];
  trackName: Scalars['String']['input'];
};


export type MutationInitializationUpsertTopTrackCountArgs = {
  trackId: Scalars['String']['input'];
};

export type NullableOfAggregationLevelOperationFilterInput = {
  eq?: InputMaybe<AggregationLevel>;
  in?: InputMaybe<Array<InputMaybe<AggregationLevel>>>;
  neq?: InputMaybe<AggregationLevel>;
  nin?: InputMaybe<Array<InputMaybe<AggregationLevel>>>;
};

export type NullableOfReportActionOperationFilterInput = {
  eq?: InputMaybe<ReportAction>;
  in?: InputMaybe<Array<InputMaybe<ReportAction>>>;
  neq?: InputMaybe<ReportAction>;
  nin?: InputMaybe<Array<InputMaybe<ReportAction>>>;
};

export type NullableOfReportRelatedContentTypeOperationFilterInput = {
  eq?: InputMaybe<ReportRelatedContentType>;
  in?: InputMaybe<Array<InputMaybe<ReportRelatedContentType>>>;
  neq?: InputMaybe<ReportRelatedContentType>;
  nin?: InputMaybe<Array<InputMaybe<ReportRelatedContentType>>>;
};

export type NullableOfRestrictionActionOperationFilterInput = {
  eq?: InputMaybe<RestrictionAction>;
  in?: InputMaybe<Array<InputMaybe<RestrictionAction>>>;
  neq?: InputMaybe<RestrictionAction>;
  nin?: InputMaybe<Array<InputMaybe<RestrictionAction>>>;
};

export type OneOffSnapshot = {
  __typename?: 'OneOffSnapshot';
  artistFeePercentage: Scalars['Decimal']['output'];
  artistPackageStatus: ArtistPackageStatus;
  deadline: Scalars['DateTime']['output'];
  estimateDeliveryDays: Scalars['Int']['output'];
  maxRevision: Scalars['Int']['output'];
  oneOffType: OneOffType;
  packageAmount: Scalars['Decimal']['output'];
  packageCurrency: CurrencyType;
  packageDescription?: Maybe<Scalars['String']['output']>;
  packageName: Scalars['String']['output'];
  platformFeePercentage: Scalars['Decimal']['output'];
  serviceDetails: Array<Metadata>;
};

export type OneOffSnapshotFilterInput = {
  and?: InputMaybe<Array<OneOffSnapshotFilterInput>>;
  artistFeePercentage?: InputMaybe<DecimalOperationFilterInput>;
  artistPackageStatus?: InputMaybe<ArtistPackageStatusOperationFilterInput>;
  deadline?: InputMaybe<DateTimeOperationFilterInput>;
  estimateDeliveryDays?: InputMaybe<IntOperationFilterInput>;
  maxRevision?: InputMaybe<IntOperationFilterInput>;
  oneOffType?: InputMaybe<OneOffTypeOperationFilterInput>;
  or?: InputMaybe<Array<OneOffSnapshotFilterInput>>;
  packageAmount?: InputMaybe<DecimalOperationFilterInput>;
  packageCurrency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  packageDescription?: InputMaybe<StringOperationFilterInput>;
  packageName?: InputMaybe<StringOperationFilterInput>;
  platformFeePercentage?: InputMaybe<DecimalOperationFilterInput>;
  serviceDetails?: InputMaybe<ListFilterInputTypeOfMetadataFilterInput>;
};

export type OneOffSnapshotSortInput = {
  artistFeePercentage?: InputMaybe<SortEnumType>;
  artistPackageStatus?: InputMaybe<SortEnumType>;
  deadline?: InputMaybe<SortEnumType>;
  estimateDeliveryDays?: InputMaybe<SortEnumType>;
  maxRevision?: InputMaybe<SortEnumType>;
  oneOffType?: InputMaybe<SortEnumType>;
  packageAmount?: InputMaybe<SortEnumType>;
  packageCurrency?: InputMaybe<SortEnumType>;
  packageDescription?: InputMaybe<SortEnumType>;
  packageName?: InputMaybe<SortEnumType>;
  platformFeePercentage?: InputMaybe<SortEnumType>;
};

export enum OneOffType {
  Payment = 'PAYMENT',
  Refund = 'REFUND'
}

export type OneOffTypeOperationFilterInput = {
  eq?: InputMaybe<OneOffType>;
  in?: InputMaybe<Array<OneOffType>>;
  neq?: InputMaybe<OneOffType>;
  nin?: InputMaybe<Array<OneOffType>>;
};

/** A segment of a collection. */
export type OwnPlaylistsCollectionSegment = {
  __typename?: 'OwnPlaylistsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Playlist>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type OwnRequestsCollectionSegment = {
  __typename?: 'OwnRequestsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Request>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type PackageOrder = {
  __typename?: 'PackageOrder';
  artistFeePercentage: Scalars['Decimal']['output'];
  artistPackageId: Scalars['String']['output'];
  backgroundJobId?: Maybe<Scalars['String']['output']>;
  client: Array<Listener>;
  clientId: Scalars['String']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deadline: Scalars['DateTime']['output'];
  deliveries: Array<PackageOrderDelivery>;
  id: Scalars['String']['output'];
  isEscrowReleased: Scalars['Boolean']['output'];
  package: Array<ArtistPackage>;
  paymentTransaction: Array<PaymentTransaction>;
  paymentTransactionId: Scalars['String']['output'];
  platformFeePercentage: Scalars['Decimal']['output'];
  provider: Array<Artist>;
  providerId: Scalars['String']['output'];
  review?: Maybe<Review>;
  revisionCount: Scalars['Int']['output'];
  status: PackageOrderStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type PackageOrderClientArgs = {
  order?: InputMaybe<Array<ListenerSortInput>>;
  where?: InputMaybe<ListenerFilterInput>;
};


export type PackageOrderPackageArgs = {
  order?: InputMaybe<Array<ArtistPackageSortInput>>;
  where?: InputMaybe<ArtistPackageFilterInput>;
};


export type PackageOrderPaymentTransactionArgs = {
  order?: InputMaybe<Array<PaymentTransactionSortInput>>;
  where?: InputMaybe<PaymentTransactionFilterInput>;
};


export type PackageOrderProviderArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  where?: InputMaybe<ArtistFilterInput>;
};

export type PackageOrderDelivery = {
  __typename?: 'PackageOrderDelivery';
  clientFeedback?: Maybe<Scalars['String']['output']>;
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  deliveryFileUrl: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  requestedAt?: Maybe<Scalars['DateTime']['output']>;
  revisionNumber: Scalars['Int']['output'];
};

export type PackageOrderDeliveryFilterInput = {
  and?: InputMaybe<Array<PackageOrderDeliveryFilterInput>>;
  clientFeedback?: InputMaybe<StringOperationFilterInput>;
  deliveredAt?: InputMaybe<DateTimeOperationFilterInput>;
  deliveryFileUrl?: InputMaybe<StringOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PackageOrderDeliveryFilterInput>>;
  requestedAt?: InputMaybe<DateTimeOperationFilterInput>;
  revisionNumber?: InputMaybe<IntOperationFilterInput>;
};

export type PackageOrderDeliveryInput = {
  clientFeedback?: InputMaybe<Scalars['String']['input']>;
  deliveredAt?: InputMaybe<Scalars['DateTime']['input']>;
  deliveryFileUrl: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  requestedAt?: InputMaybe<Scalars['DateTime']['input']>;
  revisionNumber: Scalars['Int']['input'];
};

export type PackageOrderFilterInput = {
  and?: InputMaybe<Array<PackageOrderFilterInput>>;
  artistFeePercentage?: InputMaybe<DecimalOperationFilterInput>;
  artistPackageId?: InputMaybe<StringOperationFilterInput>;
  backgroundJobId?: InputMaybe<StringOperationFilterInput>;
  clientId?: InputMaybe<StringOperationFilterInput>;
  completedAt?: InputMaybe<DateTimeOperationFilterInput>;
  conversationId?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  deadline?: InputMaybe<DateTimeOperationFilterInput>;
  deliveries?: InputMaybe<ListFilterInputTypeOfPackageOrderDeliveryFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isEscrowReleased?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<PackageOrderFilterInput>>;
  paymentTransactionId?: InputMaybe<StringOperationFilterInput>;
  platformFeePercentage?: InputMaybe<DecimalOperationFilterInput>;
  providerId?: InputMaybe<StringOperationFilterInput>;
  review?: InputMaybe<ReviewFilterInput>;
  revisionCount?: InputMaybe<IntOperationFilterInput>;
  status?: InputMaybe<PackageOrderStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type PackageOrderRefundRequestInput = {
  artistPercentageAmount: Scalars['Decimal']['input'];
  id: Scalars['String']['input'];
  requestorPercentageAmount: Scalars['Decimal']['input'];
};

export type PackageOrderSortInput = {
  artistFeePercentage?: InputMaybe<SortEnumType>;
  artistPackageId?: InputMaybe<SortEnumType>;
  backgroundJobId?: InputMaybe<SortEnumType>;
  clientId?: InputMaybe<SortEnumType>;
  completedAt?: InputMaybe<SortEnumType>;
  conversationId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  deadline?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isEscrowReleased?: InputMaybe<SortEnumType>;
  paymentTransactionId?: InputMaybe<SortEnumType>;
  platformFeePercentage?: InputMaybe<SortEnumType>;
  providerId?: InputMaybe<SortEnumType>;
  review?: InputMaybe<ReviewSortInput>;
  revisionCount?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum PackageOrderStatus {
  Cancelled = 'CANCELLED',
  Dispersed = 'DISPERSED',
  Disputed = 'DISPUTED',
  InProgress = 'IN_PROGRESS',
  Paid = 'PAID',
  Refund = 'REFUND'
}

export type PackageOrderStatusOperationFilterInput = {
  eq?: InputMaybe<PackageOrderStatus>;
  in?: InputMaybe<Array<PackageOrderStatus>>;
  neq?: InputMaybe<PackageOrderStatus>;
  nin?: InputMaybe<Array<PackageOrderStatus>>;
};

/** A segment of a collection. */
export type PackageOrdersCollectionSegment = {
  __typename?: 'PackageOrdersCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<PackageOrder>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedDataOfCombinedUploadRequest = {
  __typename?: 'PaginatedDataOfCombinedUploadRequest';
  items: Array<CombinedUploadRequest>;
  totalCount: Scalars['Int']['output'];
};

export type PaginatedDataOfPendingArtistRegistrationResponse = {
  __typename?: 'PaginatedDataOfPendingArtistRegistrationResponse';
  items: Array<PendingArtistRegistrationResponse>;
  totalCount: Scalars['Int']['output'];
};

export enum PathTag {
  Api = 'API',
  Base = 'BASE',
  Bin = 'BIN',
  PrivateKeys = 'PRIVATE_KEYS',
  Tools = 'TOOLS'
}

export enum PaymentMethodType {
  Card = 'CARD',
  Link = 'LINK'
}

export type PaymentTransaction = {
  __typename?: 'PaymentTransaction';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  paymentStatus: PaymentTransactionStatus;
  status: TransactionStatus;
  stripeCheckoutSessionId?: Maybe<Scalars['String']['output']>;
  stripeInvoiceId?: Maybe<Scalars['String']['output']>;
  stripePaymentId?: Maybe<Scalars['String']['output']>;
  stripePaymentMethod: Array<Scalars['String']['output']>;
  stripeSubscriptionId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: Array<User>;
  userId: Scalars['String']['output'];
};


export type PaymentTransactionUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type PaymentTransactionFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<PaymentTransactionFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PaymentTransactionFilterInput>>;
  paymentStatus?: InputMaybe<PaymentTransactionStatusOperationFilterInput>;
  status?: InputMaybe<TransactionStatusOperationFilterInput>;
  stripeCheckoutSessionId?: InputMaybe<StringOperationFilterInput>;
  stripeInvoiceId?: InputMaybe<StringOperationFilterInput>;
  stripePaymentId?: InputMaybe<StringOperationFilterInput>;
  stripePaymentMethod?: InputMaybe<ListStringOperationFilterInput>;
  stripeSubscriptionId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type PaymentTransactionSortInput = {
  amount?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  paymentStatus?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  stripeCheckoutSessionId?: InputMaybe<SortEnumType>;
  stripeInvoiceId?: InputMaybe<SortEnumType>;
  stripePaymentId?: InputMaybe<SortEnumType>;
  stripeSubscriptionId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export enum PaymentTransactionStatus {
  Paid = 'PAID',
  Pending = 'PENDING',
  Unpaid = 'UNPAID'
}

export type PaymentTransactionStatusOperationFilterInput = {
  eq?: InputMaybe<PaymentTransactionStatus>;
  in?: InputMaybe<Array<PaymentTransactionStatus>>;
  neq?: InputMaybe<PaymentTransactionStatus>;
  nin?: InputMaybe<Array<PaymentTransactionStatus>>;
};

/** A segment of a collection. */
export type PaymentTransactionsByUserIdCollectionSegment = {
  __typename?: 'PaymentTransactionsByUserIdCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<PaymentTransaction>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type PaymentTransactionsCollectionSegment = {
  __typename?: 'PaymentTransactionsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<PaymentTransaction>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type PayoutTransaction = {
  __typename?: 'PayoutTransaction';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  destinationAccountId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  level?: Maybe<AggregationLevel>;
  method?: Maybe<Scalars['String']['output']>;
  royaltyReportId?: Maybe<Scalars['String']['output']>;
  status: PayoutTransactionStatus;
  stripePayoutId: Scalars['String']['output'];
  stripeTransferId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId: Scalars['String']['output'];
};

export type PayoutTransactionFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<PayoutTransactionFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  destinationAccountId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  level?: InputMaybe<NullableOfAggregationLevelOperationFilterInput>;
  method?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PayoutTransactionFilterInput>>;
  royaltyReportId?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<PayoutTransactionStatusOperationFilterInput>;
  stripePayoutId?: InputMaybe<StringOperationFilterInput>;
  stripeTransferId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type PayoutTransactionSortInput = {
  amount?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  destinationAccountId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  level?: InputMaybe<SortEnumType>;
  method?: InputMaybe<SortEnumType>;
  royaltyReportId?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  stripePayoutId?: InputMaybe<SortEnumType>;
  stripeTransferId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export enum PayoutTransactionStatus {
  Canceled = 'CANCELED',
  Failed = 'FAILED',
  InTransit = 'IN_TRANSIT',
  Paid = 'PAID',
  Pending = 'PENDING'
}

export type PayoutTransactionStatusOperationFilterInput = {
  eq?: InputMaybe<PayoutTransactionStatus>;
  in?: InputMaybe<Array<PayoutTransactionStatus>>;
  neq?: InputMaybe<PayoutTransactionStatus>;
  nin?: InputMaybe<Array<PayoutTransactionStatus>>;
};

/** A segment of a collection. */
export type PayoutTransactionsCollectionSegment = {
  __typename?: 'PayoutTransactionsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<PayoutTransaction>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type PendingArtistRegistrationResponse = {
  __typename?: 'PendingArtistRegistrationResponse';
  artistType: ArtistType;
  avatarImage?: Maybe<Scalars['String']['output']>;
  backImageUrl?: Maybe<Scalars['String']['output']>;
  birthDate: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  frontImageUrl?: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  gender: UserGender;
  id: Scalars['String']['output'];
  identityCardDateOfBirth: Scalars['DateTime']['output'];
  identityCardFullName: Scalars['String']['output'];
  identityCardNumber: Scalars['String']['output'];
  members: Array<ArtistMember>;
  phoneNumber: Scalars['String']['output'];
  placeOfOrigin: Scalars['String']['output'];
  placeOfResidence: Scalars['String']['output'];
  requestedAt: Scalars['DateTime']['output'];
  stageName: Scalars['String']['output'];
  stageNameUnsigned: Scalars['String']['output'];
  timeToLive?: Maybe<Scalars['TimeSpan']['output']>;
};

export enum PeriodTime {
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type PeriodTimeOperationFilterInput = {
  eq?: InputMaybe<PeriodTime>;
  in?: InputMaybe<Array<PeriodTime>>;
  neq?: InputMaybe<PeriodTime>;
  nin?: InputMaybe<Array<PeriodTime>>;
};

export type PlatformRevenue = {
  __typename?: 'PlatformRevenue';
  commissionProfit: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: CurrencyType;
  grossDeductions: Scalars['Decimal']['output'];
  grossRevenue: Scalars['Decimal']['output'];
  netProfit: Scalars['Decimal']['output'];
  refundAmount: Scalars['Decimal']['output'];
  royaltyPayoutAmount: Scalars['Decimal']['output'];
  servicePayoutAmount: Scalars['Decimal']['output'];
  serviceRevenue: Scalars['Decimal']['output'];
  subscriptionRevenue: Scalars['Decimal']['output'];
  totalPayoutAmount: Scalars['Decimal']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PlatformRevenueFilterInput = {
  and?: InputMaybe<Array<PlatformRevenueFilterInput>>;
  commissionProfit?: InputMaybe<DecimalOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  grossDeductions?: InputMaybe<DecimalOperationFilterInput>;
  grossRevenue?: InputMaybe<DecimalOperationFilterInput>;
  netProfit?: InputMaybe<DecimalOperationFilterInput>;
  or?: InputMaybe<Array<PlatformRevenueFilterInput>>;
  refundAmount?: InputMaybe<DecimalOperationFilterInput>;
  royaltyPayoutAmount?: InputMaybe<DecimalOperationFilterInput>;
  servicePayoutAmount?: InputMaybe<DecimalOperationFilterInput>;
  serviceRevenue?: InputMaybe<DecimalOperationFilterInput>;
  subscriptionRevenue?: InputMaybe<DecimalOperationFilterInput>;
  totalPayoutAmount?: InputMaybe<DecimalOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type PlatformRevenueSortInput = {
  commissionProfit?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  grossDeductions?: InputMaybe<SortEnumType>;
  grossRevenue?: InputMaybe<SortEnumType>;
  netProfit?: InputMaybe<SortEnumType>;
  refundAmount?: InputMaybe<SortEnumType>;
  royaltyPayoutAmount?: InputMaybe<SortEnumType>;
  servicePayoutAmount?: InputMaybe<SortEnumType>;
  serviceRevenue?: InputMaybe<SortEnumType>;
  subscriptionRevenue?: InputMaybe<SortEnumType>;
  totalPayoutAmount?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type PlatformRevenuesCollectionSegment = {
  __typename?: 'PlatformRevenuesCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<PlatformRevenue>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type Playlist = {
  __typename?: 'Playlist';
  artist: Array<Artist>;
  checkPlaylistInFavorite: Scalars['Boolean']['output'];
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isPublic: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  listener: Array<Listener>;
  name: Scalars['String']['output'];
  nameUnsigned: Scalars['String']['output'];
  tracks?: Maybe<TracksCollectionSegment>;
  tracksInfo: Array<PlaylistTracksInfo>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: Array<User>;
  userId: Scalars['String']['output'];
};


export type PlaylistArtistArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type PlaylistListenerArgs = {
  order?: InputMaybe<Array<ListenerSortInput>>;
  where?: InputMaybe<ListenerFilterInput>;
};


export type PlaylistTracksArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackFilterInput>;
};


export type PlaylistUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type PlaylistFilterInput = {
  and?: InputMaybe<Array<PlaylistFilterInput>>;
  coverImage?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isPublic?: InputMaybe<BooleanOperationFilterInput>;
  isVisible?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  nameUnsigned?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PlaylistFilterInput>>;
  tracksInfo?: InputMaybe<ListFilterInputTypeOfPlaylistTracksInfoFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type PlaylistSortInput = {
  coverImage?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isPublic?: InputMaybe<SortEnumType>;
  isVisible?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  nameUnsigned?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type PlaylistTracksInfo = {
  __typename?: 'PlaylistTracksInfo';
  addedTime: Scalars['DateTime']['output'];
  trackId: Scalars['String']['output'];
};

export type PlaylistTracksInfoFilterInput = {
  addedTime?: InputMaybe<DateTimeOperationFilterInput>;
  and?: InputMaybe<Array<PlaylistTracksInfoFilterInput>>;
  or?: InputMaybe<Array<PlaylistTracksInfoFilterInput>>;
  trackId?: InputMaybe<StringOperationFilterInput>;
};

/** A segment of a collection. */
export type PlaylistsCollectionSegment = {
  __typename?: 'PlaylistsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Playlist>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export enum PolicyStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type PolicyStatusOperationFilterInput = {
  eq?: InputMaybe<PolicyStatus>;
  in?: InputMaybe<Array<PolicyStatus>>;
  neq?: InputMaybe<PolicyStatus>;
  nin?: InputMaybe<Array<PolicyStatus>>;
};

export enum PolicyType {
  Cookie = 'COOKIE',
  Privacy = 'PRIVACY',
  Royalty = 'ROYALTY',
  Terms = 'TERMS'
}

export type ProcessReportRequestInput = {
  actionTaken: ReportAction;
  note?: InputMaybe<Scalars['String']['input']>;
  reportId: Scalars['String']['input'];
  restrictionActionDetails: Array<RestrictionActionDetailInput>;
  status: ReportStatus;
  suspensionDays?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryAudioFingerprintResponse = {
  __typename?: 'QueryAudioFingerprintResponse';
  artistId: Scalars['String']['output'];
  artistName: Scalars['String']['output'];
  mediaType: Scalars['String']['output'];
  minConfidence: Scalars['Float']['output'];
  minCoverage: Scalars['Float']['output'];
  queryCoverage: Scalars['Float']['output'];
  queryCoverageLength: Scalars['Float']['output'];
  queryMatchEndsAt: Scalars['Float']['output'];
  queryMatchStartsAt: Scalars['Float']['output'];
  trackCoverage: Scalars['Float']['output'];
  trackCoverageLength: Scalars['Float']['output'];
  trackId: Scalars['String']['output'];
  trackMatchEndsAt: Scalars['Float']['output'];
  trackMatchStartsAt: Scalars['Float']['output'];
  trackName: Scalars['String']['output'];
};

export type QueryInitialization = {
  __typename?: 'QueryInitialization';
  albums?: Maybe<AlbumsCollectionSegment>;
  approvalHistories?: Maybe<ApprovalHistoriesCollectionSegment>;
  artistPackages?: Maybe<ArtistPackagesCollectionSegment>;
  artistPackagesInConversation?: Maybe<ArtistPackagesInConversationCollectionSegment>;
  artists?: Maybe<ArtistsCollectionSegment>;
  categories?: Maybe<CategoriesCollectionSegment>;
  checkAlbumInFavorite: Scalars['Boolean']['output'];
  commentDepth: Scalars['Int']['output'];
  commentReplies: CommentRepliesResponse;
  commentThread: Array<CommentResponse>;
  conversations?: Maybe<ConversationsCollectionSegment>;
  conversationsByUserId?: Maybe<ConversationsByUserIdCollectionSegment>;
  coupons?: Maybe<CouponsCollectionSegment>;
  entitlements?: Maybe<EntitlementsCollectionSegment>;
  escrowCommissionPolicies?: Maybe<EscrowCommissionPoliciesCollectionSegment>;
  favoriteAlbums?: Maybe<FavoriteAlbumsCollectionSegment>;
  favoritePlaylists?: Maybe<FavoritePlaylistsCollectionSegment>;
  favoriteTracks?: Maybe<FavoriteTracksCollectionSegment>;
  followers?: Maybe<FollowersCollectionSegment>;
  followings?: Maybe<FollowingsCollectionSegment>;
  initialize: Scalars['String']['output'];
  invoices?: Maybe<InvoicesCollectionSegment>;
  invoicesByUserId?: Maybe<InvoicesByUserIdCollectionSegment>;
  isCommentInThread: Scalars['Boolean']['output'];
  legalPolicies?: Maybe<LegalPoliciesCollectionSegment>;
  listeners?: Maybe<ListenersCollectionSegment>;
  messages?: Maybe<MessagesConnection>;
  metadataRecordingUploadRequest: RecordingTempRequest;
  metadataTrackUploadRequest: TrackTempRequest;
  metadataWorkUploadRequest: WorkTempRequest;
  monthlyStreamCounts?: Maybe<MonthlyStreamCountsCollectionSegment>;
  originalFileTrackUploadRequest: Scalars['String']['output'];
  ownPlaylists?: Maybe<OwnPlaylistsCollectionSegment>;
  ownRequests?: Maybe<OwnRequestsCollectionSegment>;
  packageOrders?: Maybe<PackageOrdersCollectionSegment>;
  paymentTransactions?: Maybe<PaymentTransactionsCollectionSegment>;
  paymentTransactionsByUserId?: Maybe<PaymentTransactionsByUserIdCollectionSegment>;
  payoutTransactions?: Maybe<PayoutTransactionsCollectionSegment>;
  pendingArtistRegistrationById: PendingArtistRegistrationResponse;
  pendingArtistRegistrations: PaginatedDataOfPendingArtistRegistrationResponse;
  pendingTrackUploadRequestById: CombinedUploadRequest;
  pendingTrackUploadRequests: PaginatedDataOfCombinedUploadRequest;
  platformRevenues?: Maybe<PlatformRevenuesCollectionSegment>;
  playlists?: Maybe<PlaylistsCollectionSegment>;
  queryTrack: QueryAudioFingerprintResponse;
  queryTracks: Array<QueryAudioFingerprintResponse>;
  recommendedTracksByTrackId?: Maybe<RecommendedTracksByTrackIdCollectionSegment>;
  recordings?: Maybe<RecordingsCollectionSegment>;
  refundTransactions?: Maybe<RefundTransactionsCollectionSegment>;
  reportStatistics: ReportStatisticsResponse;
  reports?: Maybe<ReportsCollectionSegment>;
  requestDetailById?: Maybe<Request>;
  requests?: Maybe<RequestsCollectionSegment>;
  royaltyPolicies?: Maybe<RoyaltyPoliciesCollectionSegment>;
  royaltyReports?: Maybe<RoyaltyReportsCollectionSegment>;
  searchAlbums?: Maybe<SearchAlbumsCollectionSegment>;
  searchArtists?: Maybe<SearchArtistsCollectionSegment>;
  searchListeners?: Maybe<SearchListenersCollectionSegment>;
  searchPlaylists?: Maybe<SearchPlaylistsCollectionSegment>;
  searchRequests?: Maybe<SearchRequestsCollectionSegment>;
  searchTracks?: Maybe<SearchTracksCollectionSegment>;
  subscriptionPlans?: Maybe<SubscriptionPlansCollectionSegment>;
  subscriptions?: Maybe<SubscriptionsCollectionSegment>;
  threadedComments: ThreadedCommentsResponse;
  topTracks: Array<TopTrackResponse>;
  trackBySemanticSearch: Array<Track>;
  tracks?: Maybe<TracksCollectionSegment>;
  userEngagement?: Maybe<UserEngagementCollectionSegment>;
  userSubscriptions?: Maybe<UserSubscriptionsCollectionSegment>;
  users?: Maybe<UsersCollectionSegment>;
  works?: Maybe<WorksCollectionSegment>;
};


export type QueryInitializationAlbumsArgs = {
  order?: InputMaybe<Array<AlbumSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AlbumFilterInput>;
};


export type QueryInitializationApprovalHistoriesArgs = {
  order?: InputMaybe<Array<ApprovalHistorySortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ApprovalHistoryFilterInput>;
};


export type QueryInitializationArtistPackagesArgs = {
  order?: InputMaybe<Array<ArtistPackageSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistPackageFilterInput>;
};


export type QueryInitializationArtistPackagesInConversationArgs = {
  artistId: Scalars['String']['input'];
  order?: InputMaybe<Array<ArtistPackageSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistPackageFilterInput>;
};


export type QueryInitializationArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type QueryInitializationCategoriesArgs = {
  order?: InputMaybe<Array<CategorySortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CategoryFilterInput>;
};


export type QueryInitializationCheckAlbumInFavoriteArgs = {
  albumId: Scalars['String']['input'];
};


export type QueryInitializationCommentDepthArgs = {
  commentId: Scalars['String']['input'];
};


export type QueryInitializationCommentRepliesArgs = {
  request: CommentRepliesRequestInput;
};


export type QueryInitializationCommentThreadArgs = {
  request: CommentThreadRequestInput;
};


export type QueryInitializationConversationsArgs = {
  order?: InputMaybe<Array<ConversationSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ConversationFilterInput>;
};


export type QueryInitializationConversationsByUserIdArgs = {
  order?: InputMaybe<Array<ConversationSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['String']['input'];
  where?: InputMaybe<ConversationFilterInput>;
};


export type QueryInitializationCouponsArgs = {
  order?: InputMaybe<Array<CouponSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CouponFilterInput>;
};


export type QueryInitializationEntitlementsArgs = {
  order?: InputMaybe<Array<EntitlementSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EntitlementFilterInput>;
};


export type QueryInitializationEscrowCommissionPoliciesArgs = {
  order?: InputMaybe<Array<EscrowCommissionPolicySortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EscrowCommissionPolicyFilterInput>;
};


export type QueryInitializationFavoriteAlbumsArgs = {
  order?: InputMaybe<Array<AlbumSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AlbumFilterInput>;
};


export type QueryInitializationFavoritePlaylistsArgs = {
  order?: InputMaybe<Array<PlaylistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlaylistFilterInput>;
};


export type QueryInitializationFavoriteTracksArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackFilterInput>;
};


export type QueryInitializationFollowersArgs = {
  artistId?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserFilterInput>;
};


export type QueryInitializationFollowingsArgs = {
  artistId?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<UserFilterInput>;
};


export type QueryInitializationInvoicesArgs = {
  order?: InputMaybe<Array<InvoiceSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<InvoiceFilterInput>;
};


export type QueryInitializationInvoicesByUserIdArgs = {
  order?: InputMaybe<Array<InvoiceSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['String']['input'];
  where?: InputMaybe<InvoiceFilterInput>;
};


export type QueryInitializationIsCommentInThreadArgs = {
  commentId: Scalars['String']['input'];
  threadRootId: Scalars['String']['input'];
};


export type QueryInitializationLegalPoliciesArgs = {
  order?: InputMaybe<Array<LegalPolicySortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LegalPolicyFilterInput>;
};


export type QueryInitializationListenersArgs = {
  order?: InputMaybe<Array<ListenerSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ListenerFilterInput>;
};


export type QueryInitializationMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MessageSortInput>>;
  where?: InputMaybe<MessageFilterInput>;
};


export type QueryInitializationMetadataRecordingUploadRequestArgs = {
  uploadId: Scalars['String']['input'];
};


export type QueryInitializationMetadataTrackUploadRequestArgs = {
  uploadId: Scalars['String']['input'];
};


export type QueryInitializationMetadataWorkUploadRequestArgs = {
  uploadId: Scalars['String']['input'];
};


export type QueryInitializationMonthlyStreamCountsArgs = {
  order?: InputMaybe<Array<MonthlyStreamCountSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MonthlyStreamCountFilterInput>;
};


export type QueryInitializationOriginalFileTrackUploadRequestArgs = {
  trackId: Scalars['String']['input'];
};


export type QueryInitializationOwnPlaylistsArgs = {
  order?: InputMaybe<Array<PlaylistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlaylistFilterInput>;
};


export type QueryInitializationOwnRequestsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RequestFilterInput>;
};


export type QueryInitializationPackageOrdersArgs = {
  order?: InputMaybe<Array<PackageOrderSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PackageOrderFilterInput>;
};


export type QueryInitializationPaymentTransactionsArgs = {
  order?: InputMaybe<Array<PaymentTransactionSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentTransactionFilterInput>;
};


export type QueryInitializationPaymentTransactionsByUserIdArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['String']['input'];
  where?: InputMaybe<PaymentTransactionFilterInput>;
};


export type QueryInitializationPayoutTransactionsArgs = {
  order?: InputMaybe<Array<PayoutTransactionSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PayoutTransactionFilterInput>;
};


export type QueryInitializationPendingArtistRegistrationByIdArgs = {
  artistRegistrationId: Scalars['String']['input'];
};


export type QueryInitializationPendingArtistRegistrationsArgs = {
  pageNumber?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};


export type QueryInitializationPendingTrackUploadRequestByIdArgs = {
  uploadId: Scalars['String']['input'];
};


export type QueryInitializationPendingTrackUploadRequestsArgs = {
  pageNumber?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};


export type QueryInitializationPlatformRevenuesArgs = {
  order?: InputMaybe<Array<PlatformRevenueSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlatformRevenueFilterInput>;
};


export type QueryInitializationPlaylistsArgs = {
  order?: InputMaybe<Array<PlaylistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlaylistFilterInput>;
};


export type QueryInitializationQueryTrackArgs = {
  file: Scalars['Upload']['input'];
};


export type QueryInitializationQueryTracksArgs = {
  file: Scalars['Upload']['input'];
};


export type QueryInitializationRecommendedTracksByTrackIdArgs = {
  algorithm: RecommendationAlgorithm;
  audioFeatureWeight: AudioFeatureWeightInput;
  limit: Scalars['Int']['input'];
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  trackId: Scalars['String']['input'];
  where?: InputMaybe<TrackFilterInput>;
};


export type QueryInitializationRecordingsArgs = {
  order?: InputMaybe<Array<RecordingSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RecordingFilterInput>;
};


export type QueryInitializationRefundTransactionsArgs = {
  order?: InputMaybe<Array<RefundTransactionSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RefundTransactionFilterInput>;
};


export type QueryInitializationReportsArgs = {
  order?: InputMaybe<Array<ReportSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ReportFilterInput>;
};


export type QueryInitializationRequestDetailByIdArgs = {
  requestId: Scalars['String']['input'];
};


export type QueryInitializationRequestsArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RequestFilterInput>;
};


export type QueryInitializationRoyaltyPoliciesArgs = {
  order?: InputMaybe<Array<RoyaltyPolicySortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoyaltyPolicyFilterInput>;
};


export type QueryInitializationRoyaltyReportsArgs = {
  order?: InputMaybe<Array<RoyaltyReportSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoyaltyReportFilterInput>;
};


export type QueryInitializationSearchAlbumsArgs = {
  name: Scalars['String']['input'];
  order?: InputMaybe<Array<AlbumSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AlbumFilterInput>;
};


export type QueryInitializationSearchArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  stageName: Scalars['String']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type QueryInitializationSearchListenersArgs = {
  displayName: Scalars['String']['input'];
  order?: InputMaybe<Array<ListenerSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ListenerFilterInput>;
};


export type QueryInitializationSearchPlaylistsArgs = {
  name: Scalars['String']['input'];
  order?: InputMaybe<Array<PlaylistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlaylistFilterInput>;
};


export type QueryInitializationSearchRequestsArgs = {
  isIndividual: Scalars['Boolean']['input'];
  order?: InputMaybe<Array<TrackSortInput>>;
  searchTerm: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RequestFilterInput>;
};


export type QueryInitializationSearchTracksArgs = {
  name: Scalars['String']['input'];
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackFilterInput>;
};


export type QueryInitializationSubscriptionPlansArgs = {
  order?: InputMaybe<Array<SubscriptionPlanSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SubscriptionPlanFilterInput>;
};


export type QueryInitializationSubscriptionsArgs = {
  order?: InputMaybe<Array<SubscriptionSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SubscriptionFilterInput>;
};


export type QueryInitializationThreadedCommentsArgs = {
  request: ThreadedCommentsRequestInput;
};


export type QueryInitializationTrackBySemanticSearchArgs = {
  term: Scalars['String']['input'];
};


export type QueryInitializationTracksArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackFilterInput>;
};


export type QueryInitializationUserEngagementArgs = {
  order?: InputMaybe<Array<UserEngagementSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserEngagementFilterInput>;
};


export type QueryInitializationUserSubscriptionsArgs = {
  order?: InputMaybe<Array<UserSubscriptionSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserSubscriptionFilterInput>;
};


export type QueryInitializationUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
};


export type QueryInitializationWorksArgs = {
  order?: InputMaybe<Array<WorkSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WorkFilterInput>;
};

export enum RecommendationAlgorithm {
  Cosine = 'COSINE',
  Euclidean = 'EUCLIDEAN'
}

/** A segment of a collection. */
export type RecommendedTracksByTrackIdCollectionSegment = {
  __typename?: 'RecommendedTracksByTrackIdCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Track>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type Recording = {
  __typename?: 'Recording';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  recordingSplits: Array<RecordingSplit>;
  status: RecordingStatus;
  track: Array<Track>;
  trackId: Scalars['String']['output'];
  users?: Maybe<UsersCollectionSegment>;
  version: Scalars['Long']['output'];
};


export type RecordingTrackArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  where?: InputMaybe<TrackFilterInput>;
};


export type RecordingUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
};

export type RecordingFilterInput = {
  and?: InputMaybe<Array<RecordingFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<RecordingFilterInput>>;
  recordingSplits?: InputMaybe<ListFilterInputTypeOfRecordingSplitFilterInput>;
  status?: InputMaybe<RecordingStatusOperationFilterInput>;
  trackId?: InputMaybe<StringOperationFilterInput>;
  version?: InputMaybe<LongOperationFilterInput>;
};

export type RecordingSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  trackId?: InputMaybe<SortEnumType>;
  version?: InputMaybe<SortEnumType>;
};

export type RecordingSplit = {
  __typename?: 'RecordingSplit';
  artistRole: ArtistRole;
  percentage: Scalars['Decimal']['output'];
  userId: Scalars['String']['output'];
};

export type RecordingSplitFilterInput = {
  and?: InputMaybe<Array<RecordingSplitFilterInput>>;
  artistRole?: InputMaybe<ArtistRoleOperationFilterInput>;
  or?: InputMaybe<Array<RecordingSplitFilterInput>>;
  percentage?: InputMaybe<DecimalOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export enum RecordingStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type RecordingStatusOperationFilterInput = {
  eq?: InputMaybe<RecordingStatus>;
  in?: InputMaybe<Array<RecordingStatus>>;
  neq?: InputMaybe<RecordingStatus>;
  nin?: InputMaybe<Array<RecordingStatus>>;
};

export type RecordingTempRequest = {
  __typename?: 'RecordingTempRequest';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  recordingSplitRequests: Array<CreateRecordingSplitRequest>;
};

/** A segment of a collection. */
export type RecordingUsersCollectionSegment = {
  __typename?: 'RecordingUsersCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type RecordingsCollectionSegment = {
  __typename?: 'RecordingsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Recording>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type RedoRequestInput = {
  clientFeedback: Scalars['String']['input'];
  packageOrderId: Scalars['String']['input'];
  revisionNumber: Scalars['Int']['input'];
};

export enum RefundReasonType {
  Duplicate = 'DUPLICATE',
  Fraudulent = 'FRAUDULENT',
  RequestedByCustomer = 'REQUESTED_BY_CUSTOMER'
}

export type RefundReasonTypeOperationFilterInput = {
  eq?: InputMaybe<RefundReasonType>;
  in?: InputMaybe<Array<RefundReasonType>>;
  neq?: InputMaybe<RefundReasonType>;
  nin?: InputMaybe<Array<RefundReasonType>>;
};

export type RefundTransaction = {
  __typename?: 'RefundTransaction';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: CurrencyType;
  id: Scalars['String']['output'];
  reason: RefundReasonType;
  status: RefundTransactionStatus;
  stripePaymentId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RefundTransactionFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<RefundTransactionFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<RefundTransactionFilterInput>>;
  reason?: InputMaybe<RefundReasonTypeOperationFilterInput>;
  status?: InputMaybe<RefundTransactionStatusOperationFilterInput>;
  stripePaymentId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type RefundTransactionSortInput = {
  amount?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  reason?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  stripePaymentId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum RefundTransactionStatus {
  Canceled = 'CANCELED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  RequiresAction = 'REQUIRES_ACTION',
  Succeeded = 'SUCCEEDED'
}

export type RefundTransactionStatusOperationFilterInput = {
  eq?: InputMaybe<RefundTransactionStatus>;
  in?: InputMaybe<Array<RefundTransactionStatus>>;
  neq?: InputMaybe<RefundTransactionStatus>;
  nin?: InputMaybe<Array<RefundTransactionStatus>>;
};

/** A segment of a collection. */
export type RefundTransactionsCollectionSegment = {
  __typename?: 'RefundTransactionsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<RefundTransaction>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type ReleaseInfo = {
  __typename?: 'ReleaseInfo';
  isRelease: Scalars['Boolean']['output'];
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  releaseStatus: ReleaseStatus;
  releasedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ReleaseInfoFilterInput = {
  and?: InputMaybe<Array<ReleaseInfoFilterInput>>;
  isRelease?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ReleaseInfoFilterInput>>;
  releaseDate?: InputMaybe<DateTimeOperationFilterInput>;
  releaseStatus?: InputMaybe<ReleaseStatusOperationFilterInput>;
  releasedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ReleaseInfoInput = {
  isRelease: Scalars['Boolean']['input'];
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  releaseStatus: ReleaseStatus;
  releasedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ReleaseInfoSortInput = {
  isRelease?: InputMaybe<SortEnumType>;
  releaseDate?: InputMaybe<SortEnumType>;
  releaseStatus?: InputMaybe<SortEnumType>;
  releasedAt?: InputMaybe<SortEnumType>;
};

export enum ReleaseStatus {
  Banned = 'BANNED',
  Canceled = 'CANCELED',
  Delayed = 'DELAYED',
  NotAnnounced = 'NOT_ANNOUNCED',
  Official = 'OFFICIAL'
}

export type ReleaseStatusOperationFilterInput = {
  eq?: InputMaybe<ReleaseStatus>;
  in?: InputMaybe<Array<ReleaseStatus>>;
  neq?: InputMaybe<ReleaseStatus>;
  nin?: InputMaybe<Array<ReleaseStatus>>;
};

export type RemoveFromPlaylistRequestInput = {
  playlistId?: InputMaybe<Scalars['String']['input']>;
  trackId: Scalars['String']['input'];
};

export type RemoveTrackFromAlbumRequestInput = {
  albumId: Scalars['String']['input'];
  trackId: Scalars['String']['input'];
};

export type Report = {
  __typename?: 'Report';
  actionTaken?: Maybe<ReportAction>;
  assignedModeratorId?: Maybe<Scalars['String']['output']>;
  backgroundJobId?: Maybe<Scalars['String']['output']>;
  comment: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  evidences: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isDeleted: Scalars['Boolean']['output'];
  nicknameReported: Scalars['String']['output'];
  nicknameReporter: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  priority: ReportPriority;
  relatedContentId?: Maybe<Scalars['String']['output']>;
  relatedContentType?: Maybe<ReportRelatedContentType>;
  reportType: ReportType;
  reportedUserId: Scalars['String']['output'];
  reporterId: Scalars['String']['output'];
  request: Array<Request>;
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  status: ReportStatus;
  totalReportsCount: Scalars['Long']['output'];
  track: Array<Track>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userAssignedTo: Array<User>;
  userReported: Array<User>;
  userReporter: Array<User>;
};


export type ReportCommentArgs = {
  order?: InputMaybe<Array<CommentSortInput>>;
  where?: InputMaybe<CommentFilterInput>;
};


export type ReportRequestArgs = {
  order?: InputMaybe<Array<RequestSortInput>>;
  where?: InputMaybe<RequestFilterInput>;
};


export type ReportTrackArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  where?: InputMaybe<TrackFilterInput>;
};


export type ReportUserAssignedToArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};


export type ReportUserReportedArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};


export type ReportUserReporterArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export enum ReportAction {
  ContentRemoval = 'CONTENT_REMOVAL',
  EntitlementRestriction = 'ENTITLEMENT_RESTRICTION',
  NoAction = 'NO_ACTION',
  PermanentBan = 'PERMANENT_BAN',
  Suspended = 'SUSPENDED',
  Warning = 'WARNING'
}

export type ReportFilterInput = {
  actionTaken?: InputMaybe<NullableOfReportActionOperationFilterInput>;
  and?: InputMaybe<Array<ReportFilterInput>>;
  assignedModeratorId?: InputMaybe<StringOperationFilterInput>;
  backgroundJobId?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  evidences?: InputMaybe<ListStringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  note?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ReportFilterInput>>;
  priority?: InputMaybe<ReportPriorityOperationFilterInput>;
  relatedContentId?: InputMaybe<StringOperationFilterInput>;
  relatedContentType?: InputMaybe<NullableOfReportRelatedContentTypeOperationFilterInput>;
  reportType?: InputMaybe<ReportTypeOperationFilterInput>;
  reportedUserId?: InputMaybe<StringOperationFilterInput>;
  reporterId?: InputMaybe<StringOperationFilterInput>;
  resolvedAt?: InputMaybe<DateTimeOperationFilterInput>;
  status?: InputMaybe<ReportStatusOperationFilterInput>;
  totalReportsCount?: InputMaybe<LongOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export enum ReportPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type ReportPriorityOperationFilterInput = {
  eq?: InputMaybe<ReportPriority>;
  in?: InputMaybe<Array<ReportPriority>>;
  neq?: InputMaybe<ReportPriority>;
  nin?: InputMaybe<Array<ReportPriority>>;
};

export enum ReportRelatedContentType {
  Artist = 'ARTIST',
  Comment = 'COMMENT',
  Listener = 'LISTENER',
  Request = 'REQUEST',
  Track = 'TRACK'
}

export type ReportSortInput = {
  actionTaken?: InputMaybe<SortEnumType>;
  assignedModeratorId?: InputMaybe<SortEnumType>;
  backgroundJobId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isDeleted?: InputMaybe<SortEnumType>;
  note?: InputMaybe<SortEnumType>;
  priority?: InputMaybe<SortEnumType>;
  relatedContentId?: InputMaybe<SortEnumType>;
  relatedContentType?: InputMaybe<SortEnumType>;
  reportType?: InputMaybe<SortEnumType>;
  reportedUserId?: InputMaybe<SortEnumType>;
  reporterId?: InputMaybe<SortEnumType>;
  resolvedAt?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  totalReportsCount?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type ReportStatisticsResponse = {
  __typename?: 'ReportStatisticsResponse';
  pendingReports: Scalars['Int']['output'];
  rejectedReports: Scalars['Int']['output'];
  reportsByPriority: Array<KeyValuePairOfStringAndInt32>;
  reportsByType: Array<KeyValuePairOfStringAndInt32>;
  resolvedReports: Scalars['Int']['output'];
  topReportedUsers: Array<TopReportedUserResponse>;
  totalReports: Scalars['Int']['output'];
  underReviewReports: Scalars['Int']['output'];
};

export enum ReportStatus {
  Approved = 'APPROVED',
  Escalated = 'ESCALATED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Restored = 'RESTORED',
  UnderReview = 'UNDER_REVIEW'
}

export type ReportStatusOperationFilterInput = {
  eq?: InputMaybe<ReportStatus>;
  in?: InputMaybe<Array<ReportStatus>>;
  neq?: InputMaybe<ReportStatus>;
  nin?: InputMaybe<Array<ReportStatus>>;
};

export enum ReportType {
  CopyrightViolation = 'COPYRIGHT_VIOLATION',
  FakeAccount = 'FAKE_ACCOUNT',
  Harassment = 'HARASSMENT',
  HateSpeech = 'HATE_SPEECH',
  Impersonation = 'IMPERSONATION',
  InappropriateContent = 'INAPPROPRIATE_CONTENT',
  Other = 'OTHER',
  ScamOrFraud = 'SCAM_OR_FRAUD',
  SelfHarmOrDangerousContent = 'SELF_HARM_OR_DANGEROUS_CONTENT',
  Spam = 'SPAM'
}

export type ReportTypeOperationFilterInput = {
  eq?: InputMaybe<ReportType>;
  in?: InputMaybe<Array<ReportType>>;
  neq?: InputMaybe<ReportType>;
  nin?: InputMaybe<Array<ReportType>>;
};

/** A segment of a collection. */
export type ReportsCollectionSegment = {
  __typename?: 'ReportsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Report>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type Request = {
  __typename?: 'Request';
  artist: Array<Artist>;
  artistId?: Maybe<Scalars['String']['output']>;
  artistPackage: Array<ArtistPackage>;
  budget?: Maybe<RequestBudget>;
  currency: CurrencyType;
  deadline: Scalars['DateTime']['output'];
  detailDescription?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  packageId?: Maybe<Scalars['String']['output']>;
  postCreatedTime?: Maybe<Scalars['DateTime']['output']>;
  requestCreatedTime?: Maybe<Scalars['DateTime']['output']>;
  requestUserId: Scalars['String']['output'];
  requestor: Array<Listener>;
  requirements?: Maybe<Scalars['String']['output']>;
  status: RequestStatus;
  summary?: Maybe<Scalars['String']['output']>;
  summaryUnsigned?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  titleUnsigned?: Maybe<Scalars['String']['output']>;
  type: RequestType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};


export type RequestArtistArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type RequestArtistPackageArgs = {
  order?: InputMaybe<Array<ArtistPackageSortInput>>;
  where?: InputMaybe<ArtistPackageFilterInput>;
};


export type RequestRequestorArgs = {
  order?: InputMaybe<Array<ListenerSortInput>>;
  where?: InputMaybe<ListenerFilterInput>;
};

export type RequestBudget = {
  __typename?: 'RequestBudget';
  max: Scalars['Decimal']['output'];
  min: Scalars['Decimal']['output'];
};

export type RequestBudgetFilterInput = {
  and?: InputMaybe<Array<RequestBudgetFilterInput>>;
  max?: InputMaybe<DecimalOperationFilterInput>;
  min?: InputMaybe<DecimalOperationFilterInput>;
  or?: InputMaybe<Array<RequestBudgetFilterInput>>;
};

export type RequestBudgetInput = {
  max: Scalars['Decimal']['input'];
  min: Scalars['Decimal']['input'];
};

export type RequestBudgetSortInput = {
  max?: InputMaybe<SortEnumType>;
  min?: InputMaybe<SortEnumType>;
};

export type RequestCreatingRequestInput = {
  budget: RequestBudgetInput;
  deadline: Scalars['DateTime']['input'];
  detailDescription: Scalars['String']['input'];
  summary: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type RequestFilterInput = {
  and?: InputMaybe<Array<RequestFilterInput>>;
  artistId?: InputMaybe<StringOperationFilterInput>;
  budget?: InputMaybe<RequestBudgetFilterInput>;
  currency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  deadline?: InputMaybe<DateTimeOperationFilterInput>;
  detailDescription?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<RequestFilterInput>>;
  packageId?: InputMaybe<StringOperationFilterInput>;
  postCreatedTime?: InputMaybe<DateTimeOperationFilterInput>;
  requestCreatedTime?: InputMaybe<DateTimeOperationFilterInput>;
  requestUserId?: InputMaybe<StringOperationFilterInput>;
  requirements?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<RequestStatusOperationFilterInput>;
  summary?: InputMaybe<StringOperationFilterInput>;
  summaryUnsigned?: InputMaybe<StringOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  titleUnsigned?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<RequestTypeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type RequestSortInput = {
  artistId?: InputMaybe<SortEnumType>;
  budget?: InputMaybe<RequestBudgetSortInput>;
  currency?: InputMaybe<SortEnumType>;
  deadline?: InputMaybe<SortEnumType>;
  detailDescription?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  packageId?: InputMaybe<SortEnumType>;
  postCreatedTime?: InputMaybe<SortEnumType>;
  requestCreatedTime?: InputMaybe<SortEnumType>;
  requestUserId?: InputMaybe<SortEnumType>;
  requirements?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  summary?: InputMaybe<SortEnumType>;
  summaryUnsigned?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  titleUnsigned?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export enum RequestStatus {
  Blocked = 'BLOCKED',
  Canceled = 'CANCELED',
  Closed = 'CLOSED',
  Confirmed = 'CONFIRMED',
  Deleted = 'DELETED',
  Open = 'OPEN',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type RequestStatusOperationFilterInput = {
  eq?: InputMaybe<RequestStatus>;
  in?: InputMaybe<Array<RequestStatus>>;
  neq?: InputMaybe<RequestStatus>;
  nin?: InputMaybe<Array<RequestStatus>>;
};

export enum RequestType {
  DirectRequest = 'DIRECT_REQUEST',
  PublicRequest = 'PUBLIC_REQUEST'
}

export type RequestTypeOperationFilterInput = {
  eq?: InputMaybe<RequestType>;
  in?: InputMaybe<Array<RequestType>>;
  neq?: InputMaybe<RequestType>;
  nin?: InputMaybe<Array<RequestType>>;
};

export type RequestUpdatingRequestInput = {
  budget?: InputMaybe<RequestBudgetInput>;
  deadline?: InputMaybe<Scalars['DateTime']['input']>;
  detailDescription?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  status?: InputMaybe<RequestStatus>;
  summary?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** A segment of a collection. */
export type RequestsCollectionSegment = {
  __typename?: 'RequestsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Request>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type Restriction = {
  __typename?: 'Restriction';
  action?: Maybe<RestrictionAction>;
  expired?: Maybe<Scalars['DateTime']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  restrictedAt?: Maybe<Scalars['DateTime']['output']>;
  type: RestrictionType;
};

export enum RestrictionAction {
  Comment = 'COMMENT',
  CreatePublicRequest = 'CREATE_PUBLIC_REQUEST',
  None = 'NONE',
  Report = 'REPORT',
  SendRequest = 'SEND_REQUEST',
  UploadTrack = 'UPLOAD_TRACK'
}

export type RestrictionActionDetailInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  restrictionAction: RestrictionAction;
};

export type RestrictionFilterInput = {
  action?: InputMaybe<NullableOfRestrictionActionOperationFilterInput>;
  and?: InputMaybe<Array<RestrictionFilterInput>>;
  expired?: InputMaybe<DateTimeOperationFilterInput>;
  or?: InputMaybe<Array<RestrictionFilterInput>>;
  reason?: InputMaybe<StringOperationFilterInput>;
  restrictedAt?: InputMaybe<DateTimeOperationFilterInput>;
  type?: InputMaybe<RestrictionTypeOperationFilterInput>;
};

export type RestrictionSortInput = {
  action?: InputMaybe<SortEnumType>;
  expired?: InputMaybe<SortEnumType>;
  reason?: InputMaybe<SortEnumType>;
  restrictedAt?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export enum RestrictionType {
  Banned = 'BANNED',
  None = 'NONE',
  Suspended = 'SUSPENDED'
}

export type RestrictionTypeOperationFilterInput = {
  eq?: InputMaybe<RestrictionType>;
  in?: InputMaybe<Array<RestrictionType>>;
  neq?: InputMaybe<RestrictionType>;
  nin?: InputMaybe<Array<RestrictionType>>;
};

export type Review = {
  __typename?: 'Review';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  rating: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ReviewFilterInput = {
  and?: InputMaybe<Array<ReviewFilterInput>>;
  content?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  or?: InputMaybe<Array<ReviewFilterInput>>;
  rating?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  averageRating: Scalars['Int']['output'];
  totalReviews: Scalars['Int']['output'];
};

export type ReviewSortInput = {
  content?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  rating?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type RoyaltyPoliciesCollectionSegment = {
  __typename?: 'RoyaltyPoliciesCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<RoyaltyPolicy>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type RoyaltyPolicy = {
  __typename?: 'RoyaltyPolicy';
  createdAt: Scalars['DateTime']['output'];
  currency: CurrencyType;
  id: Scalars['String']['output'];
  ratePerStream: Scalars['Decimal']['output'];
  recordingPercentage: Scalars['Decimal']['output'];
  status: PolicyStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version: Scalars['Long']['output'];
  workPercentage: Scalars['Decimal']['output'];
};

export type RoyaltyPolicyFilterInput = {
  and?: InputMaybe<Array<RoyaltyPolicyFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<RoyaltyPolicyFilterInput>>;
  ratePerStream?: InputMaybe<DecimalOperationFilterInput>;
  recordingPercentage?: InputMaybe<DecimalOperationFilterInput>;
  status?: InputMaybe<PolicyStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  version?: InputMaybe<LongOperationFilterInput>;
  workPercentage?: InputMaybe<DecimalOperationFilterInput>;
};

export type RoyaltyPolicySortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  ratePerStream?: InputMaybe<SortEnumType>;
  recordingPercentage?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  version?: InputMaybe<SortEnumType>;
  workPercentage?: InputMaybe<SortEnumType>;
};

export type RoyaltyReport = {
  __typename?: 'RoyaltyReport';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  month: Scalars['Int']['output'];
  royaltySplits: Array<RoyaltySplit>;
  streamCount: Scalars['Long']['output'];
  totalRoyaltyAmount: Scalars['Decimal']['output'];
  track: Array<Track>;
  trackId: Scalars['String']['output'];
  users?: Maybe<UsersCollectionSegment>;
  year: Scalars['Int']['output'];
};


export type RoyaltyReportTrackArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  where?: InputMaybe<TrackFilterInput>;
};


export type RoyaltyReportUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
};

export type RoyaltyReportFilterInput = {
  and?: InputMaybe<Array<RoyaltyReportFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  month?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<RoyaltyReportFilterInput>>;
  royaltySplits?: InputMaybe<ListFilterInputTypeOfRoyaltySplitFilterInput>;
  streamCount?: InputMaybe<LongOperationFilterInput>;
  totalRoyaltyAmount?: InputMaybe<DecimalOperationFilterInput>;
  trackId?: InputMaybe<StringOperationFilterInput>;
  year?: InputMaybe<IntOperationFilterInput>;
};

export type RoyaltyReportSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  streamCount?: InputMaybe<SortEnumType>;
  totalRoyaltyAmount?: InputMaybe<SortEnumType>;
  trackId?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type RoyaltyReportsCollectionSegment = {
  __typename?: 'RoyaltyReportsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<RoyaltyReport>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type RoyaltySplit = {
  __typename?: 'RoyaltySplit';
  amount: Scalars['Decimal']['output'];
  artistRole: ArtistRole;
  isTransferred: Scalars['Boolean']['output'];
  level: AggregationLevel;
  percentage: Scalars['Decimal']['output'];
  userId: Scalars['String']['output'];
};

export type RoyaltySplitFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<RoyaltySplitFilterInput>>;
  artistRole?: InputMaybe<ArtistRoleOperationFilterInput>;
  isTransferred?: InputMaybe<BooleanOperationFilterInput>;
  level?: InputMaybe<AggregationLevelOperationFilterInput>;
  or?: InputMaybe<Array<RoyaltySplitFilterInput>>;
  percentage?: InputMaybe<DecimalOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

/** A segment of a collection. */
export type SearchAlbumsCollectionSegment = {
  __typename?: 'SearchAlbumsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Album>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type SearchArtistsCollectionSegment = {
  __typename?: 'SearchArtistsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Artist>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type SearchListenersCollectionSegment = {
  __typename?: 'SearchListenersCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Listener>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type SearchPlaylistsCollectionSegment = {
  __typename?: 'SearchPlaylistsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Playlist>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type SearchRequestsCollectionSegment = {
  __typename?: 'SearchRequestsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Request>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type SearchTracksCollectionSegment = {
  __typename?: 'SearchTracksCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Track>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StripeProductRequestInput = {
  id: Scalars['String']['input'];
  stripePriceIds: Array<Scalars['String']['input']>;
};

export enum StripeSubscriptionCancelMode {
  AtPeriodEnd = 'AT_PERIOD_END',
  Immediately = 'IMMEDIATELY'
}

export enum StripeSubscriptionUpdate {
  Price = 'PRICE',
  PromotionCode = 'PROMOTION_CODE',
  Quantity = 'QUANTITY'
}

export type SubmitDeliveryRequestInput = {
  deliveryFileUrl: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  packageOrderId: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  amount: Scalars['Decimal']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: CurrencyType;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version: Scalars['Int']['output'];
};

export enum SubscriptionCycle {
  Lifetime = 'LIFETIME',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export type SubscriptionFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<SubscriptionFilterInput>>;
  code?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SubscriptionFilterInput>>;
  status?: InputMaybe<SubscriptionStatusOperationFilterInput>;
  tier?: InputMaybe<SubscriptionTierOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  version?: InputMaybe<IntOperationFilterInput>;
};

export type SubscriptionInitialization = {
  __typename?: 'SubscriptionInitialization';
  initialize: Scalars['String']['output'];
  onFavoriteCountUpdated: Scalars['Long']['output'];
};


export type SubscriptionInitializationOnFavoriteCountUpdatedArgs = {
  trackId: Scalars['String']['input'];
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  id: Scalars['String']['output'];
  stripeProductActive: Scalars['Boolean']['output'];
  stripeProductId: Scalars['String']['output'];
  stripeProductImages?: Maybe<Array<Scalars['String']['output']>>;
  stripeProductMetadata?: Maybe<Array<Metadata>>;
  stripeProductName: Scalars['String']['output'];
  stripeProductType: Scalars['String']['output'];
  subscription: Array<Subscription>;
  subscriptionId: Scalars['String']['output'];
  subscriptionPlanPrices: Array<SubscriptionPlanPrice>;
};


export type SubscriptionPlanSubscriptionArgs = {
  order?: InputMaybe<Array<SubscriptionSortInput>>;
  where?: InputMaybe<SubscriptionFilterInput>;
};

export type SubscriptionPlanFilterInput = {
  and?: InputMaybe<Array<SubscriptionPlanFilterInput>>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SubscriptionPlanFilterInput>>;
  stripeProductActive?: InputMaybe<BooleanOperationFilterInput>;
  stripeProductId?: InputMaybe<StringOperationFilterInput>;
  stripeProductImages?: InputMaybe<ListStringOperationFilterInput>;
  stripeProductMetadata?: InputMaybe<ListFilterInputTypeOfMetadataFilterInput>;
  stripeProductName?: InputMaybe<StringOperationFilterInput>;
  stripeProductType?: InputMaybe<StringOperationFilterInput>;
  subscriptionId?: InputMaybe<StringOperationFilterInput>;
  subscriptionPlanPrices?: InputMaybe<ListFilterInputTypeOfSubscriptionPlanPriceFilterInput>;
};

export type SubscriptionPlanPrice = {
  __typename?: 'SubscriptionPlanPrice';
  interval: PeriodTime;
  intervalCount: Scalars['Long']['output'];
  stripePriceActive: Scalars['Boolean']['output'];
  stripePriceCurrency: Scalars['String']['output'];
  stripePriceId: Scalars['String']['output'];
  stripePriceLookupKey: Scalars['String']['output'];
  stripePriceMetadata?: Maybe<Array<Metadata>>;
  stripePriceUnitAmount: Scalars['Long']['output'];
};

export type SubscriptionPlanPriceFilterInput = {
  and?: InputMaybe<Array<SubscriptionPlanPriceFilterInput>>;
  interval?: InputMaybe<PeriodTimeOperationFilterInput>;
  intervalCount?: InputMaybe<LongOperationFilterInput>;
  or?: InputMaybe<Array<SubscriptionPlanPriceFilterInput>>;
  stripePriceActive?: InputMaybe<BooleanOperationFilterInput>;
  stripePriceCurrency?: InputMaybe<StringOperationFilterInput>;
  stripePriceId?: InputMaybe<StringOperationFilterInput>;
  stripePriceLookupKey?: InputMaybe<StringOperationFilterInput>;
  stripePriceMetadata?: InputMaybe<ListFilterInputTypeOfMetadataFilterInput>;
  stripePriceUnitAmount?: InputMaybe<LongOperationFilterInput>;
};

export type SubscriptionPlanSortInput = {
  id?: InputMaybe<SortEnumType>;
  stripeProductActive?: InputMaybe<SortEnumType>;
  stripeProductId?: InputMaybe<SortEnumType>;
  stripeProductName?: InputMaybe<SortEnumType>;
  stripeProductType?: InputMaybe<SortEnumType>;
  subscriptionId?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type SubscriptionPlansCollectionSegment = {
  __typename?: 'SubscriptionPlansCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<SubscriptionPlan>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type SubscriptionSnapshot = {
  __typename?: 'SubscriptionSnapshot';
  stripeProductActive: Scalars['Boolean']['output'];
  stripeProductId: Scalars['String']['output'];
  stripeProductImages?: Maybe<Array<Scalars['String']['output']>>;
  stripeProductMetadata?: Maybe<Array<Metadata>>;
  stripeProductName: Scalars['String']['output'];
  stripeProductType: Scalars['String']['output'];
  subscriptionAmount: Scalars['Decimal']['output'];
  subscriptionCode: Scalars['String']['output'];
  subscriptionCurrency: CurrencyType;
  subscriptionDescription?: Maybe<Scalars['String']['output']>;
  subscriptionName: Scalars['String']['output'];
  subscriptionPlanPrices: Array<SubscriptionPlanPrice>;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionVersion: Scalars['Int']['output'];
};

export type SubscriptionSnapshotFilterInput = {
  and?: InputMaybe<Array<SubscriptionSnapshotFilterInput>>;
  or?: InputMaybe<Array<SubscriptionSnapshotFilterInput>>;
  stripeProductActive?: InputMaybe<BooleanOperationFilterInput>;
  stripeProductId?: InputMaybe<StringOperationFilterInput>;
  stripeProductImages?: InputMaybe<ListStringOperationFilterInput>;
  stripeProductMetadata?: InputMaybe<ListFilterInputTypeOfMetadataFilterInput>;
  stripeProductName?: InputMaybe<StringOperationFilterInput>;
  stripeProductType?: InputMaybe<StringOperationFilterInput>;
  subscriptionAmount?: InputMaybe<DecimalOperationFilterInput>;
  subscriptionCode?: InputMaybe<StringOperationFilterInput>;
  subscriptionCurrency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  subscriptionDescription?: InputMaybe<StringOperationFilterInput>;
  subscriptionName?: InputMaybe<StringOperationFilterInput>;
  subscriptionPlanPrices?: InputMaybe<ListFilterInputTypeOfSubscriptionPlanPriceFilterInput>;
  subscriptionStatus?: InputMaybe<SubscriptionStatusOperationFilterInput>;
  subscriptionTier?: InputMaybe<SubscriptionTierOperationFilterInput>;
  subscriptionVersion?: InputMaybe<IntOperationFilterInput>;
};

export type SubscriptionSnapshotSortInput = {
  stripeProductActive?: InputMaybe<SortEnumType>;
  stripeProductId?: InputMaybe<SortEnumType>;
  stripeProductName?: InputMaybe<SortEnumType>;
  stripeProductType?: InputMaybe<SortEnumType>;
  subscriptionAmount?: InputMaybe<SortEnumType>;
  subscriptionCode?: InputMaybe<SortEnumType>;
  subscriptionCurrency?: InputMaybe<SortEnumType>;
  subscriptionDescription?: InputMaybe<SortEnumType>;
  subscriptionName?: InputMaybe<SortEnumType>;
  subscriptionStatus?: InputMaybe<SortEnumType>;
  subscriptionTier?: InputMaybe<SortEnumType>;
  subscriptionVersion?: InputMaybe<SortEnumType>;
};

export type SubscriptionSortInput = {
  amount?: InputMaybe<SortEnumType>;
  code?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  tier?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  version?: InputMaybe<SortEnumType>;
};

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Deprecated = 'DEPRECATED',
  Inactive = 'INACTIVE'
}

export type SubscriptionStatusOperationFilterInput = {
  eq?: InputMaybe<SubscriptionStatus>;
  in?: InputMaybe<Array<SubscriptionStatus>>;
  neq?: InputMaybe<SubscriptionStatus>;
  nin?: InputMaybe<Array<SubscriptionStatus>>;
};

export enum SubscriptionTier {
  Free = 'FREE',
  Premium = 'PREMIUM',
  Pro = 'PRO'
}

export type SubscriptionTierOperationFilterInput = {
  eq?: InputMaybe<SubscriptionTier>;
  in?: InputMaybe<Array<SubscriptionTier>>;
  neq?: InputMaybe<SubscriptionTier>;
  nin?: InputMaybe<Array<SubscriptionTier>>;
};

/** A segment of a collection. */
export type SubscriptionsCollectionSegment = {
  __typename?: 'SubscriptionsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Subscription>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type SyncedLine = {
  __typename?: 'SyncedLine';
  text: Scalars['String']['output'];
  time: Scalars['Float']['output'];
};

export type SyncedLineFilterInput = {
  and?: InputMaybe<Array<SyncedLineFilterInput>>;
  or?: InputMaybe<Array<SyncedLineFilterInput>>;
  text?: InputMaybe<StringOperationFilterInput>;
  time?: InputMaybe<FloatOperationFilterInput>;
};

export type ThreadedCommentsRequestInput = {
  commentType: CommentType;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortOrder: CommentSortOrder;
  targetId: Scalars['String']['input'];
};

export type ThreadedCommentsResponse = {
  __typename?: 'ThreadedCommentsResponse';
  hasNextPage: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  threads: Array<CommentThread>;
  totalThreads: Scalars['Int']['output'];
};

export type TopReportedUserResponse = {
  __typename?: 'TopReportedUserResponse';
  reportCount: Scalars['Int']['output'];
  userId: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type TopTrackInfo = {
  __typename?: 'TopTrackInfo';
  playedCount: Scalars['Int']['output'];
  trackId: Scalars['String']['output'];
};

export type TopTrackResponse = {
  __typename?: 'TopTrackResponse';
  tracksInfo: Array<TopTrackInfo>;
};

export type Track = {
  __typename?: 'Track';
  alternativeDescription: Scalars['String']['output'];
  categories?: Maybe<CategoriesCollectionSegment>;
  categoryIds: Array<Scalars['String']['output']>;
  checkTrackInFavorite: Scalars['Boolean']['output'];
  coverImage: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  embeddingVector: Array<Scalars['Float']['output']>;
  favoriteCount: Scalars['Long']['output'];
  featuredArtistIds: Array<Scalars['String']['output']>;
  featuredArtists?: Maybe<FeaturedArtistsCollectionSegment>;
  id: Scalars['String']['output'];
  isExplicit: Scalars['Boolean']['output'];
  isMonetized: Scalars['Boolean']['output'];
  legalDocuments: Array<LegalDocument>;
  lyrics?: Maybe<Scalars['String']['output']>;
  mainArtistIds: Array<Scalars['String']['output']>;
  mainArtists?: Maybe<MainArtistsCollectionSegment>;
  name: Scalars['String']['output'];
  nameUnsigned: Scalars['String']['output'];
  previewVideo?: Maybe<Scalars['String']['output']>;
  releaseInfo: ReleaseInfo;
  restriction: Restriction;
  streamCount: Scalars['Long']['output'];
  syncedLyrics: Array<SyncedLine>;
  tags: Array<Scalars['String']['output']>;
  type: TrackType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
};


export type TrackCategoriesArgs = {
  order?: InputMaybe<Array<CategorySortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CategoryFilterInput>;
};


export type TrackFeaturedArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type TrackMainArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistFilterInput>;
};

export type TrackFilterInput = {
  alternativeDescription?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<TrackFilterInput>>;
  audioFeature?: InputMaybe<AudioFeatureFilterInput>;
  audioFingerprint?: InputMaybe<AudioFingerprintFilterInput>;
  categoryIds?: InputMaybe<ListStringOperationFilterInput>;
  coverImage?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdBy?: InputMaybe<StringOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  embeddingVector?: InputMaybe<ListFloatOperationFilterInput>;
  favoriteCount?: InputMaybe<LongOperationFilterInput>;
  featuredArtistIds?: InputMaybe<ListStringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isExplicit?: InputMaybe<BooleanOperationFilterInput>;
  isMonetized?: InputMaybe<BooleanOperationFilterInput>;
  legalDocuments?: InputMaybe<ListFilterInputTypeOfLegalDocumentFilterInput>;
  lyrics?: InputMaybe<StringOperationFilterInput>;
  mainArtistIds?: InputMaybe<ListStringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  nameUnsigned?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TrackFilterInput>>;
  previewVideo?: InputMaybe<StringOperationFilterInput>;
  releaseInfo?: InputMaybe<ReleaseInfoFilterInput>;
  restriction?: InputMaybe<RestrictionFilterInput>;
  streamCount?: InputMaybe<LongOperationFilterInput>;
  syncedLyrics?: InputMaybe<ListFilterInputTypeOfSyncedLineFilterInput>;
  tags?: InputMaybe<ListStringOperationFilterInput>;
  type?: InputMaybe<TrackTypeOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
};

export type TrackSortInput = {
  alternativeDescription?: InputMaybe<SortEnumType>;
  audioFeature?: InputMaybe<AudioFeatureSortInput>;
  audioFingerprint?: InputMaybe<AudioFingerprintSortInput>;
  coverImage?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  createdBy?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  favoriteCount?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isExplicit?: InputMaybe<SortEnumType>;
  isMonetized?: InputMaybe<SortEnumType>;
  lyrics?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  nameUnsigned?: InputMaybe<SortEnumType>;
  previewVideo?: InputMaybe<SortEnumType>;
  releaseInfo?: InputMaybe<ReleaseInfoSortInput>;
  restriction?: InputMaybe<RestrictionSortInput>;
  streamCount?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
};

export type TrackTempRequest = {
  __typename?: 'TrackTempRequest';
  categoryIds: Array<Scalars['String']['output']>;
  coverImage: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  featuredArtistIds: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isExplicit: Scalars['Boolean']['output'];
  legalDocuments: Array<LegalDocument>;
  lyrics?: Maybe<Scalars['String']['output']>;
  mainArtistIds: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  previewVideo?: Maybe<Scalars['String']['output']>;
  releaseInfo: ReleaseInfo;
  requestedAt: Scalars['DateTime']['output'];
  tags: Array<Scalars['String']['output']>;
  type: TrackType;
};

export enum TrackType {
  Cover = 'COVER',
  Live = 'LIVE',
  Original = 'ORIGINAL',
  Remix = 'REMIX',
  Sample = 'SAMPLE'
}

export type TrackTypeOperationFilterInput = {
  eq?: InputMaybe<TrackType>;
  in?: InputMaybe<Array<TrackType>>;
  neq?: InputMaybe<TrackType>;
  nin?: InputMaybe<Array<TrackType>>;
};

/** A segment of a collection. */
export type TracksCollectionSegment = {
  __typename?: 'TracksCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Track>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export enum TransactionStatus {
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  Open = 'OPEN'
}

export type TransactionStatusOperationFilterInput = {
  eq?: InputMaybe<TransactionStatus>;
  in?: InputMaybe<Array<TransactionStatus>>;
  neq?: InputMaybe<TransactionStatus>;
  nin?: InputMaybe<Array<TransactionStatus>>;
};

export type TransferResponse = {
  __typename?: 'TransferResponse';
  amount: Scalars['Long']['output'];
  created: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  destinationAccountId: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type UpdateArtistPackageRequestInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  packageName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateArtistRequestInput = {
  avatarImage?: InputMaybe<Scalars['String']['input']>;
  bannerImage?: InputMaybe<Scalars['String']['input']>;
  biography?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<UserGender>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  stageName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEntitlementRequestInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  expiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['EntitlementValue']['input']>;
  valueType?: InputMaybe<EntitlementValueType>;
};

export type UpdateEscrowCommissionPolicyRequestInput = {
  currency?: InputMaybe<CurrencyType>;
  platformFeePercentage?: InputMaybe<Scalars['Decimal']['input']>;
  version: Scalars['Long']['input'];
};

export type UpdateListenerRequestInput = {
  avatarImage?: InputMaybe<Scalars['String']['input']>;
  bannerImage?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<UserGender>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePlaylistRequestInput = {
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  playlistId: Scalars['String']['input'];
};

export type UpdatePriceRequestInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  interval?: InputMaybe<PeriodTime>;
  intervalCount?: InputMaybe<Scalars['Long']['input']>;
  lookupKey?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Array<KeyValuePairOfStringAndStringInput>>;
  stripePriceId: Scalars['String']['input'];
};

export type UpdateReviewRequestInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  packageOrderId: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateRoyalPolicyRequestInput = {
  currency?: InputMaybe<CurrencyType>;
  ratePerStream?: InputMaybe<Scalars['Decimal']['input']>;
  recordingPercentage?: InputMaybe<Scalars['Decimal']['input']>;
  version: Scalars['Long']['input'];
  workPercentage?: InputMaybe<Scalars['Decimal']['input']>;
};

export type UpdateStatusArtistPackageRequestInput = {
  id: Scalars['String']['input'];
  status: ArtistPackageStatus;
};

export type UpdateSubscriptionPlanRequestInput = {
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata?: InputMaybe<Array<KeyValuePairOfStringAndStringInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  newPrices: Array<CreatePriceRequestInput>;
  subscriptionPlanId: Scalars['String']['input'];
  updatePrices: Array<UpdatePriceRequestInput>;
};

export type UpdateTrackCommentRequestInput = {
  commentId: Scalars['String']['input'];
  content: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  birthDate: Scalars['DateTime']['output'];
  checkUserFollowing: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  gender: UserGender;
  id: Scalars['String']['output'];
  isLinkedWithGoogle: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  restrictions: Array<Restriction>;
  role: UserRole;
  status: UserStatus;
  stripeAccountId?: Maybe<Scalars['String']['output']>;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type UserEngagement = {
  __typename?: 'UserEngagement';
  action: UserEngagementAction;
  actorId: Scalars['String']['output'];
  actorType: UserEngagementTargetType;
  artists?: Maybe<ArtistsCollectionSegment>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  listeners?: Maybe<ListenersCollectionSegment>;
  playlists?: Maybe<PlaylistsCollectionSegment>;
  targetId: Scalars['String']['output'];
  targetType: UserEngagementTargetType;
  tracks?: Maybe<TracksCollectionSegment>;
};


export type UserEngagementArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistFilterInput>;
};


export type UserEngagementListenersArgs = {
  order?: InputMaybe<Array<ListenerSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ListenerFilterInput>;
};


export type UserEngagementPlaylistsArgs = {
  order?: InputMaybe<Array<PlaylistSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlaylistFilterInput>;
};


export type UserEngagementTracksArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackFilterInput>;
};

export enum UserEngagementAction {
  Bookmark = 'BOOKMARK',
  Follow = 'FOLLOW',
  Like = 'LIKE'
}

export type UserEngagementActionOperationFilterInput = {
  eq?: InputMaybe<UserEngagementAction>;
  in?: InputMaybe<Array<UserEngagementAction>>;
  neq?: InputMaybe<UserEngagementAction>;
  nin?: InputMaybe<Array<UserEngagementAction>>;
};

/** A segment of a collection. */
export type UserEngagementCollectionSegment = {
  __typename?: 'UserEngagementCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<UserEngagement>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserEngagementFilterInput = {
  action?: InputMaybe<UserEngagementActionOperationFilterInput>;
  actorId?: InputMaybe<StringOperationFilterInput>;
  actorType?: InputMaybe<UserEngagementTargetTypeOperationFilterInput>;
  and?: InputMaybe<Array<UserEngagementFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<UserEngagementFilterInput>>;
  targetId?: InputMaybe<StringOperationFilterInput>;
  targetType?: InputMaybe<UserEngagementTargetTypeOperationFilterInput>;
};

export type UserEngagementRequestInput = {
  targetId: Scalars['String']['input'];
};

export type UserEngagementSortInput = {
  action?: InputMaybe<SortEnumType>;
  actorId?: InputMaybe<SortEnumType>;
  actorType?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  targetId?: InputMaybe<SortEnumType>;
  targetType?: InputMaybe<SortEnumType>;
};

export enum UserEngagementTargetType {
  Album = 'ALBUM',
  Artist = 'ARTIST',
  Listener = 'LISTENER',
  Playlist = 'PLAYLIST',
  Track = 'TRACK'
}

export type UserEngagementTargetTypeOperationFilterInput = {
  eq?: InputMaybe<UserEngagementTargetType>;
  in?: InputMaybe<Array<UserEngagementTargetType>>;
  neq?: InputMaybe<UserEngagementTargetType>;
  nin?: InputMaybe<Array<UserEngagementTargetType>>;
};

export type UserFilterInput = {
  and?: InputMaybe<Array<UserFilterInput>>;
  birthDate?: InputMaybe<DateTimeOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdBy?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  fcmToken?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<UserGenderOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isLinkedWithGoogle?: InputMaybe<BooleanOperationFilterInput>;
  lastLoginAt?: InputMaybe<DateTimeOperationFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  passwordHash?: InputMaybe<StringOperationFilterInput>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  restrictions?: InputMaybe<ListFilterInputTypeOfRestrictionFilterInput>;
  role?: InputMaybe<UserRoleOperationFilterInput>;
  status?: InputMaybe<UserStatusOperationFilterInput>;
  stripeAccountId?: InputMaybe<StringOperationFilterInput>;
  stripeCustomerId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
};

export enum UserGender {
  Female = 'FEMALE',
  Male = 'MALE',
  NotSpecified = 'NOT_SPECIFIED',
  Other = 'OTHER'
}

export type UserGenderOperationFilterInput = {
  eq?: InputMaybe<UserGender>;
  in?: InputMaybe<Array<UserGender>>;
  neq?: InputMaybe<UserGender>;
  nin?: InputMaybe<Array<UserGender>>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Artist = 'ARTIST',
  Guest = 'GUEST',
  Listener = 'LISTENER',
  Moderator = 'MODERATOR'
}

export type UserRoleOperationFilterInput = {
  eq?: InputMaybe<UserRole>;
  in?: InputMaybe<Array<UserRole>>;
  neq?: InputMaybe<UserRole>;
  nin?: InputMaybe<Array<UserRole>>;
};

export type UserSortInput = {
  birthDate?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  createdBy?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  fcmToken?: InputMaybe<SortEnumType>;
  fullName?: InputMaybe<SortEnumType>;
  gender?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isLinkedWithGoogle?: InputMaybe<SortEnumType>;
  lastLoginAt?: InputMaybe<SortEnumType>;
  passwordHash?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  role?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  stripeAccountId?: InputMaybe<SortEnumType>;
  stripeCustomerId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
};

export enum UserStatus {
  Active = 'ACTIVE',
  Banned = 'BANNED',
  Inactive = 'INACTIVE',
  Suspended = 'SUSPENDED'
}

export type UserStatusOperationFilterInput = {
  eq?: InputMaybe<UserStatus>;
  in?: InputMaybe<Array<UserStatus>>;
  neq?: InputMaybe<UserStatus>;
  nin?: InputMaybe<Array<UserStatus>>;
};

export type UserSubscription = {
  __typename?: 'UserSubscription';
  autoRenew: Scalars['Boolean']['output'];
  cancelAtEndOfPeriod: Scalars['Boolean']['output'];
  canceledAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  periodEnd?: Maybe<Scalars['DateTime']['output']>;
  periodStart: Scalars['DateTime']['output'];
  stripeSubscriptionId?: Maybe<Scalars['String']['output']>;
  subscription: Array<Subscription>;
  subscriptionId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: Array<User>;
  userId: Scalars['String']['output'];
};


export type UserSubscriptionSubscriptionArgs = {
  order?: InputMaybe<Array<SubscriptionSortInput>>;
  where?: InputMaybe<SubscriptionFilterInput>;
};


export type UserSubscriptionUserArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type UserSubscriptionFilterInput = {
  and?: InputMaybe<Array<UserSubscriptionFilterInput>>;
  autoRenew?: InputMaybe<BooleanOperationFilterInput>;
  cancelAtEndOfPeriod?: InputMaybe<BooleanOperationFilterInput>;
  canceledAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserSubscriptionFilterInput>>;
  periodEnd?: InputMaybe<DateTimeOperationFilterInput>;
  periodStart?: InputMaybe<DateTimeOperationFilterInput>;
  stripeSubscriptionId?: InputMaybe<StringOperationFilterInput>;
  subscriptionId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type UserSubscriptionSortInput = {
  autoRenew?: InputMaybe<SortEnumType>;
  cancelAtEndOfPeriod?: InputMaybe<SortEnumType>;
  canceledAt?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  periodEnd?: InputMaybe<SortEnumType>;
  periodStart?: InputMaybe<SortEnumType>;
  stripeSubscriptionId?: InputMaybe<SortEnumType>;
  subscriptionId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type UserSubscriptionsCollectionSegment = {
  __typename?: 'UserSubscriptionsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<UserSubscription>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type UsersCollectionSegment = {
  __typename?: 'UsersCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type Work = {
  __typename?: 'Work';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  status: WorkStatus;
  track: Array<Track>;
  trackId: Scalars['String']['output'];
  users?: Maybe<UsersCollectionSegment>;
  version: Scalars['Long']['output'];
  workSplits: Array<WorkSplit>;
};


export type WorkTrackArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  where?: InputMaybe<TrackFilterInput>;
};


export type WorkUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
};

export type WorkFilterInput = {
  and?: InputMaybe<Array<WorkFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<WorkFilterInput>>;
  status?: InputMaybe<WorkStatusOperationFilterInput>;
  trackId?: InputMaybe<StringOperationFilterInput>;
  version?: InputMaybe<LongOperationFilterInput>;
  workSplits?: InputMaybe<ListFilterInputTypeOfWorkSplitFilterInput>;
};

export type WorkSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  trackId?: InputMaybe<SortEnumType>;
  version?: InputMaybe<SortEnumType>;
};

export type WorkSplit = {
  __typename?: 'WorkSplit';
  artistRole: ArtistRole;
  percentage: Scalars['Decimal']['output'];
  userId: Scalars['String']['output'];
};

export type WorkSplitFilterInput = {
  and?: InputMaybe<Array<WorkSplitFilterInput>>;
  artistRole?: InputMaybe<ArtistRoleOperationFilterInput>;
  or?: InputMaybe<Array<WorkSplitFilterInput>>;
  percentage?: InputMaybe<DecimalOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export enum WorkStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

export type WorkStatusOperationFilterInput = {
  eq?: InputMaybe<WorkStatus>;
  in?: InputMaybe<Array<WorkStatus>>;
  neq?: InputMaybe<WorkStatus>;
  nin?: InputMaybe<Array<WorkStatus>>;
};

export type WorkTempRequest = {
  __typename?: 'WorkTempRequest';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  workSplits: Array<CreateWorkSplitRequest>;
};

/** A segment of a collection. */
export type WorkUsersCollectionSegment = {
  __typename?: 'WorkUsersCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type WorksCollectionSegment = {
  __typename?: 'WorksCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Work>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type UsersQueryVariables = Exact<{
  where?: InputMaybe<UserFilterInput>;
}>;


export type UsersQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any, role: UserRole, phoneNumber?: string | null, status: UserStatus, createdAt: any, updatedAt?: any | null }> | null } | null };

export type AdminArtistsDetailQueryVariables = Exact<{
  where?: InputMaybe<ArtistFilterInput>;
}>;


export type AdminArtistsDetailQuery = { __typename?: 'QueryInitialization', artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, stageNameUnsigned: string, email: string, artistType: ArtistType, biography?: string | null, categoryIds: Array<string>, followerCount: any, popularity: any, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, createdAt: any, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, phoneNumber: string, isLeader: boolean, gender: UserGender }>, identityCard: { __typename?: 'IdentityCard', number: string, fullName: string, dateOfBirth: any, gender: UserGender, placeOfOrigin: string, nationality: string, frontImage?: string | null, backImage?: string | null, validUntil?: any | null, placeOfResidence: { __typename?: 'Address', street?: string | null, ward?: string | null, province?: string | null, oldDistrict?: string | null, oldWard?: string | null, oldProvince?: string | null, addressLine?: string | null } }, user: Array<{ __typename?: 'User', email: string, id: string, fullName: string, gender: UserGender, birthDate: any, role: UserRole, status: UserStatus }> }> | null } | null };

export type AdminListenerDetailQueryVariables = Exact<{
  where?: InputMaybe<ListenerFilterInput>;
}>;


export type AdminListenerDetailQuery = { __typename?: 'QueryInitialization', listeners?: { __typename?: 'ListenersCollectionSegment', items?: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, email: string, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, followerCount: any, followingCount: any, createdAt: any, updatedAt?: any | null, user: Array<{ __typename?: 'User', gender: UserGender, birthDate: any, role: UserRole, fullName: string, status: UserStatus }> }> | null } | null };

export type UsersListQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
}>;


export type UsersListQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any, role: UserRole, phoneNumber?: string | null, status: UserStatus, isLinkedWithGoogle: boolean, stripeCustomerId?: string | null, stripeAccountId?: string | null, lastLoginAt?: any | null, createdAt: any, updatedAt?: any | null }> | null } | null, artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, email: string, artistType: ArtistType, categoryIds: Array<string>, biography?: string | null, followerCount: any, popularity: any, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, createdAt: any, updatedAt?: any | null, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, phoneNumber: string, isLeader: boolean, gender: UserGender }>, identityCard: { __typename?: 'IdentityCard', number: string, fullName: string, dateOfBirth: any, gender: UserGender, placeOfOrigin: string, nationality: string, validUntil?: any | null, placeOfResidence: { __typename?: 'Address', street?: string | null, ward?: string | null, province?: string | null, oldDistrict?: string | null, oldWard?: string | null, oldProvince?: string | null, addressLine?: string | null } } }> | null } | null, listeners?: { __typename?: 'ListenersCollectionSegment', items?: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, email: string, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, followerCount: any, followingCount: any, lastFollowers: Array<string>, lastFollowings: Array<string>, createdAt: any, updatedAt?: any | null }> | null } | null };

export type UsersStatisticQueryVariables = Exact<{
  where?: InputMaybe<UserFilterInput>;
}>;


export type UsersStatisticQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, phoneNumber?: string | null, status: UserStatus, createdAt: any, updatedAt?: any | null }> | null } | null };

export type CreateModeratorMutationVariables = Exact<{
  createModeratorRequest: CreateModeratorRequestInput;
}>;


export type CreateModeratorMutation = { __typename?: 'MutationInitialization', createModerator: boolean };

export type BanUserMutationVariables = Exact<{
  targetUserId: Scalars['String']['input'];
}>;


export type BanUserMutation = { __typename?: 'MutationInitialization', banUser: boolean };

export type UnbanUserMutationVariables = Exact<{
  targetUserId: Scalars['String']['input'];
}>;


export type UnbanUserMutation = { __typename?: 'MutationInitialization', unbanUser: boolean };

export type PlaylistBriefQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type PlaylistBriefQuery = { __typename?: 'QueryInitialization', playlists?: { __typename?: 'PlaylistsCollectionSegment', items?: Array<{ __typename?: 'Playlist', id: string, name: string, coverImage?: string | null, isPublic: boolean }> | null } | null };

export type CheckTrackInPlaylistQueryVariables = Exact<{
  trackId: Scalars['String']['input'];
}>;


export type CheckTrackInPlaylistQuery = { __typename?: 'QueryInitialization', playlists?: { __typename?: 'PlaylistsCollectionSegment', items?: Array<{ __typename?: 'Playlist', id: string }> | null } | null };

export type PlaylistDetailQueryVariables = Exact<{
  playlistId: Scalars['String']['input'];
}>;


export type PlaylistDetailQuery = { __typename?: 'QueryInitialization', playlists?: { __typename?: 'PlaylistsCollectionSegment', items?: Array<{ __typename?: 'Playlist', id: string, name: string, coverImage?: string | null, description?: string | null, isPublic: boolean, userId: string, createdAt: any, updatedAt?: any | null, user: Array<{ __typename?: 'User', id: string, fullName: string }>, tracks?: { __typename?: 'TracksCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Track', id: string }> | null } | null, tracksInfo: Array<{ __typename?: 'PlaylistTracksInfo', trackId: string }> }> | null } | null };

export type PlaylistDetailTrackListQueryVariables = Exact<{
  playlistId: Scalars['String']['input'];
}>;


export type PlaylistDetailTrackListQuery = { __typename?: 'QueryInitialization', playlists?: { __typename?: 'PlaylistsCollectionSegment', items?: Array<{ __typename?: 'Playlist', id: string, tracks?: { __typename?: 'TracksCollectionSegment', items?: Array<{ __typename?: 'Track', id: string, name: string, coverImage: string, isExplicit: boolean, mainArtistIds: Array<string>, mainArtists?: { __typename?: 'MainArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', stageName: string }> | null } | null }> | null } | null, tracksInfo: Array<{ __typename?: 'PlaylistTracksInfo', trackId: string, addedTime: any }> }> | null } | null };

export type SearchArtistsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  stageName: Scalars['String']['input'];
}>;


export type SearchArtistsQuery = { __typename?: 'QueryInitialization', searchArtists?: { __typename?: 'SearchArtistsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, stageNameUnsigned: string, email: string, artistType: ArtistType, avatarImage?: string | null, followerCount: any, user: Array<{ __typename?: 'User', fullName: string, role: UserRole }> }> | null } | null };

export type SearchListenersQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  displayName: Scalars['String']['input'];
}>;


export type SearchListenersQuery = { __typename?: 'QueryInitialization', searchListeners?: { __typename?: 'SearchListenersCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, displayNameUnsigned: string, email: string, avatarImage?: string | null, followerCount: any, followingCount: any, user: Array<{ __typename?: 'User', fullName: string, role: UserRole }> }> | null } | null };

export type SearchTracksQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
}>;


export type SearchTracksQuery = { __typename?: 'QueryInitialization', searchTracks?: { __typename?: 'SearchTracksCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Track', id: string, name: string, description?: string | null, nameUnsigned: string, type: TrackType, categoryIds: Array<string>, mainArtistIds: Array<string>, createdAt: any, coverImage: string, checkTrackInFavorite: boolean, mainArtists?: { __typename?: 'MainArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, artistType: ArtistType }> | null } | null, restriction: { __typename?: 'Restriction', type: RestrictionType } }> | null } | null };

export type SearchPlaylistsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
}>;


export type SearchPlaylistsQuery = { __typename?: 'QueryInitialization', searchPlaylists?: { __typename?: 'SearchPlaylistsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Playlist', id: string, userId: string, name: string, nameUnsigned: string, coverImage?: string | null, isPublic: boolean, checkPlaylistInFavorite: boolean, tracksInfo: Array<{ __typename?: 'PlaylistTracksInfo', trackId: string, addedTime: any }>, user: Array<{ __typename?: 'User', id: string, fullName: string }> }> | null } | null };

export type CreateSubscriptionMutationVariables = Exact<{
  createSubscriptionRequest: CreateSubscriptionRequestInput;
}>;


export type CreateSubscriptionMutation = { __typename?: 'MutationInitialization', createSubscription: boolean };

export type CreateSubscriptionPlanMutationVariables = Exact<{
  createSubScriptionPlanRequest: CreateSubScriptionPlanRequestInput;
}>;


export type CreateSubscriptionPlanMutation = { __typename?: 'MutationInitialization', createSubscriptionPlan: boolean };

export type ActivateSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['String']['input'];
}>;


export type ActivateSubscriptionMutation = { __typename?: 'MutationInitialization', activateSubscription: boolean };

export type UpdateSubscriptionPlanMutationVariables = Exact<{
  updateSubscriptionPlanRequest: UpdateSubscriptionPlanRequestInput;
}>;


export type UpdateSubscriptionPlanMutation = { __typename?: 'MutationInitialization', updateSubscriptionPlan: boolean };

export type CreateArtistPackageMutationVariables = Exact<{
  createRequest: CreateArtistPackageRequestInput;
}>;


export type CreateArtistPackageMutation = { __typename?: 'MutationInitialization', createArtistPackage: boolean };

export type ChangeArtistPackageStatusMutationVariables = Exact<{
  updateStatusRequest: UpdateStatusArtistPackageRequestInput;
}>;


export type ChangeArtistPackageStatusMutation = { __typename?: 'MutationInitialization', changeArtistPackageStatus: boolean };

export type UpdateArtistPackageMutationVariables = Exact<{
  updateRequest: UpdateArtistPackageRequestInput;
}>;


export type UpdateArtistPackageMutation = { __typename?: 'MutationInitialization', updateArtistPackage: boolean };

export type DeleteArtistPackageMutationVariables = Exact<{
  artistPackageId: Scalars['String']['input'];
}>;


export type DeleteArtistPackageMutation = { __typename?: 'MutationInitialization', deleteArtistPackage: boolean };

export type ChangeRequestStatusMutationVariables = Exact<{
  request: ChangeStatusRequestInput;
}>;


export type ChangeRequestStatusMutation = { __typename?: 'MutationInitialization', changeRequestStatus: boolean };

export type UploadTrackMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
  createTrackRequest: CreateTrackRequestInput;
  createWorkRequest: CreateWorkRequestInput;
  createRecordingRequest: CreateRecordingRequestInput;
}>;


export type UploadTrackMutation = { __typename?: 'MutationInitialization', uploadTrack: boolean };

export type UpdateArtistProfileMutationVariables = Exact<{
  updateArtistRequest: UpdateArtistRequestInput;
}>;


export type UpdateArtistProfileMutation = { __typename?: 'MutationInitialization', updateArtistProfile: boolean };

export type AddConversationGeneralMutationVariables = Exact<{
  otherUserId: Scalars['String']['input'];
}>;


export type AddConversationGeneralMutation = { __typename?: 'MutationInitialization', addConversationGeneral: string };

export type AddConversationFromRequestHubMutationVariables = Exact<{
  createConversationRequestInput: CreateConversationRequestInput;
}>;


export type AddConversationFromRequestHubMutation = { __typename?: 'MutationInitialization', addConversationFromRequestHub: string };

export type PlaylistFavoriteMutationVariables = Exact<{
  playlistId: Scalars['String']['input'];
  isAdding: Scalars['Boolean']['input'];
}>;


export type PlaylistFavoriteMutation = { __typename?: 'MutationInitialization', addToFavoritePlaylist: boolean };

export type CreatePlaylistMutationVariables = Exact<{
  createPlaylistRequest: CreatePlaylistRequestInput;
}>;


export type CreatePlaylistMutation = { __typename?: 'MutationInitialization', createPlaylist: boolean };

export type UpdatePlaylistMutationVariables = Exact<{
  updatePlaylistRequest: UpdatePlaylistRequestInput;
}>;


export type UpdatePlaylistMutation = { __typename?: 'MutationInitialization', updatePlaylist: boolean };

export type DeletePlaylistMutationVariables = Exact<{
  playlistId: Scalars['String']['input'];
}>;


export type DeletePlaylistMutation = { __typename?: 'MutationInitialization', deletePlaylist: boolean };

export type AddToPlaylistMutationVariables = Exact<{
  addToPlaylistRequest: AddToPlaylistRequestInput;
}>;


export type AddToPlaylistMutation = { __typename?: 'MutationInitialization', addToPlaylist: boolean };

export type RemoveFromPlaylistMutationVariables = Exact<{
  removeFromPlaylistRequest: RemoveFromPlaylistRequestInput;
}>;


export type RemoveFromPlaylistMutation = { __typename?: 'MutationInitialization', removeFromPlaylist: boolean };

export type ReportMutationMutationVariables = Exact<{
  request: CreateReportRequestInput;
}>;


export type ReportMutationMutation = { __typename?: 'MutationInitialization', createReport: boolean };

export type ProcessReportMutationVariables = Exact<{
  request: ProcessReportRequestInput;
}>;


export type ProcessReportMutation = { __typename?: 'MutationInitialization', processReport: boolean };

export type AssignReportToModeratorMutationVariables = Exact<{
  reportId: Scalars['String']['input'];
  moderatorId: Scalars['String']['input'];
}>;


export type AssignReportToModeratorMutation = { __typename?: 'MutationInitialization', assignReportToModerator: boolean };

export type UpdateRequestHubCommentMutationVariables = Exact<{
  commentId: Scalars['String']['input'];
  content: Scalars['String']['input'];
}>;


export type UpdateRequestHubCommentMutation = { __typename?: 'MutationInitialization', updateComment: boolean };

export type DeleteRequestHubCommentMutationVariables = Exact<{
  commentId: Scalars['String']['input'];
}>;


export type DeleteRequestHubCommentMutation = { __typename?: 'MutationInitialization', deleteComment: boolean };

export type CreateRequestHubCommentMutationVariables = Exact<{
  targetId: Scalars['String']['input'];
  commentType: CommentType;
  content: Scalars['String']['input'];
  parentCommentId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateRequestHubCommentMutation = { __typename?: 'MutationInitialization', createComment: boolean };

export type CreatePublicRequestMutationVariables = Exact<{
  request: RequestCreatingRequestInput;
}>;


export type CreatePublicRequestMutation = { __typename?: 'MutationInitialization', createPublicRequest: boolean };

export type UpdatePublicRequestMutationVariables = Exact<{
  request: RequestUpdatingRequestInput;
}>;


export type UpdatePublicRequestMutation = { __typename?: 'MutationInitialization', updatePublicRequest: boolean };

export type BlockPublicRequestMutationVariables = Exact<{
  requestId: Scalars['String']['input'];
}>;


export type BlockPublicRequestMutation = { __typename?: 'MutationInitialization', blockPublicRequest: boolean };

export type CreateExpressConnectedAccountMutationVariables = Exact<{
  returnUrl: Scalars['String']['input'];
  refreshUrl: Scalars['String']['input'];
}>;


export type CreateExpressConnectedAccountMutation = { __typename?: 'MutationInitialization', createExpressConnectedAccount: { __typename?: 'AccountLinkResponse', url: string } };

export type SubscriptionCreateCheckoutSessionMutationVariables = Exact<{
  createSubscriptionCheckoutSessionInput: CreateSubscriptionCheckoutSessionRequestInput;
}>;


export type SubscriptionCreateCheckoutSessionMutation = { __typename?: 'MutationInitialization', createSubscriptionCheckoutSession: { __typename?: 'CheckoutSessionResponse', id: string, url: string } };

export type CancelSubscriptionAtPeriodEndMutationVariables = Exact<{ [key: string]: never; }>;


export type CancelSubscriptionAtPeriodEndMutation = { __typename?: 'MutationInitialization', cancelSubscriptionAtPeriodEnd: boolean };

export type ResumeSubscriptionMutationVariables = Exact<{ [key: string]: never; }>;


export type ResumeSubscriptionMutation = { __typename?: 'MutationInitialization', resumeSubscription: boolean };

export type UpdateTrackCommentMutationVariables = Exact<{
  commentId: Scalars['String']['input'];
  content: Scalars['String']['input'];
}>;


export type UpdateTrackCommentMutation = { __typename?: 'MutationInitialization', updateComment: boolean };

export type DeleteTrackCommentMutationVariables = Exact<{
  commentId: Scalars['String']['input'];
}>;


export type DeleteTrackCommentMutation = { __typename?: 'MutationInitialization', deleteComment: boolean };

export type CreateTrackCommentMutationVariables = Exact<{
  request: CreateCommentRequestInput;
}>;


export type CreateTrackCommentMutation = { __typename?: 'MutationInitialization', createComment: boolean };

export type FavoriteTrackMutationVariables = Exact<{
  trackId: Scalars['String']['input'];
  isAdding: Scalars['Boolean']['input'];
}>;


export type FavoriteTrackMutation = { __typename?: 'MutationInitialization', addToFavoriteTrack: boolean };

export type FollowUserMutationVariables = Exact<{
  targetId: Scalars['String']['input'];
}>;


export type FollowUserMutation = { __typename?: 'MutationInitialization', followUser: boolean };

export type UnfollowUserMutationVariables = Exact<{
  targetId: Scalars['String']['input'];
}>;


export type UnfollowUserMutation = { __typename?: 'MutationInitialization', unfollowUser: boolean };

export type UpdateListenerProfileMutationVariables = Exact<{
  updateListenerRequest: UpdateListenerRequestInput;
}>;


export type UpdateListenerProfileMutation = { __typename?: 'MutationInitialization', updateListenerProfile: boolean };

export type ApproveArtistRegistrationMutationVariables = Exact<{
  request: ArtistRegistrationApprovalRequestInput;
}>;


export type ApproveArtistRegistrationMutation = { __typename?: 'MutationInitialization', approveArtistRegistration: boolean };

export type RejectArtistRegistrationMutationVariables = Exact<{
  request: ArtistRegistrationApprovalRequestInput;
}>;


export type RejectArtistRegistrationMutation = { __typename?: 'MutationInitialization', rejectArtistRegistration: boolean };

export type SubscriptionsQueryVariables = Exact<{
  where: SubscriptionFilterInput;
}>;


export type SubscriptionsQuery = { __typename?: 'QueryInitialization', subscriptions?: { __typename?: 'SubscriptionsCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'Subscription', id: string, name: string, description?: string | null, code: string, status: SubscriptionStatus, createdAt: any, tier: SubscriptionTier, amount: any }> | null } | null };

export type SubscriptionsDetailQueryVariables = Exact<{
  where?: InputMaybe<SubscriptionFilterInput>;
}>;


export type SubscriptionsDetailQuery = { __typename?: 'QueryInitialization', subscriptions?: { __typename?: 'SubscriptionsCollectionSegment', items?: Array<{ __typename?: 'Subscription', id: string, name: string, description?: string | null, code: string, version: number, amount: any, currency: CurrencyType, tier: SubscriptionTier, status: SubscriptionStatus, createdAt: any, updatedAt?: any | null }> | null } | null };

export type SubscriptionPlansQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SubscriptionPlanFilterInput>;
}>;


export type SubscriptionPlansQuery = { __typename?: 'QueryInitialization', subscriptionPlans?: { __typename?: 'SubscriptionPlansCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'SubscriptionPlan', id: string, subscriptionId: string, stripeProductId: string, stripeProductActive: boolean, stripeProductName: string, stripeProductImages?: Array<string> | null, stripeProductType: string, stripeProductMetadata?: Array<{ __typename?: 'Metadata', key: string, value: string }> | null, subscriptionPlanPrices: Array<{ __typename?: 'SubscriptionPlanPrice', stripePriceId: string, stripePriceActive: boolean, stripePriceUnitAmount: any, stripePriceCurrency: string, stripePriceLookupKey: string, interval: PeriodTime, intervalCount: any }>, subscription: Array<{ __typename?: 'Subscription', id: string, name: string, description?: string | null, code: string, version: number, amount: any, currency: CurrencyType, tier: SubscriptionTier, status: SubscriptionStatus, createdAt: any, updatedAt?: any | null }> }> | null } | null };

export type ArtistPackagesServiceQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArtistPackageFilterInput>;
}>;


export type ArtistPackagesServiceQuery = { __typename?: 'QueryInitialization', artistPackages?: { __typename?: 'ArtistPackagesCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'ArtistPackage', id: string, packageName: string, amount: any, currency: CurrencyType, estimateDeliveryDays: number, description?: string | null, maxRevision: number, updatedAt?: any | null, createdAt: any, artistId: string, status: ArtistPackageStatus, isDelete: boolean, serviceDetails: Array<{ __typename?: 'Metadata', key: string, value: string }> }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type ArtistPackagesDetailQueryVariables = Exact<{
  where?: InputMaybe<ArtistPackageFilterInput>;
}>;


export type ArtistPackagesDetailQuery = { __typename?: 'QueryInitialization', artistPackages?: { __typename?: 'ArtistPackagesCollectionSegment', items?: Array<{ __typename?: 'ArtistPackage', id: string, packageName: string, amount: any, currency: CurrencyType, estimateDeliveryDays: number, description?: string | null, maxRevision: number, status: ArtistPackageStatus, isDelete: boolean, createdAt: any, updatedAt?: any | null, artistId: string, serviceDetails: Array<{ __typename?: 'Metadata', key: string, value: string }> }> | null } | null };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'QueryInitialization', categories?: { __typename?: 'CategoriesCollectionSegment', items?: Array<{ __typename?: 'Category', id: string, name: string }> | null } | null };

export type GetPendingArtistRequestQueryVariables = Exact<{
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  where?: InputMaybe<RequestFilterInput>;
}>;


export type GetPendingArtistRequestQuery = { __typename?: 'QueryInitialization', requests?: { __typename?: 'RequestsCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'Request', id: string, requestUserId: string, artistId?: string | null, packageId?: string | null, title?: string | null, requestCreatedTime?: any | null, type: RequestType, status: RequestStatus, postCreatedTime?: any | null, currency: CurrencyType, budget?: { __typename?: 'RequestBudget', min: any, max: any } | null, requestor: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string }>, artist: Array<{ __typename?: 'Artist', id: string, stageName: string, userId: string }>, artistPackage: Array<{ __typename?: 'ArtistPackage', artistId: string, id: string, packageName: string }> }> | null } | null };

export type RequestPendingDetailByIdQueryVariables = Exact<{
  where?: InputMaybe<RequestFilterInput>;
}>;


export type RequestPendingDetailByIdQuery = { __typename?: 'QueryInitialization', requests?: { __typename?: 'RequestsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Request', id: string, requestUserId: string, artistId?: string | null, packageId?: string | null, title?: string | null, titleUnsigned?: string | null, summary?: string | null, summaryUnsigned?: string | null, detailDescription?: string | null, requirements?: string | null, postCreatedTime?: any | null, updatedAt?: any | null, type: RequestType, currency: CurrencyType, deadline: any, status: RequestStatus, requestCreatedTime?: any | null, notes?: string | null, requestor: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, email: string }>, artist: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string }>, artistPackage: Array<{ __typename?: 'ArtistPackage', id: string, artistId: string, packageName: string, amount: any, currency: CurrencyType, maxRevision: number, estimateDeliveryDays: number }>, budget?: { __typename?: 'RequestBudget', min: any, max: any } | null }> | null } | null };

export type GetArtistTransactionsQueryVariables = Exact<{
  where?: InputMaybe<PaymentTransactionFilterInput>;
  order?: InputMaybe<Array<PaymentTransactionSortInput> | PaymentTransactionSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetArtistTransactionsQuery = { __typename?: 'QueryInitialization', paymentTransactions?: { __typename?: 'PaymentTransactionsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'PaymentTransaction', id: string, amount: any, currency: string, createdAt: any, paymentStatus: PaymentTransactionStatus, status: TransactionStatus, stripePaymentMethod: Array<string>, stripePaymentId?: string | null, stripeCheckoutSessionId?: string | null }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetArtistPayoutsQueryVariables = Exact<{
  where?: InputMaybe<PayoutTransactionFilterInput>;
  order?: InputMaybe<Array<PayoutTransactionSortInput> | PayoutTransactionSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetArtistPayoutsQuery = { __typename?: 'QueryInitialization', payoutTransactions?: { __typename?: 'PayoutTransactionsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'PayoutTransaction', id: string, amount: any, currency: string, createdAt: any, status: PayoutTransactionStatus, method?: string | null, description: string, destinationAccountId: string, stripePayoutId: string, stripeTransferId: string, royaltyReportId?: string | null, userId: string }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetArtistInvoicesQueryVariables = Exact<{
  where?: InputMaybe<InvoiceFilterInput>;
  order?: InputMaybe<Array<InvoiceSortInput> | InvoiceSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetArtistInvoicesQuery = { __typename?: 'QueryInitialization', invoices?: { __typename?: 'InvoicesCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Invoice', id: string, amount: any, currency: string, email: string, to: string, from: string, paidAt: any, paymentTransactionId: string }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type TracksWithFiltersQueryVariables = Exact<{
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  where?: InputMaybe<TrackFilterInput>;
  order?: InputMaybe<Array<TrackSortInput> | TrackSortInput>;
}>;


export type TracksWithFiltersQuery = { __typename?: 'QueryInitialization', tracks?: { __typename?: 'TracksCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Track', id: string, name: string, mainArtistIds: Array<string>, streamCount: any, favoriteCount: any, coverImage: string, isExplicit: boolean, releaseInfo: { __typename?: 'ReleaseInfo', releaseDate?: any | null, isRelease: boolean } }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type TrackUploadArtistListQueryVariables = Exact<{ [key: string]: never; }>;


export type TrackUploadArtistListQuery = { __typename?: 'QueryInitialization', artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, user: Array<{ __typename?: 'User', stripeAccountId?: string | null }> }> | null } | null };

export type GetArtistProfileQueryVariables = Exact<{
  where?: InputMaybe<ArtistFilterInput>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetArtistProfileQuery = { __typename?: 'QueryInitialization', artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, email: string, artistType: ArtistType, avatarImage?: string | null, bannerImage?: string | null, biography?: string | null, isVerified: boolean, createdAt: any, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, gender: UserGender, isLeader: boolean, phoneNumber: string }>, user: Array<{ __typename?: 'User', status: UserStatus }>, identityCard: { __typename?: 'IdentityCard', number: string, fullName: string, dateOfBirth: any, gender: UserGender, placeOfOrigin: string, validUntil?: any | null, placeOfResidence: { __typename?: 'Address', addressLine?: string | null } } }> | null } | null };

export type ConversationsQueryVariables = Exact<{
  where?: InputMaybe<ConversationFilterInput>;
}>;


export type ConversationsQuery = { __typename?: 'QueryInitialization', conversations?: { __typename?: 'ConversationsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Conversation', id: string, userIds: Array<string>, ownerProfileConversation: { __typename?: 'ConversationResponse', avatar: string, nickname: string }, otherProfileConversation: { __typename?: 'ConversationResponse', avatar: string, nickname: string }, lastMessage?: { __typename?: 'LastMessage', text: string, senderId: string, sentAt: any, isReadBy: Array<string> } | null }> | null } | null };

export type MessagesQueryVariables = Exact<{
  where?: InputMaybe<MessageFilterInput>;
}>;


export type MessagesQuery = { __typename?: 'QueryInitialization', messages?: { __typename?: 'MessagesConnection', totalCount: number, edges?: Array<{ __typename?: 'MessagesEdge', cursor: string, node: { __typename?: 'Message', id: string, conversationId: string, senderId: string, receiverId: string, isRead: boolean, text: string, sentAt: any, deletedForIds: Array<string>, senderProfileMessages: { __typename?: 'MessageResponse', avatar: string, nickname: string } } }> | null } | null };

export type FollowersQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['String']['input']>;
  artistId?: InputMaybe<Scalars['String']['input']>;
}>;


export type FollowersQuery = { __typename?: 'QueryInitialization', followers?: { __typename?: 'FollowersCollectionSegment', totalCount: number } | null };

export type FollowingsQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['String']['input']>;
  artistId?: InputMaybe<Scalars['String']['input']>;
}>;


export type FollowingsQuery = { __typename?: 'QueryInitialization', followings?: { __typename?: 'FollowingsCollectionSegment', totalCount: number } | null };

export type ListenerRequestsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RequestFilterInput>;
}>;


export type ListenerRequestsQuery = { __typename?: 'QueryInitialization', requests?: { __typename?: 'RequestsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Request', id: string, requestUserId: string, artistId?: string | null, packageId?: string | null, title?: string | null, summary?: string | null, detailDescription?: string | null, requirements?: string | null, type: RequestType, currency: CurrencyType, deadline: any, status: RequestStatus, requestCreatedTime?: any | null, updatedAt?: any | null, notes?: string | null, budget?: { __typename?: 'RequestBudget', min: any, max: any } | null, artist: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, avatarImage?: string | null }>, artistPackage: Array<{ __typename?: 'ArtistPackage', id: string, packageName: string, description?: string | null }> }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type ListenerRequestByIdQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RequestFilterInput>;
}>;


export type ListenerRequestByIdQuery = { __typename?: 'QueryInitialization', requests?: { __typename?: 'RequestsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Request', id: string, requestUserId: string, artistId?: string | null, packageId?: string | null, title?: string | null, summary?: string | null, detailDescription?: string | null, requirements?: string | null, type: RequestType, currency: CurrencyType, deadline: any, status: RequestStatus, requestCreatedTime?: any | null, updatedAt?: any | null, notes?: string | null, budget?: { __typename?: 'RequestBudget', min: any, max: any } | null, artist: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, avatarImage?: string | null }>, artistPackage: Array<{ __typename?: 'ArtistPackage', id: string, packageName: string, amount: any, currency: CurrencyType, estimateDeliveryDays: number, description?: string | null, maxRevision: number }> }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type CouponsQueryVariables = Exact<{
  where?: InputMaybe<CouponFilterInput>;
}>;


export type CouponsQuery = { __typename?: 'QueryInitialization', coupons?: { __typename?: 'CouponsCollectionSegment', items?: Array<{ __typename?: 'Coupon', percentOff: any, id: string, name: string }> | null } | null };

export type EntitlementsQueryVariables = Exact<{
  where?: InputMaybe<EntitlementFilterInput>;
}>;


export type EntitlementsQuery = { __typename?: 'QueryInitialization', entitlements?: { __typename?: 'EntitlementsCollectionSegment', items?: Array<{ __typename?: 'Entitlement', id: string, name: string, isActive: boolean, subscriptionOverrides: Array<{ __typename?: 'EntitlementSubscriptionOverride', subscriptionCode: string }> }> | null } | null };

export type PlaylistsQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PlaylistsQuery = { __typename?: 'QueryInitialization', playlists?: { __typename?: 'PlaylistsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Playlist', id: string, name: string, coverImage?: string | null, isPublic: boolean, userId: string, checkPlaylistInFavorite: boolean }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean } } | null };

export type PlaylistsHomeQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PlaylistsHomeQuery = { __typename?: 'QueryInitialization', playlists?: { __typename?: 'PlaylistsCollectionSegment', items?: Array<{ __typename?: 'Playlist', id: string, name: string, coverImage?: string | null, userId: string, isPublic: boolean, checkPlaylistInFavorite: boolean }> | null } | null };

export type ReportQueriesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ReportFilterInput>;
}>;


export type ReportQueriesQuery = { __typename?: 'QueryInitialization', reports?: { __typename?: 'ReportsCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'Report', id: string, reportedUserId: string, reporterId: string, reportType: ReportType, status: ReportStatus, relatedContentType?: ReportRelatedContentType | null, relatedContentId?: string | null, assignedModeratorId?: string | null, actionTaken?: ReportAction | null, totalReportsCount: any, createdAt: any, description: string, userReporter: Array<{ __typename?: 'User', id: string, fullName: string, role: UserRole }>, userReported: Array<{ __typename?: 'User', id: string, fullName: string, role: UserRole }>, track: Array<{ __typename?: 'Track', id: string, name: string }>, comment: Array<{ __typename?: 'Comment', id: string, commentType: CommentType, content: string, targetId: string, user: Array<{ __typename?: 'User', id: string, fullName: string }>, listener: Array<{ __typename?: 'Listener', id: string, displayName: string }>, artist: Array<{ __typename?: 'Artist', id: string, stageName: string }>, track: Array<{ __typename?: 'Track', id: string, name: string }> }> }> | null } | null };

export type ReportDetailQueryQueryVariables = Exact<{
  where?: InputMaybe<ReportFilterInput>;
}>;


export type ReportDetailQueryQuery = { __typename?: 'QueryInitialization', reports?: { __typename?: 'ReportsCollectionSegment', items?: Array<{ __typename?: 'Report', id: string, reportedUserId: string, reporterId: string, reportType: ReportType, status: ReportStatus, relatedContentType?: ReportRelatedContentType | null, relatedContentId?: string | null, assignedModeratorId?: string | null, actionTaken?: ReportAction | null, totalReportsCount: any, createdAt: any, updatedAt?: any | null, description: string, priority: ReportPriority, evidences: Array<string>, note?: string | null, resolvedAt?: any | null, userReporter: Array<{ __typename?: 'User', id: string, fullName: string, role: UserRole }>, userReported: Array<{ __typename?: 'User', id: string, fullName: string, role: UserRole }>, track: Array<{ __typename?: 'Track', id: string, name: string }>, comment: Array<{ __typename?: 'Comment', id: string, commentType: CommentType, content: string, targetId: string, commenterId: string, user: Array<{ __typename?: 'User', id: string, fullName: string }>, listener: Array<{ __typename?: 'Listener', id: string, displayName: string }>, artist: Array<{ __typename?: 'Artist', id: string, stageName: string }>, track: Array<{ __typename?: 'Track', id: string, name: string }> }>, request: Array<{ __typename?: 'Request', id: string, title?: string | null, summary?: string | null }> }> | null } | null };

export type QueryModeratorReportsQueryVariables = Exact<{
  where?: InputMaybe<UserFilterInput>;
}>;


export type QueryModeratorReportsQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', items?: Array<{ __typename?: 'User', id: string, fullName: string }> | null } | null };

export type RequestHubThreadCommentsQueryVariables = Exact<{
  targetId: Scalars['String']['input'];
}>;


export type RequestHubThreadCommentsQuery = { __typename?: 'QueryInitialization', threadedComments: { __typename?: 'ThreadedCommentsResponse', totalThreads: number, threads: Array<{ __typename?: 'CommentThread', totalReplies: number, rootComment: { __typename?: 'CommentResponse', id: string, content: string, createdAt: any, replyCount: any, commenterId: string, commentType: CommentType, isDeleted: boolean, isEdited: boolean, depth: number, targetId: string, threadPath: Array<string>, threadUpdatedAt: any, totalRepliesCount: any, commenter: { __typename?: 'CommenterInfo', fullName: string, email: string, isVerified: boolean, role: UserRole, userId: string, listener?: { __typename?: 'ListenerInfo', avatarImage?: string | null, displayName: string, followerCount: any, id: string, isVerified: boolean } | null, artist?: { __typename?: 'ArtistInfo', avatarImage?: string | null, stageName: string, followerCount: any, id: string, isVerified: boolean, popularity: any } | null } }, replies: Array<{ __typename?: 'CommentResponse', id: string, content: string, createdAt: any, replyCount: any, commenterId: string, commentType: CommentType, isDeleted: boolean, isEdited: boolean, depth: number, targetId: string, threadPath: Array<string>, threadUpdatedAt: any, totalRepliesCount: any, commenter: { __typename?: 'CommenterInfo', fullName: string, email: string, isVerified: boolean, role: UserRole, userId: string, listener?: { __typename?: 'ListenerInfo', avatarImage?: string | null, displayName: string, followerCount: any, id: string, isVerified: boolean } | null, artist?: { __typename?: 'ArtistInfo', avatarImage?: string | null, stageName: string, followerCount: any, id: string, isVerified: boolean, popularity: any } | null } }> }> } };

export type RequestHubCommentThreadRepliesQueryVariables = Exact<{
  rootCommentId: Scalars['String']['input'];
}>;


export type RequestHubCommentThreadRepliesQuery = { __typename?: 'QueryInitialization', commentReplies: { __typename?: 'CommentRepliesResponse', replies: Array<{ __typename?: 'CommentResponse', id: string, content: string, createdAt: any, commenterId: string, commentType: CommentType, depth: number, isDeleted: boolean, isEdited: boolean, replyCount: any, targetId: string, threadPath: Array<string>, totalRepliesCount: any, threadUpdatedAt: any, commenter: { __typename?: 'CommenterInfo', fullName: string, email: string, isVerified: boolean, role: UserRole, userId: string, listener?: { __typename?: 'ListenerInfo', avatarImage?: string | null, displayName: string, followerCount: any, id: string, isVerified: boolean } | null, artist?: { __typename?: 'ArtistInfo', avatarImage?: string | null, stageName: string, followerCount: any, id: string, isVerified: boolean, popularity: any } | null } }> } };

export type RequestsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RequestFilterInput>;
}>;


export type RequestsQuery = { __typename?: 'QueryInitialization', requests?: { __typename?: 'RequestsCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'Request', id: string, requestUserId: string, title?: string | null, titleUnsigned?: string | null, summary?: string | null, summaryUnsigned?: string | null, detailDescription?: string | null, currency: CurrencyType, deadline: any, status: RequestStatus, type: RequestType, postCreatedTime?: any | null, requestCreatedTime?: any | null, updatedAt?: any | null, artistId?: string | null, packageId?: string | null, budget?: { __typename?: 'RequestBudget', min: any, max: any } | null, artist: Array<{ __typename?: 'Artist', id: string, stageName: string, avatarImage?: string | null }>, requestor: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string }> }> | null } | null };

export type RequestDetailByIdQueryVariables = Exact<{
  requestId: Scalars['String']['input'];
}>;


export type RequestDetailByIdQuery = { __typename?: 'QueryInitialization', requestDetailById?: { __typename?: 'Request', id: string, requestUserId: string, title?: string | null, titleUnsigned?: string | null, summary?: string | null, summaryUnsigned?: string | null, detailDescription?: string | null, currency: CurrencyType, deadline: any, status: RequestStatus, type: RequestType, postCreatedTime?: any | null, requestCreatedTime?: any | null, updatedAt?: any | null, artistId?: string | null, packageId?: string | null, budget?: { __typename?: 'RequestBudget', min: any, max: any } | null, artist: Array<{ __typename?: 'Artist', id: string, stageName: string, avatarImage?: string | null }>, requestor: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string }> } | null };

export type SearchRequestsQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  isIndividual: Scalars['Boolean']['input'];
}>;


export type SearchRequestsQuery = { __typename?: 'QueryInitialization', searchRequests?: { __typename?: 'SearchRequestsCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'Request', id: string, requestUserId: string, title?: string | null, titleUnsigned?: string | null, summary?: string | null, summaryUnsigned?: string | null, detailDescription?: string | null, currency: CurrencyType, deadline: any, status: RequestStatus, postCreatedTime?: any | null, updatedAt?: any | null, budget?: { __typename?: 'RequestBudget', min: any, max: any } | null }> | null } | null };

export type OwnRequestsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RequestFilterInput>;
}>;


export type OwnRequestsQuery = { __typename?: 'QueryInitialization', ownRequests?: { __typename?: 'OwnRequestsCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'Request', id: string, requestUserId: string, title?: string | null, titleUnsigned?: string | null, summary?: string | null, summaryUnsigned?: string | null, detailDescription?: string | null, currency: CurrencyType, deadline: any, status: RequestStatus, type: RequestType, postCreatedTime?: any | null, requestCreatedTime?: any | null, updatedAt?: any | null, artistId?: string | null, packageId?: string | null, budget?: { __typename?: 'RequestBudget', min: any, max: any } | null, artist: Array<{ __typename?: 'Artist', id: string, stageName: string, avatarImage?: string | null }>, requestor: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string }> }> | null } | null };

export type UsersForRequestsQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type UsersForRequestsQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', items?: Array<{ __typename?: 'User', id: string, fullName: string, gender: UserGender }> | null } | null };

export type GetListenerTransactionsQueryVariables = Exact<{
  where?: InputMaybe<PaymentTransactionFilterInput>;
  order?: InputMaybe<Array<PaymentTransactionSortInput> | PaymentTransactionSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetListenerTransactionsQuery = { __typename?: 'QueryInitialization', paymentTransactions?: { __typename?: 'PaymentTransactionsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'PaymentTransaction', id: string, amount: any, currency: string, createdAt: any, paymentStatus: PaymentTransactionStatus, status: TransactionStatus, stripePaymentMethod: Array<string>, stripePaymentId?: string | null, stripeCheckoutSessionId?: string | null }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetListenerInvoicesQueryVariables = Exact<{
  where?: InputMaybe<InvoiceFilterInput>;
  order?: InputMaybe<Array<InvoiceSortInput> | InvoiceSortInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetListenerInvoicesQuery = { __typename?: 'QueryInitialization', invoices?: { __typename?: 'InvoicesCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Invoice', id: string, amount: any, currency: string, email: string, to: string, from: string, paidAt: any, paymentTransactionId: string }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type ArtistPackagesQueryVariables = Exact<{
  artistId: Scalars['String']['input'];
}>;


export type ArtistPackagesQuery = { __typename?: 'QueryInitialization', artistPackages?: { __typename?: 'ArtistPackagesCollectionSegment', items?: Array<{ __typename?: 'ArtistPackage', id: string, artistId: string, amount: any, currency: CurrencyType, packageName: string, description?: string | null }> | null } | null };

export type TrackThreadCommentsQueryVariables = Exact<{
  targetId: Scalars['String']['input'];
}>;


export type TrackThreadCommentsQuery = { __typename?: 'QueryInitialization', threadedComments: { __typename?: 'ThreadedCommentsResponse', totalThreads: number, threads: Array<{ __typename?: 'CommentThread', totalReplies: number, rootComment: { __typename?: 'CommentResponse', id: string, content: string, createdAt: any, replyCount: any, commenterId: string, commentType: CommentType, isDeleted: boolean, isEdited: boolean, depth: number, targetId: string, threadPath: Array<string>, threadUpdatedAt: any, totalRepliesCount: any, commenter: { __typename?: 'CommenterInfo', fullName: string, email: string, isVerified: boolean, role: UserRole, userId: string, listener?: { __typename?: 'ListenerInfo', avatarImage?: string | null, displayName: string, followerCount: any, id: string, isVerified: boolean } | null, artist?: { __typename?: 'ArtistInfo', avatarImage?: string | null, stageName: string, followerCount: any, id: string, isVerified: boolean, popularity: any } | null } }, replies: Array<{ __typename?: 'CommentResponse', id: string, content: string, createdAt: any, replyCount: any, commenterId: string, commentType: CommentType, isDeleted: boolean, isEdited: boolean, depth: number, targetId: string, threadPath: Array<string>, threadUpdatedAt: any, totalRepliesCount: any, commenter: { __typename?: 'CommenterInfo', fullName: string, email: string, isVerified: boolean, role: UserRole, userId: string, listener?: { __typename?: 'ListenerInfo', avatarImage?: string | null, displayName: string, followerCount: any, id: string, isVerified: boolean } | null, artist?: { __typename?: 'ArtistInfo', avatarImage?: string | null, stageName: string, followerCount: any, id: string, isVerified: boolean, popularity: any } | null } }> }> } };

export type TrackCommentRepliesQueryVariables = Exact<{
  rootCommentId: Scalars['String']['input'];
}>;


export type TrackCommentRepliesQuery = { __typename?: 'QueryInitialization', commentReplies: { __typename?: 'CommentRepliesResponse', replies: Array<{ __typename?: 'CommentResponse', id: string, content: string, createdAt: any, commenterId: string, commentType: CommentType, depth: number, isDeleted: boolean, isEdited: boolean, replyCount: any, targetId: string, threadPath: Array<string>, totalRepliesCount: any, threadUpdatedAt: any, commenter: { __typename?: 'CommenterInfo', fullName: string, email: string, isVerified: boolean, role: UserRole, userId: string, listener?: { __typename?: 'ListenerInfo', avatarImage?: string | null, displayName: string, followerCount: any, id: string, isVerified: boolean } | null, artist?: { __typename?: 'ArtistInfo', avatarImage?: string | null, stageName: string, followerCount: any, id: string, isVerified: boolean, popularity: any } | null } }> } };

export type TrackListHomeQueryVariables = Exact<{
  take: Scalars['Int']['input'];
}>;


export type TrackListHomeQuery = { __typename?: 'QueryInitialization', tracks?: { __typename?: 'TracksCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Track', id: string, name: string, coverImage: string, mainArtistIds: Array<string>, checkTrackInFavorite: boolean, mainArtists?: { __typename?: 'MainArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, stageName: string }> | null } | null }> | null } | null };

export type TrackDetailQueryVariables = Exact<{
  trackId: Scalars['String']['input'];
}>;


export type TrackDetailQuery = { __typename?: 'QueryInitialization', tracks?: { __typename?: 'TracksCollectionSegment', items?: Array<{ __typename?: 'Track', id: string, name: string, coverImage: string, favoriteCount: any, streamCount: any, mainArtistIds: Array<string>, checkTrackInFavorite: boolean, mainArtists?: { __typename?: 'MainArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, stageName: string, followerCount: any, avatarImage?: string | null, userId: string, user: Array<{ __typename?: 'User', id: string, checkUserFollowing: boolean }> }> | null } | null }> | null } | null };

export type ListenerQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type ListenerQuery = { __typename?: 'QueryInitialization', listeners?: { __typename?: 'ListenersCollectionSegment', items?: Array<{ __typename?: 'Listener', userId: string, displayName: string, avatarImage?: string | null, user: Array<{ __typename?: 'User', fullName: string }> }> | null } | null };

export type ArtistQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type ArtistQuery = { __typename?: 'QueryInitialization', artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', userId: string, stageName: string, avatarImage?: string | null, followerCount: any, user: Array<{ __typename?: 'User', fullName: string, checkUserFollowing: boolean }> }> | null } | null };

export type ArtistListQueryVariables = Exact<{
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ArtistListQuery = { __typename?: 'QueryInitialization', artists?: { __typename?: 'ArtistsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, biography?: string | null, avatarImage?: string | null, identityCard: { __typename?: 'IdentityCard', nationality: string, placeOfResidence: { __typename?: 'Address', province?: string | null } }, user: Array<{ __typename?: 'User', fullName: string }> }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean } } | null };

export type ArtistDetailQueryVariables = Exact<{
  artistId: Scalars['String']['input'];
}>;


export type ArtistDetailQuery = { __typename?: 'QueryInitialization', artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', userId: string, stageName: string, avatarImage?: string | null, bannerImage?: string | null, biography?: string | null, email: string, followerCount: any, categoryIds: Array<string>, user: Array<{ __typename?: 'User', id: string, fullName: string, checkUserFollowing: boolean }>, categories?: { __typename?: 'CategoriesCollectionSegment', items?: Array<{ __typename?: 'Category', name: string }> | null } | null }> | null } | null };

export type GetListenerProfileQueryVariables = Exact<{
  where?: InputMaybe<ListenerFilterInput>;
}>;


export type GetListenerProfileQuery = { __typename?: 'QueryInitialization', listeners?: { __typename?: 'ListenersCollectionSegment', items?: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, email: string, avatarImage?: string | null, bannerImage?: string | null, createdAt: any, followerCount: any, followingCount: any, isVerified: boolean, user: Array<{ __typename?: 'User', birthDate: any, gender: UserGender }> }> | null } | null };

export type GetUserActiveSubscriptionQueryVariables = Exact<{
  where?: InputMaybe<UserSubscriptionFilterInput>;
  take?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUserActiveSubscriptionQuery = { __typename?: 'QueryInitialization', userSubscriptions?: { __typename?: 'UserSubscriptionsCollectionSegment', items?: Array<{ __typename?: 'UserSubscription', id: string, isActive: boolean, subscriptionId: string, periodEnd?: any | null, cancelAtEndOfPeriod: boolean, canceledAt?: any | null, subscription: Array<{ __typename?: 'Subscription', tier: SubscriptionTier, status: SubscriptionStatus, name: string }> }> | null } | null };

export type GetUserStripeAccountIdQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetUserStripeAccountIdQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', items?: Array<{ __typename?: 'User', role: UserRole, stripeAccountId?: string | null }> | null } | null };

export type ApprovalHistoriesListQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ApprovalHistoryFilterInput>;
}>;


export type ApprovalHistoriesListQuery = { __typename?: 'QueryInitialization', approvalHistories?: { __typename?: 'ApprovalHistoriesCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'ApprovalHistory', id: string, approvalType: ApprovalType, actionAt: any, action: HistoryActionType, notes?: string | null, snapshot: any, targetId: string, approvedBy: Array<{ __typename?: 'User', id: string, email: string, fullName: string, role: UserRole }> }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type ModeratorApprovalHistoryDetailQueryVariables = Exact<{
  where?: InputMaybe<ApprovalHistoryFilterInput>;
}>;


export type ModeratorApprovalHistoryDetailQuery = { __typename?: 'QueryInitialization', approvalHistories?: { __typename?: 'ApprovalHistoriesCollectionSegment', items?: Array<{ __typename?: 'ApprovalHistory', id: string, approvalType: ApprovalType, actionAt: any, action: HistoryActionType, notes?: string | null, snapshot: any, targetId: string, approvedBy: Array<{ __typename?: 'User', id: string, email: string, fullName: string, role: UserRole }> }> | null } | null };

export type PendingArtistRegistrationsListQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
}>;


export type PendingArtistRegistrationsListQuery = { __typename?: 'QueryInitialization', pendingArtistRegistrations: { __typename?: 'PaginatedDataOfPendingArtistRegistrationResponse', totalCount: number, items: Array<{ __typename?: 'PendingArtistRegistrationResponse', email: string, fullName: string, stageName: string, stageNameUnsigned: string, artistType: ArtistType, gender: UserGender, birthDate: any, phoneNumber: string, avatarImage?: string | null, id: string, requestedAt: any }> } };

export type PendingArtistRegistrationByIdQueryVariables = Exact<{
  artistRegistrationId: Scalars['String']['input'];
}>;


export type PendingArtistRegistrationByIdQuery = { __typename?: 'QueryInitialization', pendingArtistRegistrationById: { __typename?: 'PendingArtistRegistrationResponse', email: string, fullName: string, stageName: string, artistType: ArtistType, gender: UserGender, birthDate: any, phoneNumber: string, avatarImage?: string | null, id: string, requestedAt: any, timeToLive?: any | null, identityCardNumber: string, identityCardDateOfBirth: any, identityCardFullName: string, placeOfOrigin: string, placeOfResidence: string, frontImageUrl?: string | null, backImageUrl?: string | null, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, phoneNumber: string, isLeader: boolean, gender: UserGender }> } };

export type PendingTrackUploadRequestsListQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
}>;


export type PendingTrackUploadRequestsListQuery = { __typename?: 'QueryInitialization', pendingTrackUploadRequests: { __typename?: 'PaginatedDataOfCombinedUploadRequest', totalCount: number, items: Array<{ __typename?: 'CombinedUploadRequest', id: string, requestedAt: any, createdBy: string, track: { __typename?: 'TrackTempRequest', id: string, name: string, description?: string | null, type: TrackType, mainArtistIds: Array<string>, featuredArtistIds: Array<string>, coverImage: string, isExplicit: boolean, tags: Array<string>, categoryIds: Array<string>, lyrics?: string | null, previewVideo?: string | null, createdBy: string, requestedAt: any, releaseInfo: { __typename?: 'ReleaseInfo', isRelease: boolean, releaseDate?: any | null, releasedAt?: any | null, releaseStatus: ReleaseStatus }, legalDocuments: Array<{ __typename?: 'LegalDocument', name: string, documentUrl: string, documentType: DocumentType, note: string }> }, mainArtists?: { __typename?: 'MainArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, stageNameUnsigned: string, email: string, artistType: ArtistType, avatarImage?: string | null }> | null } | null, featuredArtists?: { __typename?: 'FeaturedArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, stageNameUnsigned: string, email: string }> | null } | null, recordingUsers?: { __typename?: 'RecordingUsersCollectionSegment', items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any }> | null } | null, workUsers?: { __typename?: 'WorkUsersCollectionSegment', items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any }> | null } | null, work: { __typename?: 'WorkTempRequest', id: string, description?: string | null }, recording: { __typename?: 'RecordingTempRequest', id: string, description?: string | null } }> } };

export type PendingTrackUploadRequestByIdQueryVariables = Exact<{
  uploadId: Scalars['String']['input'];
}>;


export type PendingTrackUploadRequestByIdQuery = { __typename?: 'QueryInitialization', pendingTrackUploadRequestById: { __typename?: 'CombinedUploadRequest', id: string, requestedAt: any, createdBy: string, track: { __typename?: 'TrackTempRequest', id: string, name: string, description?: string | null, type: TrackType, mainArtistIds: Array<string>, featuredArtistIds: Array<string>, categoryIds: Array<string>, tags: Array<string>, coverImage: string, previewVideo?: string | null, isExplicit: boolean, lyrics?: string | null, createdBy: string, requestedAt: any, releaseInfo: { __typename?: 'ReleaseInfo', isRelease: boolean, releaseDate?: any | null, releasedAt?: any | null, releaseStatus: ReleaseStatus }, legalDocuments: Array<{ __typename?: 'LegalDocument', name: string, documentUrl: string, documentType: DocumentType, note: string }> }, work: { __typename?: 'WorkTempRequest', id: string, description?: string | null, workSplits: Array<{ __typename?: 'CreateWorkSplitRequest', userId: string, artistRole: ArtistRole, percentage: any }> }, recording: { __typename?: 'RecordingTempRequest', id: string, description?: string | null, recordingSplitRequests: Array<{ __typename?: 'CreateRecordingSplitRequest', userId: string, artistRole: ArtistRole, percentage: any }> }, workUsers?: { __typename?: 'WorkUsersCollectionSegment', items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any, phoneNumber?: string | null, status: UserStatus }> | null } | null, recordingUsers?: { __typename?: 'RecordingUsersCollectionSegment', items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any, phoneNumber?: string | null, status: UserStatus }> | null } | null, mainArtists?: { __typename?: 'MainArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, stageNameUnsigned: string, email: string, artistType: ArtistType, avatarImage?: string | null }> | null } | null, featuredArtists?: { __typename?: 'FeaturedArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, stageNameUnsigned: string, email: string, artistType: ArtistType, avatarImage?: string | null }> | null } | null } };

export type UserCreatedByQueryVariables = Exact<{
  where: UserFilterInput;
}>;


export type UserCreatedByQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, role: UserRole }> | null } | null };

export type OriginalFileTrackUploadRequestQueryVariables = Exact<{
  trackId: Scalars['String']['input'];
}>;


export type OriginalFileTrackUploadRequestQuery = { __typename?: 'QueryInitialization', originalFileTrackUploadRequest: string };

export type RejectTrackUploadRequestMutationVariables = Exact<{
  uploadId: Scalars['String']['input'];
  reasonReject: Scalars['String']['input'];
}>;


export type RejectTrackUploadRequestMutation = { __typename?: 'MutationInitialization', rejectTrackUploadRequest: boolean };

export type ApproveTrackUploadRequestMutationVariables = Exact<{
  uploadId: Scalars['String']['input'];
}>;


export type ApproveTrackUploadRequestMutation = { __typename?: 'MutationInitialization', approveTrackUploadRequest: boolean };

export type GetCategoryQueryVariables = Exact<{
  where: CategoryFilterInput;
}>;


export type GetCategoryQuery = { __typename?: 'QueryInitialization', categories?: { __typename?: 'CategoriesCollectionSegment', items?: Array<{ __typename?: 'Category', id: string, name: string }> | null } | null };

export type ModeratorArtistDetailQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type ModeratorArtistDetailQuery = { __typename?: 'QueryInitialization', artists?: { __typename?: 'ArtistsCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, email: string, artistType: ArtistType, categoryIds: Array<string>, biography?: string | null, followerCount: any, popularity: any, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, createdAt: any, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, phoneNumber: string, isLeader: boolean, gender: UserGender }>, identityCard: { __typename?: 'IdentityCard', number: string, fullName: string, dateOfBirth: any, gender: UserGender, placeOfOrigin: string, nationality: string, validUntil?: any | null, placeOfResidence: { __typename?: 'Address', street?: string | null, ward?: string | null, province?: string | null, oldDistrict?: string | null, oldWard?: string | null, oldProvince?: string | null, addressLine?: string | null } }, user: Array<{ __typename?: 'User', fullName: string, role: UserRole, phoneNumber?: string | null }> }> | null } | null };

export type ModeratorListenerDetailQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type ModeratorListenerDetailQuery = { __typename?: 'QueryInitialization', listeners?: { __typename?: 'ListenersCollectionSegment', items?: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, email: string, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, followerCount: any, followingCount: any, createdAt: any, user: Array<{ __typename?: 'User', fullName: string, birthDate: any, gender: UserGender, phoneNumber?: string | null }> }> | null } | null };

export type ModeratorUsersListQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
}>;


export type ModeratorUsersListQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any, role: UserRole, phoneNumber?: string | null, status: UserStatus, isLinkedWithGoogle: boolean, stripeCustomerId?: string | null, stripeAccountId?: string | null, lastLoginAt?: any | null, createdAt: any, updatedAt?: any | null }> | null } | null, artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, email: string, artistType: ArtistType, categoryIds: Array<string>, biography?: string | null, followerCount: any, popularity: any, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, createdAt: any, updatedAt?: any | null, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, phoneNumber: string, isLeader: boolean, gender: UserGender }>, identityCard: { __typename?: 'IdentityCard', number: string, fullName: string, dateOfBirth: any, gender: UserGender, placeOfOrigin: string, nationality: string, validUntil?: any | null, placeOfResidence: { __typename?: 'Address', street?: string | null, ward?: string | null, province?: string | null, oldDistrict?: string | null, oldWard?: string | null, oldProvince?: string | null, addressLine?: string | null } } }> | null } | null, listeners?: { __typename?: 'ListenersCollectionSegment', items?: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, email: string, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, followerCount: any, followingCount: any, lastFollowers: Array<string>, lastFollowings: Array<string>, createdAt: any, updatedAt?: any | null }> | null } | null };

export type ModeratorUsersListAnalyticsQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
}>;


export type ModeratorUsersListAnalyticsQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any, role: UserRole, phoneNumber?: string | null, status: UserStatus, isLinkedWithGoogle: boolean, stripeCustomerId?: string | null, stripeAccountId?: string | null, lastLoginAt?: any | null, createdAt: any, updatedAt?: any | null }> | null } | null, artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, email: string, artistType: ArtistType, categoryIds: Array<string>, biography?: string | null, followerCount: any, popularity: any, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, createdAt: any, updatedAt?: any | null, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, phoneNumber: string, isLeader: boolean, gender: UserGender }>, identityCard: { __typename?: 'IdentityCard', number: string, fullName: string, dateOfBirth: any, gender: UserGender, placeOfOrigin: string, nationality: string, validUntil?: any | null, placeOfResidence: { __typename?: 'Address', street?: string | null, ward?: string | null, province?: string | null, oldDistrict?: string | null, oldWard?: string | null, oldProvince?: string | null, addressLine?: string | null } } }> | null } | null, listeners?: { __typename?: 'ListenersCollectionSegment', items?: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, email: string, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, followerCount: any, followingCount: any, lastFollowers: Array<string>, lastFollowings: Array<string>, createdAt: any, updatedAt?: any | null }> | null } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const UsersDocument = new TypedDocumentString(`
    query Users($where: UserFilterInput) {
  users(where: $where) {
    items {
      id
      email
      fullName
      gender
      birthDate
      role
      phoneNumber
      status
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<UsersQuery, UsersQueryVariables>;
export const AdminArtistsDetailDocument = new TypedDocumentString(`
    query AdminArtistsDetail($where: ArtistFilterInput) {
  artists(where: $where) {
    items {
      id
      userId
      stageName
      stageNameUnsigned
      email
      artistType
      members {
        fullName
        email
        phoneNumber
        isLeader
        gender
      }
      biography
      categoryIds
      followerCount
      popularity
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      identityCard {
        number
        fullName
        dateOfBirth
        gender
        placeOfOrigin
        nationality
        frontImage
        backImage
        validUntil
        placeOfResidence {
          street
          ward
          province
          oldDistrict
          oldWard
          oldProvince
          addressLine
        }
      }
      createdAt
      user {
        email
        id
        fullName
        gender
        birthDate
        role
        status
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AdminArtistsDetailQuery, AdminArtistsDetailQueryVariables>;
export const AdminListenerDetailDocument = new TypedDocumentString(`
    query AdminListenerDetail($where: ListenerFilterInput) {
  listeners(where: $where) {
    items {
      id
      userId
      displayName
      email
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      followerCount
      followingCount
      createdAt
      updatedAt
      user {
        gender
        birthDate
        role
        fullName
        status
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AdminListenerDetailQuery, AdminListenerDetailQueryVariables>;
export const UsersListDocument = new TypedDocumentString(`
    query UsersList($skip: Int, $take: Int, $where: UserFilterInput) {
  users(skip: $skip, take: $take, where: $where) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      email
      fullName
      gender
      birthDate
      role
      phoneNumber
      status
      isLinkedWithGoogle
      stripeCustomerId
      stripeAccountId
      lastLoginAt
      createdAt
      updatedAt
    }
  }
  artists {
    items {
      id
      userId
      stageName
      email
      artistType
      categoryIds
      biography
      followerCount
      popularity
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      createdAt
      updatedAt
      members {
        fullName
        email
        phoneNumber
        isLeader
        gender
      }
      identityCard {
        number
        fullName
        dateOfBirth
        gender
        placeOfOrigin
        nationality
        validUntil
        placeOfResidence {
          street
          ward
          province
          oldDistrict
          oldWard
          oldProvince
          addressLine
        }
      }
    }
  }
  listeners {
    items {
      id
      userId
      displayName
      email
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      followerCount
      followingCount
      lastFollowers
      lastFollowings
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<UsersListQuery, UsersListQueryVariables>;
export const UsersStatisticDocument = new TypedDocumentString(`
    query UsersStatistic($where: UserFilterInput) {
  users(where: $where) {
    totalCount
    items {
      id
      email
      fullName
      phoneNumber
      status
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<UsersStatisticQuery, UsersStatisticQueryVariables>;
export const CreateModeratorDocument = new TypedDocumentString(`
    mutation CreateModerator($createModeratorRequest: CreateModeratorRequestInput!) {
  createModerator(createModeratorRequest: $createModeratorRequest)
}
    `) as unknown as TypedDocumentString<CreateModeratorMutation, CreateModeratorMutationVariables>;
export const BanUserDocument = new TypedDocumentString(`
    mutation BanUser($targetUserId: String!) {
  banUser(targetUserId: $targetUserId)
}
    `) as unknown as TypedDocumentString<BanUserMutation, BanUserMutationVariables>;
export const UnbanUserDocument = new TypedDocumentString(`
    mutation UnbanUser($targetUserId: String!) {
  unbanUser(targetUserId: $targetUserId)
}
    `) as unknown as TypedDocumentString<UnbanUserMutation, UnbanUserMutationVariables>;
export const PlaylistBriefDocument = new TypedDocumentString(`
    query PlaylistBrief($userId: String!) {
  playlists(where: {userId: {eq: $userId}}) {
    items {
      id
      name
      coverImage
      isPublic
    }
  }
}
    `) as unknown as TypedDocumentString<PlaylistBriefQuery, PlaylistBriefQueryVariables>;
export const CheckTrackInPlaylistDocument = new TypedDocumentString(`
    query CheckTrackInPlaylist($trackId: String!) {
  playlists(where: {tracksInfo: {some: {trackId: {eq: $trackId}}}}) {
    items {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<CheckTrackInPlaylistQuery, CheckTrackInPlaylistQueryVariables>;
export const PlaylistDetailDocument = new TypedDocumentString(`
    query PlaylistDetail($playlistId: String!) {
  playlists(where: {id: {eq: $playlistId}}) {
    items {
      id
      name
      coverImage
      description
      isPublic
      user {
        id
        fullName
      }
      userId
      tracks {
        items {
          id
        }
        totalCount
      }
      tracksInfo {
        trackId
      }
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<PlaylistDetailQuery, PlaylistDetailQueryVariables>;
export const PlaylistDetailTrackListDocument = new TypedDocumentString(`
    query PlaylistDetailTrackList($playlistId: String!) {
  playlists(where: {id: {eq: $playlistId}}) {
    items {
      id
      tracks {
        items {
          id
          name
          coverImage
          isExplicit
          mainArtistIds
          mainArtists {
            items {
              stageName
            }
          }
        }
      }
      tracksInfo {
        trackId
        addedTime
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PlaylistDetailTrackListQuery, PlaylistDetailTrackListQueryVariables>;
export const SearchArtistsDocument = new TypedDocumentString(`
    query SearchArtists($skip: Int, $take: Int, $stageName: String!) {
  searchArtists(skip: $skip, take: $take, stageName: $stageName) {
    totalCount
    items {
      id
      userId
      stageName
      stageNameUnsigned
      email
      artistType
      avatarImage
      followerCount
      user {
        fullName
        role
      }
    }
  }
}
    `) as unknown as TypedDocumentString<SearchArtistsQuery, SearchArtistsQueryVariables>;
export const SearchListenersDocument = new TypedDocumentString(`
    query SearchListeners($skip: Int, $take: Int, $displayName: String!) {
  searchListeners(skip: $skip, take: $take, displayName: $displayName) {
    totalCount
    items {
      id
      userId
      displayName
      displayNameUnsigned
      email
      avatarImage
      followerCount
      followingCount
      user {
        fullName
        role
      }
    }
  }
}
    `) as unknown as TypedDocumentString<SearchListenersQuery, SearchListenersQueryVariables>;
export const SearchTracksDocument = new TypedDocumentString(`
    query SearchTracks($skip: Int, $take: Int, $name: String!) {
  searchTracks(skip: $skip, take: $take, name: $name) {
    totalCount
    items {
      id
      name
      description
      nameUnsigned
      type
      categoryIds
      mainArtistIds
      createdAt
      mainArtists {
        items {
          id
          userId
          stageName
          artistType
        }
      }
      coverImage
      restriction {
        type
      }
      checkTrackInFavorite
    }
  }
}
    `) as unknown as TypedDocumentString<SearchTracksQuery, SearchTracksQueryVariables>;
export const SearchPlaylistsDocument = new TypedDocumentString(`
    query SearchPlaylists($skip: Int, $take: Int, $name: String!) {
  searchPlaylists(skip: $skip, take: $take, name: $name) {
    totalCount
    items {
      id
      userId
      name
      nameUnsigned
      tracksInfo {
        trackId
        addedTime
      }
      coverImage
      isPublic
      user {
        id
        fullName
      }
      checkPlaylistInFavorite
    }
  }
}
    `) as unknown as TypedDocumentString<SearchPlaylistsQuery, SearchPlaylistsQueryVariables>;
export const CreateSubscriptionDocument = new TypedDocumentString(`
    mutation CreateSubscription($createSubscriptionRequest: CreateSubscriptionRequestInput!) {
  createSubscription(createSubscriptionRequest: $createSubscriptionRequest)
}
    `) as unknown as TypedDocumentString<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>;
export const CreateSubscriptionPlanDocument = new TypedDocumentString(`
    mutation CreateSubscriptionPlan($createSubScriptionPlanRequest: CreateSubScriptionPlanRequestInput!) {
  createSubscriptionPlan(
    createSubScriptionPlanRequest: $createSubScriptionPlanRequest
  )
}
    `) as unknown as TypedDocumentString<CreateSubscriptionPlanMutation, CreateSubscriptionPlanMutationVariables>;
export const ActivateSubscriptionDocument = new TypedDocumentString(`
    mutation ActivateSubscription($subscriptionId: String!) {
  activateSubscription(subscriptionId: $subscriptionId)
}
    `) as unknown as TypedDocumentString<ActivateSubscriptionMutation, ActivateSubscriptionMutationVariables>;
export const UpdateSubscriptionPlanDocument = new TypedDocumentString(`
    mutation UpdateSubscriptionPlan($updateSubscriptionPlanRequest: UpdateSubscriptionPlanRequestInput!) {
  updateSubscriptionPlan(
    updateSubscriptionPlanRequest: $updateSubscriptionPlanRequest
  )
}
    `) as unknown as TypedDocumentString<UpdateSubscriptionPlanMutation, UpdateSubscriptionPlanMutationVariables>;
export const CreateArtistPackageDocument = new TypedDocumentString(`
    mutation CreateArtistPackage($createRequest: CreateArtistPackageRequestInput!) {
  createArtistPackage(createRequest: $createRequest)
}
    `) as unknown as TypedDocumentString<CreateArtistPackageMutation, CreateArtistPackageMutationVariables>;
export const ChangeArtistPackageStatusDocument = new TypedDocumentString(`
    mutation ChangeArtistPackageStatus($updateStatusRequest: UpdateStatusArtistPackageRequestInput!) {
  changeArtistPackageStatus(updateStatusRequest: $updateStatusRequest)
}
    `) as unknown as TypedDocumentString<ChangeArtistPackageStatusMutation, ChangeArtistPackageStatusMutationVariables>;
export const UpdateArtistPackageDocument = new TypedDocumentString(`
    mutation UpdateArtistPackage($updateRequest: UpdateArtistPackageRequestInput!) {
  updateArtistPackage(updateRequest: $updateRequest)
}
    `) as unknown as TypedDocumentString<UpdateArtistPackageMutation, UpdateArtistPackageMutationVariables>;
export const DeleteArtistPackageDocument = new TypedDocumentString(`
    mutation DeleteArtistPackage($artistPackageId: String!) {
  deleteArtistPackage(artistPackageId: $artistPackageId)
}
    `) as unknown as TypedDocumentString<DeleteArtistPackageMutation, DeleteArtistPackageMutationVariables>;
export const ChangeRequestStatusDocument = new TypedDocumentString(`
    mutation ChangeRequestStatus($request: ChangeStatusRequestInput!) {
  changeRequestStatus(request: $request)
}
    `) as unknown as TypedDocumentString<ChangeRequestStatusMutation, ChangeRequestStatusMutationVariables>;
export const UploadTrackDocument = new TypedDocumentString(`
    mutation UploadTrack($file: Upload!, $createTrackRequest: CreateTrackRequestInput!, $createWorkRequest: CreateWorkRequestInput!, $createRecordingRequest: CreateRecordingRequestInput!) {
  uploadTrack(
    file: $file
    createTrackRequest: $createTrackRequest
    createWorkRequest: $createWorkRequest
    createRecordingRequest: $createRecordingRequest
  )
}
    `) as unknown as TypedDocumentString<UploadTrackMutation, UploadTrackMutationVariables>;
export const UpdateArtistProfileDocument = new TypedDocumentString(`
    mutation UpdateArtistProfile($updateArtistRequest: UpdateArtistRequestInput!) {
  updateArtistProfile(updateArtistRequest: $updateArtistRequest)
}
    `) as unknown as TypedDocumentString<UpdateArtistProfileMutation, UpdateArtistProfileMutationVariables>;
export const AddConversationGeneralDocument = new TypedDocumentString(`
    mutation AddConversationGeneral($otherUserId: String!) {
  addConversationGeneral(otherUserId: $otherUserId)
}
    `) as unknown as TypedDocumentString<AddConversationGeneralMutation, AddConversationGeneralMutationVariables>;
export const AddConversationFromRequestHubDocument = new TypedDocumentString(`
    mutation AddConversationFromRequestHub($createConversationRequestInput: CreateConversationRequestInput!) {
  addConversationFromRequestHub(request: $createConversationRequestInput)
}
    `) as unknown as TypedDocumentString<AddConversationFromRequestHubMutation, AddConversationFromRequestHubMutationVariables>;
export const PlaylistFavoriteDocument = new TypedDocumentString(`
    mutation PlaylistFavorite($playlistId: String!, $isAdding: Boolean!) {
  addToFavoritePlaylist(playlistId: $playlistId, isAdding: $isAdding)
}
    `) as unknown as TypedDocumentString<PlaylistFavoriteMutation, PlaylistFavoriteMutationVariables>;
export const CreatePlaylistDocument = new TypedDocumentString(`
    mutation createPlaylist($createPlaylistRequest: CreatePlaylistRequestInput!) {
  createPlaylist(createPlaylistRequest: $createPlaylistRequest)
}
    `) as unknown as TypedDocumentString<CreatePlaylistMutation, CreatePlaylistMutationVariables>;
export const UpdatePlaylistDocument = new TypedDocumentString(`
    mutation UpdatePlaylist($updatePlaylistRequest: UpdatePlaylistRequestInput!) {
  updatePlaylist(updatePlaylistRequest: $updatePlaylistRequest)
}
    `) as unknown as TypedDocumentString<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>;
export const DeletePlaylistDocument = new TypedDocumentString(`
    mutation deletePlaylist($playlistId: String!) {
  deletePlaylist(playlistId: $playlistId)
}
    `) as unknown as TypedDocumentString<DeletePlaylistMutation, DeletePlaylistMutationVariables>;
export const AddToPlaylistDocument = new TypedDocumentString(`
    mutation AddToPlaylist($addToPlaylistRequest: AddToPlaylistRequestInput!) {
  addToPlaylist(addToPlaylistRequest: $addToPlaylistRequest)
}
    `) as unknown as TypedDocumentString<AddToPlaylistMutation, AddToPlaylistMutationVariables>;
export const RemoveFromPlaylistDocument = new TypedDocumentString(`
    mutation RemoveFromPlaylist($removeFromPlaylistRequest: RemoveFromPlaylistRequestInput!) {
  removeFromPlaylist(removeFromPlaylistRequest: $removeFromPlaylistRequest)
}
    `) as unknown as TypedDocumentString<RemoveFromPlaylistMutation, RemoveFromPlaylistMutationVariables>;
export const ReportMutationDocument = new TypedDocumentString(`
    mutation ReportMutation($request: CreateReportRequestInput!) {
  createReport(request: $request)
}
    `) as unknown as TypedDocumentString<ReportMutationMutation, ReportMutationMutationVariables>;
export const ProcessReportDocument = new TypedDocumentString(`
    mutation ProcessReport($request: ProcessReportRequestInput!) {
  processReport(request: $request)
}
    `) as unknown as TypedDocumentString<ProcessReportMutation, ProcessReportMutationVariables>;
export const AssignReportToModeratorDocument = new TypedDocumentString(`
    mutation AssignReportToModerator($reportId: String!, $moderatorId: String!) {
  assignReportToModerator(reportId: $reportId, moderatorId: $moderatorId)
}
    `) as unknown as TypedDocumentString<AssignReportToModeratorMutation, AssignReportToModeratorMutationVariables>;
export const UpdateRequestHubCommentDocument = new TypedDocumentString(`
    mutation UpdateRequestHubComment($commentId: String!, $content: String!) {
  updateComment(request: {commentId: $commentId, content: $content})
}
    `) as unknown as TypedDocumentString<UpdateRequestHubCommentMutation, UpdateRequestHubCommentMutationVariables>;
export const DeleteRequestHubCommentDocument = new TypedDocumentString(`
    mutation DeleteRequestHubComment($commentId: String!) {
  deleteComment(request: {commentId: $commentId})
}
    `) as unknown as TypedDocumentString<DeleteRequestHubCommentMutation, DeleteRequestHubCommentMutationVariables>;
export const CreateRequestHubCommentDocument = new TypedDocumentString(`
    mutation CreateRequestHubComment($targetId: String!, $commentType: CommentType!, $content: String!, $parentCommentId: String) {
  createComment(
    request: {targetId: $targetId, commentType: $commentType, content: $content, parentCommentId: $parentCommentId}
  )
}
    `) as unknown as TypedDocumentString<CreateRequestHubCommentMutation, CreateRequestHubCommentMutationVariables>;
export const CreatePublicRequestDocument = new TypedDocumentString(`
    mutation CreatePublicRequest($request: RequestCreatingRequestInput!) {
  createPublicRequest(request: $request)
}
    `) as unknown as TypedDocumentString<CreatePublicRequestMutation, CreatePublicRequestMutationVariables>;
export const UpdatePublicRequestDocument = new TypedDocumentString(`
    mutation UpdatePublicRequest($request: RequestUpdatingRequestInput!) {
  updatePublicRequest(request: $request)
}
    `) as unknown as TypedDocumentString<UpdatePublicRequestMutation, UpdatePublicRequestMutationVariables>;
export const BlockPublicRequestDocument = new TypedDocumentString(`
    mutation BlockPublicRequest($requestId: String!) {
  blockPublicRequest(requestId: $requestId)
}
    `) as unknown as TypedDocumentString<BlockPublicRequestMutation, BlockPublicRequestMutationVariables>;
export const CreateExpressConnectedAccountDocument = new TypedDocumentString(`
    mutation CreateExpressConnectedAccount($returnUrl: String!, $refreshUrl: String!) {
  createExpressConnectedAccount(returnUrl: $returnUrl, refreshUrl: $refreshUrl) {
    url
  }
}
    `) as unknown as TypedDocumentString<CreateExpressConnectedAccountMutation, CreateExpressConnectedAccountMutationVariables>;
export const SubscriptionCreateCheckoutSessionDocument = new TypedDocumentString(`
    mutation SubscriptionCreateCheckoutSession($createSubscriptionCheckoutSessionInput: CreateSubscriptionCheckoutSessionRequestInput!) {
  createSubscriptionCheckoutSession(
    createCheckoutSessionRequest: $createSubscriptionCheckoutSessionInput
  ) {
    id
    url
  }
}
    `) as unknown as TypedDocumentString<SubscriptionCreateCheckoutSessionMutation, SubscriptionCreateCheckoutSessionMutationVariables>;
export const CancelSubscriptionAtPeriodEndDocument = new TypedDocumentString(`
    mutation CancelSubscriptionAtPeriodEnd {
  cancelSubscriptionAtPeriodEnd
}
    `) as unknown as TypedDocumentString<CancelSubscriptionAtPeriodEndMutation, CancelSubscriptionAtPeriodEndMutationVariables>;
export const ResumeSubscriptionDocument = new TypedDocumentString(`
    mutation ResumeSubscription {
  resumeSubscription
}
    `) as unknown as TypedDocumentString<ResumeSubscriptionMutation, ResumeSubscriptionMutationVariables>;
export const UpdateTrackCommentDocument = new TypedDocumentString(`
    mutation UpdateTrackComment($commentId: String!, $content: String!) {
  updateComment(request: {commentId: $commentId, content: $content})
}
    `) as unknown as TypedDocumentString<UpdateTrackCommentMutation, UpdateTrackCommentMutationVariables>;
export const DeleteTrackCommentDocument = new TypedDocumentString(`
    mutation DeleteTrackComment($commentId: String!) {
  deleteComment(request: {commentId: $commentId})
}
    `) as unknown as TypedDocumentString<DeleteTrackCommentMutation, DeleteTrackCommentMutationVariables>;
export const CreateTrackCommentDocument = new TypedDocumentString(`
    mutation CreateTrackComment($request: CreateCommentRequestInput!) {
  createComment(request: $request)
}
    `) as unknown as TypedDocumentString<CreateTrackCommentMutation, CreateTrackCommentMutationVariables>;
export const FavoriteTrackDocument = new TypedDocumentString(`
    mutation FavoriteTrack($trackId: String!, $isAdding: Boolean!) {
  addToFavoriteTrack(trackId: $trackId, isAdding: $isAdding)
}
    `) as unknown as TypedDocumentString<FavoriteTrackMutation, FavoriteTrackMutationVariables>;
export const FollowUserDocument = new TypedDocumentString(`
    mutation FollowUser($targetId: String!) {
  followUser(request: {targetId: $targetId})
}
    `) as unknown as TypedDocumentString<FollowUserMutation, FollowUserMutationVariables>;
export const UnfollowUserDocument = new TypedDocumentString(`
    mutation UnfollowUser($targetId: String!) {
  unfollowUser(request: {targetId: $targetId})
}
    `) as unknown as TypedDocumentString<UnfollowUserMutation, UnfollowUserMutationVariables>;
export const UpdateListenerProfileDocument = new TypedDocumentString(`
    mutation UpdateListenerProfile($updateListenerRequest: UpdateListenerRequestInput!) {
  updateListenerProfile(updateListenerRequest: $updateListenerRequest)
}
    `) as unknown as TypedDocumentString<UpdateListenerProfileMutation, UpdateListenerProfileMutationVariables>;
export const ApproveArtistRegistrationDocument = new TypedDocumentString(`
    mutation ApproveArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {
  approveArtistRegistration(request: $request)
}
    `) as unknown as TypedDocumentString<ApproveArtistRegistrationMutation, ApproveArtistRegistrationMutationVariables>;
export const RejectArtistRegistrationDocument = new TypedDocumentString(`
    mutation RejectArtistRegistration($request: ArtistRegistrationApprovalRequestInput!) {
  rejectArtistRegistration(request: $request)
}
    `) as unknown as TypedDocumentString<RejectArtistRegistrationMutation, RejectArtistRegistrationMutationVariables>;
export const SubscriptionsDocument = new TypedDocumentString(`
    query Subscriptions($where: SubscriptionFilterInput!) {
  subscriptions(where: $where, order: {version: DESC}) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      name
      description
      code
      status
      createdAt
      tier
      amount
    }
    totalCount
  }
}
    `) as unknown as TypedDocumentString<SubscriptionsQuery, SubscriptionsQueryVariables>;
export const SubscriptionsDetailDocument = new TypedDocumentString(`
    query SubscriptionsDetail($where: SubscriptionFilterInput) {
  subscriptions(where: $where) {
    items {
      id
      name
      description
      code
      version
      amount
      currency
      tier
      status
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<SubscriptionsDetailQuery, SubscriptionsDetailQueryVariables>;
export const SubscriptionPlansDocument = new TypedDocumentString(`
    query SubscriptionPlans($skip: Int, $take: Int, $where: SubscriptionPlanFilterInput) {
  subscriptionPlans(skip: $skip, take: $take, where: $where) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      subscriptionId
      stripeProductId
      stripeProductActive
      stripeProductName
      stripeProductImages
      stripeProductType
      stripeProductMetadata {
        key
        value
      }
      subscriptionPlanPrices {
        stripePriceId
        stripePriceActive
        stripePriceUnitAmount
        stripePriceCurrency
        stripePriceLookupKey
        interval
        intervalCount
      }
      subscription {
        id
        name
        description
        code
        version
        amount
        currency
        tier
        status
        createdAt
        updatedAt
      }
    }
    totalCount
  }
}
    `) as unknown as TypedDocumentString<SubscriptionPlansQuery, SubscriptionPlansQueryVariables>;
export const ArtistPackagesServiceDocument = new TypedDocumentString(`
    query ArtistPackagesService($skip: Int, $take: Int, $where: ArtistPackageFilterInput) {
  artistPackages(skip: $skip, take: $take, where: $where) {
    totalCount
    items {
      id
      packageName
      amount
      currency
      estimateDeliveryDays
      description
      maxRevision
      serviceDetails {
        key
        value
      }
      updatedAt
      createdAt
      artistId
      status
      isDelete
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<ArtistPackagesServiceQuery, ArtistPackagesServiceQueryVariables>;
export const ArtistPackagesDetailDocument = new TypedDocumentString(`
    query ArtistPackagesDetail($where: ArtistPackageFilterInput) {
  artistPackages(where: $where) {
    items {
      id
      packageName
      amount
      currency
      estimateDeliveryDays
      description
      maxRevision
      serviceDetails {
        key
        value
      }
      status
      isDelete
      createdAt
      updatedAt
      artistId
    }
  }
}
    `) as unknown as TypedDocumentString<ArtistPackagesDetailQuery, ArtistPackagesDetailQueryVariables>;
export const CategoriesDocument = new TypedDocumentString(`
    query Categories {
  categories {
    items {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<CategoriesQuery, CategoriesQueryVariables>;
export const GetPendingArtistRequestDocument = new TypedDocumentString(`
    query GetPendingArtistRequest($skip: Int!, $take: Int!, $where: RequestFilterInput) {
  requests(skip: $skip, take: $take, where: $where) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      requestUserId
      artistId
      packageId
      title
      requestCreatedTime
      type
      status
      budget {
        min
        max
      }
      postCreatedTime
      currency
      requestor {
        id
        userId
        displayName
      }
      artist {
        id
        stageName
        userId
      }
      artistPackage {
        artistId
        id
        packageName
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetPendingArtistRequestQuery, GetPendingArtistRequestQueryVariables>;
export const RequestPendingDetailByIdDocument = new TypedDocumentString(`
    query RequestPendingDetailById($where: RequestFilterInput) {
  requests(where: $where) {
    totalCount
    items {
      id
      requestUserId
      artistId
      packageId
      title
      titleUnsigned
      summary
      summaryUnsigned
      detailDescription
      requirements
      postCreatedTime
      updatedAt
      type
      currency
      deadline
      status
      requestCreatedTime
      notes
      requestor {
        id
        userId
        displayName
        email
      }
      artist {
        id
        userId
        stageName
      }
      artistPackage {
        id
        artistId
        packageName
        amount
        currency
        maxRevision
        estimateDeliveryDays
      }
      budget {
        min
        max
      }
    }
  }
}
    `) as unknown as TypedDocumentString<RequestPendingDetailByIdQuery, RequestPendingDetailByIdQueryVariables>;
export const GetArtistTransactionsDocument = new TypedDocumentString(`
    query GetArtistTransactions($where: PaymentTransactionFilterInput, $order: [PaymentTransactionSortInput!], $skip: Int, $take: Int) {
  paymentTransactions(where: $where, order: $order, skip: $skip, take: $take) {
    totalCount
    items {
      id
      amount
      currency
      createdAt
      paymentStatus
      status
      stripePaymentMethod
      stripePaymentId
      stripeCheckoutSessionId
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<GetArtistTransactionsQuery, GetArtistTransactionsQueryVariables>;
export const GetArtistPayoutsDocument = new TypedDocumentString(`
    query GetArtistPayouts($where: PayoutTransactionFilterInput, $order: [PayoutTransactionSortInput!], $skip: Int, $take: Int) {
  payoutTransactions(where: $where, order: $order, skip: $skip, take: $take) {
    totalCount
    items {
      id
      amount
      currency
      createdAt
      status
      method
      description
      destinationAccountId
      stripePayoutId
      stripeTransferId
      royaltyReportId
      userId
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<GetArtistPayoutsQuery, GetArtistPayoutsQueryVariables>;
export const GetArtistInvoicesDocument = new TypedDocumentString(`
    query GetArtistInvoices($where: InvoiceFilterInput, $order: [InvoiceSortInput!], $skip: Int, $take: Int) {
  invoices(where: $where, order: $order, skip: $skip, take: $take) {
    totalCount
    items {
      id
      amount
      currency
      email
      to
      from
      paidAt
      paymentTransactionId
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<GetArtistInvoicesQuery, GetArtistInvoicesQueryVariables>;
export const TracksWithFiltersDocument = new TypedDocumentString(`
    query TracksWithFilters($skip: Int!, $take: Int!, $where: TrackFilterInput, $order: [TrackSortInput!]) {
  tracks(skip: $skip, take: $take, where: $where, order: $order) {
    totalCount
    items {
      id
      name
      mainArtistIds
      streamCount
      favoriteCount
      coverImage
      isExplicit
      releaseInfo {
        releaseDate
        isRelease
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<TracksWithFiltersQuery, TracksWithFiltersQueryVariables>;
export const TrackUploadArtistListDocument = new TypedDocumentString(`
    query TrackUploadArtistList {
  artists(where: {isVisible: {eq: true}}, take: 50) {
    items {
      id
      userId
      stageName
      user {
        stripeAccountId
      }
    }
  }
}
    `) as unknown as TypedDocumentString<TrackUploadArtistListQuery, TrackUploadArtistListQueryVariables>;
export const GetArtistProfileDocument = new TypedDocumentString(`
    query GetArtistProfile($where: ArtistFilterInput, $take: Int, $skip: Int) {
  artists(where: $where, take: $take, skip: $skip) {
    items {
      id
      userId
      stageName
      email
      artistType
      avatarImage
      bannerImage
      biography
      members {
        fullName
        email
        gender
        isLeader
        phoneNumber
      }
      isVerified
      createdAt
      user {
        status
      }
      identityCard {
        number
        fullName
        dateOfBirth
        gender
        placeOfOrigin
        validUntil
        placeOfResidence {
          addressLine
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetArtistProfileQuery, GetArtistProfileQueryVariables>;
export const ConversationsDocument = new TypedDocumentString(`
    query Conversations($where: ConversationFilterInput) {
  conversations(where: $where) {
    items {
      id
      userIds
      ownerProfileConversation {
        avatar
        nickname
      }
      otherProfileConversation {
        avatar
        nickname
      }
      lastMessage {
        text
        senderId
        sentAt
        isReadBy
      }
    }
    totalCount
  }
}
    `) as unknown as TypedDocumentString<ConversationsQuery, ConversationsQueryVariables>;
export const MessagesDocument = new TypedDocumentString(`
    query Messages($where: MessageFilterInput) {
  messages(where: $where, last: 10) {
    edges {
      cursor
      node {
        id
        conversationId
        senderId
        receiverId
        isRead
        text
        sentAt
        deletedForIds
        senderProfileMessages {
          avatar
          nickname
        }
      }
    }
    totalCount
  }
}
    `) as unknown as TypedDocumentString<MessagesQuery, MessagesQueryVariables>;
export const FollowersDocument = new TypedDocumentString(`
    query Followers($userId: String, $artistId: String) {
  followers(userId: $userId, artistId: $artistId) {
    totalCount
  }
}
    `) as unknown as TypedDocumentString<FollowersQuery, FollowersQueryVariables>;
export const FollowingsDocument = new TypedDocumentString(`
    query Followings($userId: String, $artistId: String) {
  followings(userId: $userId, artistId: $artistId) {
    totalCount
  }
}
    `) as unknown as TypedDocumentString<FollowingsQuery, FollowingsQueryVariables>;
export const ListenerRequestsDocument = new TypedDocumentString(`
    query ListenerRequests($skip: Int, $take: Int, $where: RequestFilterInput) {
  requests(skip: $skip, take: $take, where: $where) {
    totalCount
    items {
      id
      requestUserId
      artistId
      packageId
      title
      summary
      detailDescription
      requirements
      type
      currency
      deadline
      status
      requestCreatedTime
      updatedAt
      notes
      budget {
        min
        max
      }
      artist {
        id
        userId
        stageName
        avatarImage
      }
      artistPackage {
        id
        packageName
        description
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<ListenerRequestsQuery, ListenerRequestsQueryVariables>;
export const ListenerRequestByIdDocument = new TypedDocumentString(`
    query ListenerRequestById($skip: Int, $take: Int, $where: RequestFilterInput) {
  requests(skip: $skip, take: $take, where: $where) {
    totalCount
    items {
      id
      requestUserId
      artistId
      packageId
      title
      summary
      detailDescription
      requirements
      type
      currency
      deadline
      status
      requestCreatedTime
      updatedAt
      notes
      budget {
        min
        max
      }
      artist {
        id
        userId
        stageName
        avatarImage
      }
      artistPackage {
        id
        packageName
        amount
        currency
        estimateDeliveryDays
        description
        maxRevision
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<ListenerRequestByIdQuery, ListenerRequestByIdQueryVariables>;
export const CouponsDocument = new TypedDocumentString(`
    query Coupons($where: CouponFilterInput) {
  coupons(where: $where) {
    items {
      percentOff
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<CouponsQuery, CouponsQueryVariables>;
export const EntitlementsDocument = new TypedDocumentString(`
    query Entitlements($where: EntitlementFilterInput) {
  entitlements(where: $where) {
    items {
      id
      name
      subscriptionOverrides {
        subscriptionCode
      }
      isActive
    }
  }
}
    `) as unknown as TypedDocumentString<EntitlementsQuery, EntitlementsQueryVariables>;
export const PlaylistsDocument = new TypedDocumentString(`
    query Playlists($userId: String!, $name: String, $take: Int, $skip: Int) {
  playlists(
    where: {or: {name: {contains: $name}, nameUnsigned: {contains: $name}}, userId: {eq: $userId}}
    order: {createdAt: DESC}
    take: $take
    skip: $skip
  ) {
    items {
      id
      name
      coverImage
      isPublic
      userId
      checkPlaylistInFavorite
    }
    totalCount
    pageInfo {
      hasNextPage
    }
  }
}
    `) as unknown as TypedDocumentString<PlaylistsQuery, PlaylistsQueryVariables>;
export const PlaylistsHomeDocument = new TypedDocumentString(`
    query PlaylistsHome($take: Int, $skip: Int) {
  playlists(
    where: {isPublic: {eq: true}}
    order: {createdAt: DESC}
    take: $take
    skip: $skip
  ) {
    items {
      id
      name
      coverImage
      userId
      isPublic
      checkPlaylistInFavorite
    }
  }
}
    `) as unknown as TypedDocumentString<PlaylistsHomeQuery, PlaylistsHomeQueryVariables>;
export const ReportQueriesDocument = new TypedDocumentString(`
    query ReportQueries($skip: Int, $take: Int, $where: ReportFilterInput) {
  reports(skip: $skip, take: $take, where: $where) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      reportedUserId
      reporterId
      reportType
      status
      relatedContentType
      relatedContentId
      assignedModeratorId
      actionTaken
      totalReportsCount
      createdAt
      description
      userReporter {
        id
        fullName
        role
      }
      userReported {
        id
        fullName
        role
      }
      track {
        id
        name
      }
      comment {
        id
        commentType
        content
        targetId
        user {
          id
          fullName
        }
        listener {
          id
          displayName
        }
        artist {
          id
          stageName
        }
        track {
          id
          name
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ReportQueriesQuery, ReportQueriesQueryVariables>;
export const ReportDetailQueryDocument = new TypedDocumentString(`
    query ReportDetailQuery($where: ReportFilterInput) {
  reports(where: $where) {
    items {
      id
      reportedUserId
      reporterId
      reportType
      status
      relatedContentType
      relatedContentId
      assignedModeratorId
      actionTaken
      totalReportsCount
      createdAt
      updatedAt
      userReporter {
        id
        fullName
        role
      }
      userReported {
        id
        fullName
        role
      }
      track {
        id
        name
      }
      comment {
        id
        commentType
        content
        targetId
        commenterId
        user {
          id
          fullName
        }
        listener {
          id
          displayName
        }
        artist {
          id
          stageName
        }
        track {
          id
          name
        }
      }
      request {
        id
        title
        summary
      }
      description
      priority
      evidences
      note
      resolvedAt
    }
  }
}
    `) as unknown as TypedDocumentString<ReportDetailQueryQuery, ReportDetailQueryQueryVariables>;
export const QueryModeratorReportsDocument = new TypedDocumentString(`
    query QueryModeratorReports($where: UserFilterInput) {
  users(where: $where) {
    items {
      id
      fullName
    }
  }
}
    `) as unknown as TypedDocumentString<QueryModeratorReportsQuery, QueryModeratorReportsQueryVariables>;
export const RequestHubThreadCommentsDocument = new TypedDocumentString(`
    query RequestHubThreadComments($targetId: String!) {
  threadedComments(
    request: {targetId: $targetId, commentType: REQUEST, page: 1, pageSize: 10, sortOrder: THREAD_ACTIVITY}
  ) {
    threads {
      rootComment {
        id
        content
        createdAt
        replyCount
        commenterId
        commenter {
          fullName
          email
          isVerified
          role
          userId
          listener {
            avatarImage
            displayName
            followerCount
            id
            isVerified
          }
          artist {
            avatarImage
            stageName
            followerCount
            id
            isVerified
            popularity
          }
        }
        commentType
        isDeleted
        isEdited
        depth
        targetId
        threadPath
        threadUpdatedAt
        totalRepliesCount
      }
      replies {
        id
        content
        createdAt
        replyCount
        commenterId
        commenter {
          fullName
          email
          isVerified
          role
          userId
          listener {
            avatarImage
            displayName
            followerCount
            id
            isVerified
          }
          artist {
            avatarImage
            stageName
            followerCount
            id
            isVerified
            popularity
          }
        }
        commentType
        isDeleted
        isEdited
        depth
        targetId
        threadPath
        threadUpdatedAt
        totalRepliesCount
      }
      totalReplies
    }
    totalThreads
  }
}
    `) as unknown as TypedDocumentString<RequestHubThreadCommentsQuery, RequestHubThreadCommentsQueryVariables>;
export const RequestHubCommentThreadRepliesDocument = new TypedDocumentString(`
    query RequestHubCommentThreadReplies($rootCommentId: String!) {
  commentReplies(
    request: {commentId: $rootCommentId, page: 1, pageSize: 10, sortOrder: CHRONOLOGICAL}
  ) {
    replies {
      id
      content
      createdAt
      commenterId
      commentType
      commenter {
        fullName
        email
        isVerified
        role
        userId
        listener {
          avatarImage
          displayName
          followerCount
          id
          isVerified
        }
        artist {
          avatarImage
          stageName
          followerCount
          id
          isVerified
          popularity
        }
      }
      depth
      isDeleted
      isEdited
      replyCount
      targetId
      threadPath
      totalRepliesCount
      threadUpdatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<RequestHubCommentThreadRepliesQuery, RequestHubCommentThreadRepliesQueryVariables>;
export const RequestsDocument = new TypedDocumentString(`
    query Requests($skip: Int, $take: Int, $where: RequestFilterInput) {
  requests(skip: $skip, take: $take, where: $where) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
    items {
      id
      requestUserId
      title
      titleUnsigned
      summary
      summaryUnsigned
      detailDescription
      budget {
        min
        max
      }
      currency
      deadline
      status
      type
      postCreatedTime
      requestCreatedTime
      updatedAt
      artistId
      packageId
      artist {
        id
        stageName
        avatarImage
      }
      requestor {
        id
        userId
        displayName
      }
    }
  }
}
    `) as unknown as TypedDocumentString<RequestsQuery, RequestsQueryVariables>;
export const RequestDetailByIdDocument = new TypedDocumentString(`
    query RequestDetailById($requestId: String!) {
  requestDetailById(requestId: $requestId) {
    id
    requestUserId
    title
    titleUnsigned
    summary
    summaryUnsigned
    detailDescription
    currency
    deadline
    status
    type
    postCreatedTime
    requestCreatedTime
    updatedAt
    artistId
    packageId
    budget {
      min
      max
    }
    artist {
      id
      stageName
      avatarImage
    }
    requestor {
      id
      userId
      displayName
    }
  }
}
    `) as unknown as TypedDocumentString<RequestDetailByIdQuery, RequestDetailByIdQueryVariables>;
export const SearchRequestsDocument = new TypedDocumentString(`
    query SearchRequests($searchTerm: String!, $skip: Int, $take: Int, $isIndividual: Boolean!) {
  searchRequests(
    searchTerm: $searchTerm
    skip: $skip
    take: $take
    isIndividual: $isIndividual
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      requestUserId
      title
      titleUnsigned
      summary
      summaryUnsigned
      detailDescription
      currency
      deadline
      status
      postCreatedTime
      updatedAt
      budget {
        min
        max
      }
    }
    totalCount
  }
}
    `) as unknown as TypedDocumentString<SearchRequestsQuery, SearchRequestsQueryVariables>;
export const OwnRequestsDocument = new TypedDocumentString(`
    query OwnRequests($skip: Int, $take: Int, $where: RequestFilterInput) {
  ownRequests(skip: $skip, take: $take, where: $where) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
    items {
      id
      requestUserId
      title
      titleUnsigned
      summary
      summaryUnsigned
      detailDescription
      currency
      deadline
      status
      type
      postCreatedTime
      requestCreatedTime
      updatedAt
      artistId
      packageId
      budget {
        min
        max
      }
      artist {
        id
        stageName
        avatarImage
      }
      requestor {
        id
        userId
        displayName
      }
    }
  }
}
    `) as unknown as TypedDocumentString<OwnRequestsQuery, OwnRequestsQueryVariables>;
export const UsersForRequestsDocument = new TypedDocumentString(`
    query UsersForRequests($userId: String!) {
  users(where: {id: {eq: $userId}}) {
    items {
      id
      fullName
      gender
    }
  }
}
    `) as unknown as TypedDocumentString<UsersForRequestsQuery, UsersForRequestsQueryVariables>;
export const GetListenerTransactionsDocument = new TypedDocumentString(`
    query GetListenerTransactions($where: PaymentTransactionFilterInput, $order: [PaymentTransactionSortInput!], $skip: Int, $take: Int) {
  paymentTransactions(where: $where, order: $order, skip: $skip, take: $take) {
    totalCount
    items {
      id
      amount
      currency
      createdAt
      paymentStatus
      status
      stripePaymentMethod
      stripePaymentId
      stripeCheckoutSessionId
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<GetListenerTransactionsQuery, GetListenerTransactionsQueryVariables>;
export const GetListenerInvoicesDocument = new TypedDocumentString(`
    query GetListenerInvoices($where: InvoiceFilterInput, $order: [InvoiceSortInput!], $skip: Int, $take: Int) {
  invoices(where: $where, order: $order, skip: $skip, take: $take) {
    totalCount
    items {
      id
      amount
      currency
      email
      to
      from
      paidAt
      paymentTransactionId
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<GetListenerInvoicesQuery, GetListenerInvoicesQueryVariables>;
export const ArtistPackagesDocument = new TypedDocumentString(`
    query ArtistPackages($artistId: String!) {
  artistPackages(where: {status: {eq: ENABLED}, artistId: {eq: $artistId}}) {
    items {
      id
      artistId
      amount
      currency
      packageName
      description
    }
  }
}
    `) as unknown as TypedDocumentString<ArtistPackagesQuery, ArtistPackagesQueryVariables>;
export const TrackThreadCommentsDocument = new TypedDocumentString(`
    query TrackThreadComments($targetId: String!) {
  threadedComments(
    request: {targetId: $targetId, commentType: TRACK, page: 1, pageSize: 10, sortOrder: THREAD_ACTIVITY}
  ) {
    threads {
      rootComment {
        id
        content
        createdAt
        replyCount
        commenterId
        commenter {
          fullName
          email
          isVerified
          role
          userId
          listener {
            avatarImage
            displayName
            followerCount
            id
            isVerified
          }
          artist {
            avatarImage
            stageName
            followerCount
            id
            isVerified
            popularity
          }
        }
        commentType
        isDeleted
        isEdited
        depth
        targetId
        threadPath
        threadUpdatedAt
        totalRepliesCount
      }
      replies {
        id
        content
        createdAt
        replyCount
        commenterId
        commenter {
          fullName
          email
          isVerified
          role
          userId
          listener {
            avatarImage
            displayName
            followerCount
            id
            isVerified
          }
          artist {
            avatarImage
            stageName
            followerCount
            id
            isVerified
            popularity
          }
        }
        commentType
        isDeleted
        isEdited
        depth
        targetId
        threadPath
        threadUpdatedAt
        totalRepliesCount
      }
      totalReplies
    }
    totalThreads
  }
}
    `) as unknown as TypedDocumentString<TrackThreadCommentsQuery, TrackThreadCommentsQueryVariables>;
export const TrackCommentRepliesDocument = new TypedDocumentString(`
    query TrackCommentReplies($rootCommentId: String!) {
  commentReplies(
    request: {commentId: $rootCommentId, page: 1, pageSize: 10, sortOrder: CHRONOLOGICAL}
  ) {
    replies {
      id
      content
      createdAt
      commenterId
      commentType
      commenter {
        fullName
        email
        isVerified
        role
        userId
        listener {
          avatarImage
          displayName
          followerCount
          id
          isVerified
        }
        artist {
          avatarImage
          stageName
          followerCount
          id
          isVerified
          popularity
        }
      }
      depth
      isDeleted
      isEdited
      replyCount
      targetId
      threadPath
      totalRepliesCount
      threadUpdatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<TrackCommentRepliesQuery, TrackCommentRepliesQueryVariables>;
export const TrackListHomeDocument = new TypedDocumentString(`
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
      checkTrackInFavorite
    }
  }
}
    `) as unknown as TypedDocumentString<TrackListHomeQuery, TrackListHomeQueryVariables>;
export const TrackDetailDocument = new TypedDocumentString(`
    query TrackDetail($trackId: String!) {
  tracks(where: {id: {eq: $trackId}}) {
    items {
      id
      name
      coverImage
      favoriteCount
      streamCount
      mainArtistIds
      mainArtists {
        items {
          id
          stageName
          followerCount
          avatarImage
          userId
          user {
            id
            checkUserFollowing
          }
        }
      }
      checkTrackInFavorite
    }
  }
}
    `) as unknown as TypedDocumentString<TrackDetailQuery, TrackDetailQueryVariables>;
export const ListenerDocument = new TypedDocumentString(`
    query Listener($userId: String!) {
  listeners(where: {userId: {eq: $userId}, isVisible: {eq: true}}) {
    items {
      userId
      displayName
      avatarImage
      user {
        fullName
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ListenerQuery, ListenerQueryVariables>;
export const ArtistDocument = new TypedDocumentString(`
    query Artist($userId: String!) {
  artists(where: {userId: {eq: $userId}, isVisible: {eq: true}}) {
    items {
      userId
      stageName
      avatarImage
      user {
        fullName
        checkUserFollowing
      }
      followerCount
    }
  }
}
    `) as unknown as TypedDocumentString<ArtistQuery, ArtistQueryVariables>;
export const ArtistListDocument = new TypedDocumentString(`
    query ArtistList($take: Int, $skip: Int) {
  artists(
    where: {isVisible: {eq: true}}
    take: $take
    skip: $skip
    order: {popularity: DESC}
  ) {
    items {
      id
      userId
      stageName
      biography
      avatarImage
      identityCard {
        nationality
        placeOfResidence {
          province
        }
      }
      user {
        fullName
      }
    }
    pageInfo {
      hasNextPage
    }
    totalCount
  }
}
    `) as unknown as TypedDocumentString<ArtistListQuery, ArtistListQueryVariables>;
export const ArtistDetailDocument = new TypedDocumentString(`
    query ArtistDetail($artistId: String!) {
  artists(where: {id: {eq: $artistId}, isVisible: {eq: true}}) {
    items {
      userId
      stageName
      avatarImage
      bannerImage
      biography
      email
      user {
        id
        fullName
        checkUserFollowing
      }
      followerCount
      categoryIds
      categories {
        items {
          name
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ArtistDetailQuery, ArtistDetailQueryVariables>;
export const GetListenerProfileDocument = new TypedDocumentString(`
    query GetListenerProfile($where: ListenerFilterInput) {
  listeners(where: $where, take: 1) {
    items {
      id
      userId
      displayName
      email
      avatarImage
      bannerImage
      createdAt
      followerCount
      followingCount
      isVerified
      user {
        birthDate
        gender
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetListenerProfileQuery, GetListenerProfileQueryVariables>;
export const GetUserActiveSubscriptionDocument = new TypedDocumentString(`
    query GetUserActiveSubscription($where: UserSubscriptionFilterInput, $take: Int, $skip: Int) {
  userSubscriptions(where: $where, take: $take, skip: $skip) {
    items {
      id
      isActive
      subscriptionId
      subscription {
        tier
        status
        name
      }
      periodEnd
      cancelAtEndOfPeriod
      canceledAt
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserActiveSubscriptionQuery, GetUserActiveSubscriptionQueryVariables>;
export const GetUserStripeAccountIdDocument = new TypedDocumentString(`
    query GetUserStripeAccountId($userId: String!) {
  users(where: {id: {eq: $userId}}) {
    items {
      role
      stripeAccountId
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserStripeAccountIdQuery, GetUserStripeAccountIdQueryVariables>;
export const ApprovalHistoriesListDocument = new TypedDocumentString(`
    query ApprovalHistoriesList($skip: Int, $take: Int, $where: ApprovalHistoryFilterInput) {
  approvalHistories(skip: $skip, take: $take, where: $where) {
    totalCount
    items {
      id
      approvalType
      actionAt
      action
      notes
      snapshot
      approvedBy {
        id
        email
        fullName
        role
      }
      targetId
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<ApprovalHistoriesListQuery, ApprovalHistoriesListQueryVariables>;
export const ModeratorApprovalHistoryDetailDocument = new TypedDocumentString(`
    query ModeratorApprovalHistoryDetail($where: ApprovalHistoryFilterInput) {
  approvalHistories(where: $where) {
    items {
      id
      approvalType
      actionAt
      action
      notes
      snapshot
      approvedBy {
        id
        email
        fullName
        role
      }
      targetId
    }
  }
}
    `) as unknown as TypedDocumentString<ModeratorApprovalHistoryDetailQuery, ModeratorApprovalHistoryDetailQueryVariables>;
export const PendingArtistRegistrationsListDocument = new TypedDocumentString(`
    query PendingArtistRegistrationsList($pageNumber: Int!, $pageSize: Int!) {
  pendingArtistRegistrations(pageNumber: $pageNumber, pageSize: $pageSize) {
    totalCount
    items {
      email
      fullName
      stageName
      stageNameUnsigned
      artistType
      gender
      birthDate
      phoneNumber
      avatarImage
      id
      requestedAt
    }
  }
}
    `) as unknown as TypedDocumentString<PendingArtistRegistrationsListQuery, PendingArtistRegistrationsListQueryVariables>;
export const PendingArtistRegistrationByIdDocument = new TypedDocumentString(`
    query PendingArtistRegistrationById($artistRegistrationId: String!) {
  pendingArtistRegistrationById(artistRegistrationId: $artistRegistrationId) {
    email
    fullName
    stageName
    artistType
    gender
    birthDate
    phoneNumber
    avatarImage
    id
    members {
      fullName
      email
      phoneNumber
      isLeader
      gender
    }
    requestedAt
    timeToLive
    identityCardNumber
    identityCardDateOfBirth
    identityCardFullName
    placeOfOrigin
    placeOfResidence
    frontImageUrl
    backImageUrl
  }
}
    `) as unknown as TypedDocumentString<PendingArtistRegistrationByIdQuery, PendingArtistRegistrationByIdQueryVariables>;
export const PendingTrackUploadRequestsListDocument = new TypedDocumentString(`
    query PendingTrackUploadRequestsList($pageNumber: Int!, $pageSize: Int!) {
  pendingTrackUploadRequests(pageNumber: $pageNumber, pageSize: $pageSize) {
    totalCount
    items {
      id
      track {
        id
        name
        description
        type
        mainArtistIds
        featuredArtistIds
        coverImage
        isExplicit
        tags
        categoryIds
        lyrics
        previewVideo
        createdBy
        requestedAt
        releaseInfo {
          isRelease
          releaseDate
          releasedAt
          releaseStatus
        }
        legalDocuments {
          name
          documentUrl
          documentType
          note
        }
      }
      requestedAt
      createdBy
      mainArtists {
        items {
          id
          userId
          stageName
          stageNameUnsigned
          email
          artistType
          avatarImage
        }
      }
      featuredArtists {
        items {
          id
          userId
          stageName
          stageNameUnsigned
          email
        }
      }
      recordingUsers {
        items {
          id
          email
          fullName
          gender
          birthDate
        }
      }
      workUsers {
        items {
          id
          email
          fullName
          gender
          birthDate
        }
      }
      work {
        id
        description
      }
      recording {
        id
        description
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PendingTrackUploadRequestsListQuery, PendingTrackUploadRequestsListQueryVariables>;
export const PendingTrackUploadRequestByIdDocument = new TypedDocumentString(`
    query PendingTrackUploadRequestById($uploadId: String!) {
  pendingTrackUploadRequestById(uploadId: $uploadId) {
    id
    requestedAt
    createdBy
    track {
      id
      name
      description
      type
      mainArtistIds
      featuredArtistIds
      categoryIds
      tags
      coverImage
      previewVideo
      isExplicit
      lyrics
      createdBy
      requestedAt
      releaseInfo {
        isRelease
        releaseDate
        releasedAt
        releaseStatus
      }
      legalDocuments {
        name
        documentUrl
        documentType
        note
      }
    }
    work {
      id
      description
      workSplits {
        userId
        artistRole
        percentage
      }
    }
    recording {
      id
      description
      recordingSplitRequests {
        userId
        artistRole
        percentage
      }
    }
    workUsers {
      items {
        id
        email
        fullName
        gender
        birthDate
        phoneNumber
        status
      }
    }
    recordingUsers {
      items {
        id
        email
        fullName
        gender
        birthDate
        phoneNumber
        status
      }
    }
    mainArtists {
      items {
        id
        userId
        stageName
        stageNameUnsigned
        email
        artistType
        avatarImage
      }
    }
    featuredArtists {
      items {
        id
        userId
        stageName
        stageNameUnsigned
        email
        artistType
        avatarImage
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PendingTrackUploadRequestByIdQuery, PendingTrackUploadRequestByIdQueryVariables>;
export const UserCreatedByDocument = new TypedDocumentString(`
    query UserCreatedBy($where: UserFilterInput!) {
  users(where: $where) {
    items {
      id
      email
      fullName
      role
    }
  }
}
    `) as unknown as TypedDocumentString<UserCreatedByQuery, UserCreatedByQueryVariables>;
export const OriginalFileTrackUploadRequestDocument = new TypedDocumentString(`
    query OriginalFileTrackUploadRequest($trackId: String!) {
  originalFileTrackUploadRequest(trackId: $trackId)
}
    `) as unknown as TypedDocumentString<OriginalFileTrackUploadRequestQuery, OriginalFileTrackUploadRequestQueryVariables>;
export const RejectTrackUploadRequestDocument = new TypedDocumentString(`
    mutation RejectTrackUploadRequest($uploadId: String!, $reasonReject: String!) {
  rejectTrackUploadRequest(uploadId: $uploadId, reasonReject: $reasonReject)
}
    `) as unknown as TypedDocumentString<RejectTrackUploadRequestMutation, RejectTrackUploadRequestMutationVariables>;
export const ApproveTrackUploadRequestDocument = new TypedDocumentString(`
    mutation ApproveTrackUploadRequest($uploadId: String!) {
  approveTrackUploadRequest(uploadId: $uploadId)
}
    `) as unknown as TypedDocumentString<ApproveTrackUploadRequestMutation, ApproveTrackUploadRequestMutationVariables>;
export const GetCategoryDocument = new TypedDocumentString(`
    query GetCategory($where: CategoryFilterInput!) {
  categories(where: $where) {
    items {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<GetCategoryQuery, GetCategoryQueryVariables>;
export const ModeratorArtistDetailDocument = new TypedDocumentString(`
    query ModeratorArtistDetail($id: String) {
  artists(where: {userId: {eq: $id}}) {
    totalCount
    items {
      id
      userId
      stageName
      email
      artistType
      members {
        fullName
        email
        phoneNumber
        isLeader
        gender
      }
      categoryIds
      biography
      followerCount
      popularity
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      identityCard {
        number
        fullName
        dateOfBirth
        gender
        placeOfOrigin
        nationality
        validUntil
        placeOfResidence {
          street
          ward
          province
          oldDistrict
          oldWard
          oldProvince
          addressLine
        }
      }
      createdAt
      user {
        fullName
        role
        phoneNumber
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ModeratorArtistDetailQuery, ModeratorArtistDetailQueryVariables>;
export const ModeratorListenerDetailDocument = new TypedDocumentString(`
    query ModeratorListenerDetail($id: String) {
  listeners(where: {userId: {eq: $id}}) {
    items {
      id
      userId
      displayName
      email
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      followerCount
      followingCount
      createdAt
      user {
        fullName
        birthDate
        gender
        phoneNumber
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ModeratorListenerDetailQuery, ModeratorListenerDetailQueryVariables>;
export const ModeratorUsersListDocument = new TypedDocumentString(`
    query ModeratorUsersList($skip: Int, $take: Int, $where: UserFilterInput) {
  users(skip: $skip, take: $take, where: $where) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      email
      fullName
      gender
      birthDate
      role
      phoneNumber
      status
      isLinkedWithGoogle
      stripeCustomerId
      stripeAccountId
      lastLoginAt
      createdAt
      updatedAt
    }
  }
  artists {
    items {
      id
      userId
      stageName
      email
      artistType
      categoryIds
      biography
      followerCount
      popularity
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      createdAt
      updatedAt
      members {
        fullName
        email
        phoneNumber
        isLeader
        gender
      }
      identityCard {
        number
        fullName
        dateOfBirth
        gender
        placeOfOrigin
        nationality
        validUntil
        placeOfResidence {
          street
          ward
          province
          oldDistrict
          oldWard
          oldProvince
          addressLine
        }
      }
    }
  }
  listeners {
    items {
      id
      userId
      displayName
      email
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      followerCount
      followingCount
      lastFollowers
      lastFollowings
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<ModeratorUsersListQuery, ModeratorUsersListQueryVariables>;
export const ModeratorUsersListAnalyticsDocument = new TypedDocumentString(`
    query ModeratorUsersListAnalytics($skip: Int, $take: Int, $where: UserFilterInput) {
  users(skip: $skip, take: $take, where: $where) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    items {
      id
      email
      fullName
      gender
      birthDate
      role
      phoneNumber
      status
      isLinkedWithGoogle
      stripeCustomerId
      stripeAccountId
      lastLoginAt
      createdAt
      updatedAt
    }
  }
  artists {
    items {
      id
      userId
      stageName
      email
      artistType
      categoryIds
      biography
      followerCount
      popularity
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      createdAt
      updatedAt
      members {
        fullName
        email
        phoneNumber
        isLeader
        gender
      }
      identityCard {
        number
        fullName
        dateOfBirth
        gender
        placeOfOrigin
        nationality
        validUntil
        placeOfResidence {
          street
          ward
          province
          oldDistrict
          oldWard
          oldProvince
          addressLine
        }
      }
    }
  }
  listeners {
    items {
      id
      userId
      displayName
      email
      avatarImage
      bannerImage
      isVerified
      verifiedAt
      followerCount
      followingCount
      lastFollowers
      lastFollowings
      createdAt
      updatedAt
    }
  }
}
    `) as unknown as TypedDocumentString<ModeratorUsersListAnalyticsQuery, ModeratorUsersListAnalyticsQueryVariables>;