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

export enum AlbumType {
  Album = 'ALBUM',
  Compilation = 'COMPILATION',
  Ep = 'EP',
  Live = 'LIVE',
  Remix = 'REMIX',
  Single = 'SINGLE',
  Soundtrack = 'SOUNDTRACK'
}

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type Artist = {
  __typename?: 'Artist';
  artistType: ArtistType;
  avatarImage?: Maybe<Scalars['String']['output']>;
  bannerImage?: Maybe<Scalars['String']['output']>;
  biography?: Maybe<Scalars['String']['output']>;
  categories: Array<Maybe<Category>>;
  categoryIds: Array<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  followerCount: Scalars['Long']['output'];
  id: Scalars['String']['output'];
  identityCard: IdentityCard;
  isVerified: Scalars['Boolean']['output'];
  legalDocuments: Array<LegalDocument>;
  members: Array<ArtistMember>;
  popularity: Scalars['Long']['output'];
  restriction: Restriction;
  stageName: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['String']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
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
  id?: InputMaybe<StringOperationFilterInput>;
  identityCard?: InputMaybe<IdentityCardFilterInput>;
  isVerified?: InputMaybe<BooleanOperationFilterInput>;
  legalDocuments?: InputMaybe<ListFilterInputTypeOfLegalDocumentFilterInput>;
  members?: InputMaybe<ListFilterInputTypeOfArtistMemberFilterInput>;
  or?: InputMaybe<Array<ArtistFilterInput>>;
  popularity?: InputMaybe<LongOperationFilterInput>;
  restriction?: InputMaybe<RestrictionFilterInput>;
  stageName?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  verifiedAt?: InputMaybe<DateTimeOperationFilterInput>;
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
  createdAt: Scalars['DateTime']['output'];
  currency: CurrencyType;
  description?: Maybe<Scalars['String']['output']>;
  estimateDeliveryDays: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  packageName: Scalars['String']['output'];
  serviceDetails: Array<Metadata>;
  status: ArtistPackageStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version: Scalars['Long']['output'];
};

export type ArtistPackageFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<ArtistPackageFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  estimateDeliveryDays?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ArtistPackageFilterInput>>;
  packageName?: InputMaybe<StringOperationFilterInput>;
  serviceDetails?: InputMaybe<ListFilterInputTypeOfMetadataFilterInput>;
  status?: InputMaybe<ArtistPackageStatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  version?: InputMaybe<LongOperationFilterInput>;
};

export type ArtistPackageSortInput = {
  amount?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  currency?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  estimateDeliveryDays?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  packageName?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  version?: InputMaybe<SortEnumType>;
};

export enum ArtistPackageStatus {
  Canceled = 'CANCELED',
  Disabled = 'DISABLED',
  Enabled = 'ENABLED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
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

export type ArtistRegistrationApprovalRequestInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
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
  id?: InputMaybe<SortEnumType>;
  identityCard?: InputMaybe<IdentityCardSortInput>;
  isVerified?: InputMaybe<SortEnumType>;
  popularity?: InputMaybe<SortEnumType>;
  restriction?: InputMaybe<RestrictionSortInput>;
  stageName?: InputMaybe<SortEnumType>;
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
  replies: Array<TrackCommentResponse>;
  totalReplies: Scalars['Int']['output'];
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
  replies: Array<TrackCommentResponse>;
  rootComment: TrackCommentResponse;
  totalReplies: Scalars['Int']['output'];
};

/** A segment of a collection. */
export type CommentThreadCollectionSegment = {
  __typename?: 'CommentThreadCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<TrackCommentResponse>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type CommentThreadRequestInput = {
  commentId: Scalars['String']['input'];
  includeDeleted: Scalars['Boolean']['input'];
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
  password: Scalars['String']['input'];
};

export type CreateArtistPackageRequestInput = {
  amount: Scalars['Decimal']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  estimateDeliveryDays: Scalars['Int']['input'];
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

export type CreateCouponRequestInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  duration: CouponDurationType;
  name: Scalars['String']['input'];
  percentOff: Scalars['Decimal']['input'];
  purpose: CouponPurposeType;
  status: CouponStatus;
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

export type CreateLegalPolicyRequestInput = {
  content: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type CreateModeratorRequestInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateMomoPaymentRequestInput = {
  amount: Scalars['Long']['input'];
  orderId: Scalars['String']['input'];
  orderInfo: Scalars['String']['input'];
};

export type CreatePaymentCheckoutSessionRequestInput = {
  cancelUrl: Scalars['String']['input'];
  isReceiptEmail: Scalars['Boolean']['input'];
  isSavePaymentMethod: Scalars['Boolean']['input'];
  packageId: Scalars['String']['input'];
  successUrl: Scalars['String']['input'];
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

export type CreateRoyalPolicyRequestInput = {
  currency: CurrencyType;
  effectiveAt: Scalars['DateTime']['input'];
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
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  version: Scalars['Int']['input'];
};

export type CreateTrackCommentRequestInput = {
  content: Scalars['String']['input'];
  parentCommentId?: InputMaybe<Scalars['String']['input']>;
  trackId: Scalars['String']['input'];
};

export type CreateTrackRequestInput = {
  categoryIds: Array<Scalars['String']['input']>;
  coverImage: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  featuredArtistIds: Array<Scalars['String']['input']>;
  isExplicit: Scalars['Boolean']['input'];
  isOriginal: Scalars['Boolean']['input'];
  isReleased: Scalars['Boolean']['input'];
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

export type DeleteTrackCommentRequestInput = {
  commentId: Scalars['String']['input'];
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

export type FollowUserRequestInput = {
  targetUserId: Scalars['String']['input'];
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
  subscriptionSnapshot?: Maybe<SubscriptionSnapshot>;
  to: Scalars['String']['output'];
  transaction?: Maybe<PaymentTransaction>;
  transactionId: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
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
  subscriptionSnapshot?: InputMaybe<SubscriptionSnapshotFilterInput>;
  to?: InputMaybe<StringOperationFilterInput>;
  transactionId?: InputMaybe<StringOperationFilterInput>;
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
  subscriptionSnapshot?: InputMaybe<SubscriptionSnapshotSortInput>;
  to?: InputMaybe<SortEnumType>;
  transactionId?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
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

export type KeyValuePairOfStringAndStringInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type LegalDocument = {
  __typename?: 'LegalDocument';
  createdAt: Scalars['DateTime']['output'];
  documentType: DocumentType;
  documentUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  note: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LegalDocumentFilterInput = {
  and?: InputMaybe<Array<LegalDocumentFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  documentType?: InputMaybe<DocumentTypeOperationFilterInput>;
  documentUrl?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  note?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<LegalDocumentFilterInput>>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
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
  email: Scalars['String']['output'];
  followerCount: Scalars['Long']['output'];
  followingCount: Scalars['Long']['output'];
  followingUser: Array<User>;
  id: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastFollowers: Array<Scalars['String']['output']>;
  lastFollowing: Array<Scalars['String']['output']>;
  restriction: Restriction;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ListenerFilterInput = {
  and?: InputMaybe<Array<ListenerFilterInput>>;
  avatarImage?: InputMaybe<StringOperationFilterInput>;
  bannerImage?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  displayName?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  followerCount?: InputMaybe<LongOperationFilterInput>;
  followingCount?: InputMaybe<LongOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isVerified?: InputMaybe<BooleanOperationFilterInput>;
  lastFollowers?: InputMaybe<ListStringOperationFilterInput>;
  lastFollowing?: InputMaybe<ListStringOperationFilterInput>;
  or?: InputMaybe<Array<ListenerFilterInput>>;
  restriction?: InputMaybe<RestrictionFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  verifiedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ListenerSortInput = {
  avatarImage?: InputMaybe<SortEnumType>;
  bannerImage?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  displayName?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  followerCount?: InputMaybe<SortEnumType>;
  followingCount?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isVerified?: InputMaybe<SortEnumType>;
  restriction?: InputMaybe<RestrictionSortInput>;
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

export type Message = {
  __typename?: 'Message';
  conversationId: Scalars['String']['output'];
  deletedFor: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  receiverId: Scalars['String']['output'];
  senderId: Scalars['String']['output'];
  sentAt: Scalars['DateTime']['output'];
  text: Scalars['String']['output'];
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
  track?: Maybe<Track>;
  trackId: Scalars['String']['output'];
  year: Scalars['Int']['output'];
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
  approveArtistPackage: Scalars['Boolean']['output'];
  approveArtistRegistration: Scalars['Boolean']['output'];
  approveTrackUploadRequest: Scalars['Boolean']['output'];
  banUser: Scalars['Boolean']['output'];
  changeArtistPackageStatus: Scalars['Boolean']['output'];
  commentReplies: CommentRepliesResponse;
  commentThread: Array<TrackCommentResponse>;
  convertToHls: Scalars['String']['output'];
  convertToWavFile: WavFileResponse;
  createAdmin: Scalars['Boolean']['output'];
  createArtistPackage: Scalars['Boolean']['output'];
  createBillingPortalConfiguration: Scalars['Boolean']['output'];
  createCategory: Scalars['Boolean']['output'];
  createCoupon: Scalars['Boolean']['output'];
  createCustomerPortalSession: Scalars['String']['output'];
  /** Create a test entitlement for demonstration purposes. */
  createEntilement: Scalars['Boolean']['output'];
  createEntitlement: Scalars['Boolean']['output'];
  createExpressConnectedAccount: AccountLinkResponse;
  createLegalPolicy: Scalars['Boolean']['output'];
  createModerator: Scalars['Boolean']['output'];
  createMomoPaymentQR: MomoPaymentResponse;
  createMomoPaymentVisa: MomoPaymentResponse;
  createPaymentCheckoutSession: CheckoutSessionResponse;
  createRequest: Scalars['Boolean']['output'];
  createRoyaltyPolicy: Scalars['Boolean']['output'];
  createSubscription: Scalars['Boolean']['output'];
  createSubscriptionCheckoutSession: CheckoutSessionResponse;
  createSubscriptionPlan: Scalars['Boolean']['output'];
  createTrackComment: Scalars['Boolean']['output'];
  deactiveEntitlement: Scalars['Boolean']['output'];
  deleteCoupon: Scalars['Boolean']['output'];
  deleteTrackComment: Scalars['Boolean']['output'];
  deprecateCoupon: Scalars['Boolean']['output'];
  deprecateSubscription: Scalars['Boolean']['output'];
  downgradeRoyaltyPolicyVersion: Scalars['Boolean']['output'];
  entitlementUserCount: Scalars['Long']['output'];
  followUser: Scalars['Boolean']['output'];
  hello: Scalars['String']['output'];
  reActiveUser: Scalars['Boolean']['output'];
  reactiveEntitlement: Scalars['Boolean']['output'];
  registerArtistManual: Scalars['Boolean']['output'];
  rejectArtistRegistration: Scalars['Boolean']['output'];
  rejectTrackUploadRequest: Scalars['Boolean']['output'];
  seedEntitlements: Scalars['Boolean']['output'];
  seedRoyaltyPolicyData: Scalars['Boolean']['output'];
  threadedComments: ThreadedCommentsResponse;
  unfollowUser: Scalars['Boolean']['output'];
  updateProfile: Scalars['Boolean']['output'];
  updateRequest: Scalars['Boolean']['output'];
  updateTrackComment: Scalars['Boolean']['output'];
  uploadFile: Scalars['String']['output'];
  uploadTrack: Scalars['Boolean']['output'];
  uploadTrackFingerprint: Scalars['String']['output'];
};


export type MutationInitializationApproveArtistPackageArgs = {
  updateStatusRequest: UpdateStatusArtistPackageRequestInput;
};


export type MutationInitializationApproveArtistRegistrationArgs = {
  request: ArtistRegistrationApprovalRequestInput;
};


export type MutationInitializationApproveTrackUploadRequestArgs = {
  recordingId: Scalars['String']['input'];
  trackId: Scalars['String']['input'];
  workId: Scalars['String']['input'];
};


export type MutationInitializationBanUserArgs = {
  targetUserId: Scalars['String']['input'];
};


export type MutationInitializationChangeArtistPackageStatusArgs = {
  updateStatusRequest: UpdateStatusArtistPackageRequestInput;
};


export type MutationInitializationCommentRepliesArgs = {
  request: CommentRepliesRequestInput;
};


export type MutationInitializationCommentThreadArgs = {
  request: CommentThreadRequestInput;
};


export type MutationInitializationConvertToHlsArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationInitializationConvertToWavFileArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationInitializationCreateAdminArgs = {
  createAdminRequest: CreateAdminRequestInput;
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


export type MutationInitializationCreateCouponArgs = {
  createCouponRequest: CreateCouponRequestInput;
};


export type MutationInitializationCreateCustomerPortalSessionArgs = {
  returnUrl: Scalars['String']['input'];
  version: Scalars['Long']['input'];
};


export type MutationInitializationCreateEntilementArgs = {
  featureValueType: EntitlementValueType;
  value?: InputMaybe<Scalars['EntitlementValue']['input']>;
};


export type MutationInitializationCreateEntitlementArgs = {
  createEntitlementRequest: CreateEntitlementRequestInput;
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


export type MutationInitializationCreateRequestArgs = {
  request: RequestCreatingRequestInput;
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


export type MutationInitializationCreateTrackCommentArgs = {
  request: CreateTrackCommentRequestInput;
};


export type MutationInitializationDeactiveEntitlementArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationDeleteCouponArgs = {
  couponIds: Array<Scalars['String']['input']>;
};


export type MutationInitializationDeleteTrackCommentArgs = {
  request: DeleteTrackCommentRequestInput;
};


export type MutationInitializationDeprecateCouponArgs = {
  couponIds: Array<Scalars['String']['input']>;
};


export type MutationInitializationDeprecateSubscriptionArgs = {
  subscriptionId: Scalars['String']['input'];
};


export type MutationInitializationDowngradeRoyaltyPolicyVersionArgs = {
  version?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationInitializationEntitlementUserCountArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationFollowUserArgs = {
  request: FollowUserRequestInput;
};


export type MutationInitializationReActiveUserArgs = {
  targetUserId: Scalars['String']['input'];
};


export type MutationInitializationReactiveEntitlementArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationRegisterArtistManualArgs = {
  createArtistRequest: CreateArtistRequestInput;
};


export type MutationInitializationRejectArtistRegistrationArgs = {
  request: ArtistRegistrationApprovalRequestInput;
};


export type MutationInitializationRejectTrackUploadRequestArgs = {
  recordingId: Scalars['String']['input'];
  trackId: Scalars['String']['input'];
  workId: Scalars['String']['input'];
};


export type MutationInitializationSeedEntitlementsArgs = {
  password: Scalars['String']['input'];
};


export type MutationInitializationSeedRoyaltyPolicyDataArgs = {
  password: Scalars['String']['input'];
};


export type MutationInitializationThreadedCommentsArgs = {
  request: ThreadedCommentsRequestInput;
};


export type MutationInitializationUnfollowUserArgs = {
  request: UnfollowUserRequestInput;
};


export type MutationInitializationUpdateProfileArgs = {
  updateArtistRequest: UpdateArtistRequestInput;
  updateListenerRequest: UpdateListenerRequestInput;
};


export type MutationInitializationUpdateRequestArgs = {
  request: RequestUpdatingRequestInput;
};


export type MutationInitializationUpdateTrackCommentArgs = {
  request: UpdateTrackCommentRequestInput;
};


export type MutationInitializationUploadFileArgs = {
  file: Scalars['Upload']['input'];
  fileName: Scalars['String']['input'];
};


export type MutationInitializationUploadTrackArgs = {
  createRecordingRequest: CreateRecordingRequestInput;
  createTrackRequest: CreateTrackRequestInput;
  createWorkRequest: CreateWorkRequestInput;
  file: Scalars['Upload']['input'];
};


export type MutationInitializationUploadTrackFingerprintArgs = {
  artistId: Scalars['String']['input'];
  file: Scalars['Upload']['input'];
  trackId: Scalars['String']['input'];
  trackName: Scalars['String']['input'];
};

export type OneOffSnapshot = {
  __typename?: 'OneOffSnapshot';
  description?: Maybe<Scalars['String']['output']>;
  estimateDeliveryDays: Scalars['Int']['output'];
  packageAmount: Scalars['Decimal']['output'];
  packageCurrency: CurrencyType;
  packageName: Scalars['String']['output'];
  status: ArtistPackageStatus;
};

export type OneOffSnapshotFilterInput = {
  and?: InputMaybe<Array<OneOffSnapshotFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  estimateDeliveryDays?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<OneOffSnapshotFilterInput>>;
  packageAmount?: InputMaybe<DecimalOperationFilterInput>;
  packageCurrency?: InputMaybe<CurrencyTypeOperationFilterInput>;
  packageName?: InputMaybe<StringOperationFilterInput>;
  status?: InputMaybe<ArtistPackageStatusOperationFilterInput>;
};

export type OneOffSnapshotSortInput = {
  description?: InputMaybe<SortEnumType>;
  estimateDeliveryDays?: InputMaybe<SortEnumType>;
  packageAmount?: InputMaybe<SortEnumType>;
  packageCurrency?: InputMaybe<SortEnumType>;
  packageName?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
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

export enum PaymentStatus {
  Paid = 'PAID',
  Pending = 'PENDING',
  Unpaid = 'UNPAID'
}

export type PaymentStatusOperationFilterInput = {
  eq?: InputMaybe<PaymentStatus>;
  in?: InputMaybe<Array<PaymentStatus>>;
  neq?: InputMaybe<PaymentStatus>;
  nin?: InputMaybe<Array<PaymentStatus>>;
};

export type PaymentTransaction = {
  __typename?: 'PaymentTransaction';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  paymentStatus: PaymentStatus;
  status: TransactionStatus;
  stripeCheckoutSessionId: Scalars['String']['output'];
  stripePaymentId?: Maybe<Scalars['String']['output']>;
  stripePaymentMethod: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type PaymentTransactionFilterInput = {
  amount?: InputMaybe<DecimalOperationFilterInput>;
  and?: InputMaybe<Array<PaymentTransactionFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  currency?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PaymentTransactionFilterInput>>;
  paymentStatus?: InputMaybe<PaymentStatusOperationFilterInput>;
  status?: InputMaybe<TransactionStatusOperationFilterInput>;
  stripeCheckoutSessionId?: InputMaybe<StringOperationFilterInput>;
  stripePaymentId?: InputMaybe<StringOperationFilterInput>;
  stripePaymentMethod?: InputMaybe<ListStringOperationFilterInput>;
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
  stripePaymentId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
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
  timeToLive?: Maybe<Scalars['TimeSpan']['output']>;
};

export type PendingArtistRegistrationResponseFilterInput = {
  and?: InputMaybe<Array<PendingArtistRegistrationResponseFilterInput>>;
  artistType?: InputMaybe<ArtistTypeOperationFilterInput>;
  avatarImage?: InputMaybe<StringOperationFilterInput>;
  backImageUrl?: InputMaybe<StringOperationFilterInput>;
  birthDate?: InputMaybe<DateTimeOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  frontImageUrl?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<UserGenderOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  identityCardDateOfBirth?: InputMaybe<DateTimeOperationFilterInput>;
  identityCardFullName?: InputMaybe<StringOperationFilterInput>;
  identityCardNumber?: InputMaybe<StringOperationFilterInput>;
  members?: InputMaybe<ListFilterInputTypeOfArtistMemberFilterInput>;
  or?: InputMaybe<Array<PendingArtistRegistrationResponseFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  placeOfOrigin?: InputMaybe<StringOperationFilterInput>;
  placeOfResidence?: InputMaybe<StringOperationFilterInput>;
  requestedAt?: InputMaybe<DateTimeOperationFilterInput>;
  stageName?: InputMaybe<StringOperationFilterInput>;
  timeToLive?: InputMaybe<TimeSpanOperationFilterInput>;
};

/** A segment of a collection. */
export type PendingTrackUploadRequestsCollectionSegment = {
  __typename?: 'PendingTrackUploadRequestsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<TrackTempRequest>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
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

export type Playlist = {
  __typename?: 'Playlist';
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isPublic: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  tracks: Array<Maybe<Track>>;
  tracksInfo: Array<PlaylistTracksInfo>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type PlaylistFilterInput = {
  and?: InputMaybe<Array<PlaylistFilterInput>>;
  coverImage?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isPublic?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
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
  name?: InputMaybe<SortEnumType>;
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
  artistPackages?: Maybe<ArtistPackagesCollectionSegment>;
  artists?: Maybe<ArtistsCollectionSegment>;
  categories?: Maybe<CategoriesCollectionSegment>;
  commentDepth: Scalars['Int']['output'];
  commentReplies: CommentRepliesResponse;
  commentThread?: Maybe<CommentThreadCollectionSegment>;
  coupons?: Maybe<CouponsCollectionSegment>;
  entitlements: Array<Entitlement>;
  hello: Scalars['String']['output'];
  invoices?: Maybe<InvoicesCollectionSegment>;
  isCommentInThread: Scalars['Boolean']['output'];
  legalPolicies?: Maybe<LegalPoliciesCollectionSegment>;
  listeners?: Maybe<ListenersCollectionSegment>;
  messagesExecutable: Array<Message>;
  metadataRecordingUploadRequest: RecordingTempRequest;
  metadataTrackUploadRequest: TrackTempRequest;
  metadataWorkUploadRequest: WorkTempRequest;
  monthlyStreamCounts?: Maybe<MonthlyStreamCountsCollectionSegment>;
  originalFileTrackUploadRequest: Scalars['String']['output'];
  pendingArtistRegistrations: Array<PendingArtistRegistrationResponse>;
  pendingTrackUploadRequests?: Maybe<PendingTrackUploadRequestsCollectionSegment>;
  playlists?: Maybe<PlaylistsCollectionSegment>;
  queryTrack: QueryAudioFingerprintResponse;
  queryTracks: Array<QueryAudioFingerprintResponse>;
  recordingsQueryable?: Maybe<RecordingsQueryableCollectionSegment>;
  requests: Array<RequestHub>;
  royaltyPolicies?: Maybe<RoyaltyPoliciesCollectionSegment>;
  royaltyReports?: Maybe<RoyaltyReportsCollectionSegment>;
  subscriptionPlans?: Maybe<SubscriptionPlansCollectionSegment>;
  subscriptions?: Maybe<SubscriptionsCollectionSegment>;
  threadedComments: ThreadedCommentsResponse;
  trackBySemanticSearch: Array<Track>;
  trackComments?: Maybe<TrackCommentsCollectionSegment>;
  tracks?: Maybe<TracksCollectionSegment>;
  transactions?: Maybe<TransactionsCollectionSegment>;
  userSubscriptions?: Maybe<UserSubscriptionsCollectionSegment>;
  users?: Maybe<UsersCollectionSegment>;
  worksQueryable?: Maybe<WorksQueryableCollectionSegment>;
};


export type QueryInitializationArtistPackagesArgs = {
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


export type QueryInitializationCommentDepthArgs = {
  commentId: Scalars['String']['input'];
};


export type QueryInitializationCommentRepliesArgs = {
  request: CommentRepliesRequestInput;
};


export type QueryInitializationCommentThreadArgs = {
  request: CommentThreadRequestInput;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryInitializationInvoicesArgs = {
  order?: InputMaybe<Array<InvoiceSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryInitializationMetadataRecordingUploadRequestArgs = {
  recordingId: Scalars['String']['input'];
};


export type QueryInitializationMetadataTrackUploadRequestArgs = {
  trackId: Scalars['String']['input'];
};


export type QueryInitializationMetadataWorkUploadRequestArgs = {
  workId: Scalars['String']['input'];
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


export type QueryInitializationPendingArtistRegistrationsArgs = {
  pageNumber?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  where?: InputMaybe<PendingArtistRegistrationResponseFilterInput>;
};


export type QueryInitializationPendingTrackUploadRequestsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackTempRequestFilterInput>;
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


export type QueryInitializationRecordingsQueryableArgs = {
  order?: InputMaybe<Array<RecordingSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RecordingFilterInput>;
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


export type QueryInitializationTrackCommentsArgs = {
  order?: InputMaybe<Array<TrackCommentSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackCommentFilterInput>;
};


export type QueryInitializationTracksArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrackFilterInput>;
};


export type QueryInitializationTransactionsArgs = {
  order?: InputMaybe<Array<PaymentTransactionSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PaymentTransactionFilterInput>;
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


export type QueryInitializationWorksQueryableArgs = {
  order?: InputMaybe<Array<WorkSortInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WorkFilterInput>;
};

export type Recording = {
  __typename?: 'Recording';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  recordingSplits: Array<RecordingSplit>;
  status: RecordingStatus;
  track?: Maybe<Track>;
  trackId: Scalars['String']['output'];
  users: Array<Maybe<User>>;
  version: Scalars['Long']['output'];
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
export type RecordingsQueryableCollectionSegment = {
  __typename?: 'RecordingsQueryableCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<Recording>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type ReleaseInfo = {
  __typename?: 'ReleaseInfo';
  isReleased: Scalars['Boolean']['output'];
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  releaseStatus: ReleaseStatus;
  releasedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ReleaseInfoFilterInput = {
  and?: InputMaybe<Array<ReleaseInfoFilterInput>>;
  isReleased?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ReleaseInfoFilterInput>>;
  releaseDate?: InputMaybe<DateTimeOperationFilterInput>;
  releaseStatus?: InputMaybe<ReleaseStatusOperationFilterInput>;
  releasedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ReleaseInfoSortInput = {
  isReleased?: InputMaybe<SortEnumType>;
  releaseDate?: InputMaybe<SortEnumType>;
  releaseStatus?: InputMaybe<SortEnumType>;
  releasedAt?: InputMaybe<SortEnumType>;
};

export enum ReleaseStatus {
  Canceled = 'CANCELED',
  Delayed = 'DELAYED',
  Leaked = 'LEAKED',
  NotAnnounced = 'NOT_ANNOUNCED',
  Official = 'OFFICIAL'
}

export type ReleaseStatusOperationFilterInput = {
  eq?: InputMaybe<ReleaseStatus>;
  in?: InputMaybe<Array<ReleaseStatus>>;
  neq?: InputMaybe<ReleaseStatus>;
  nin?: InputMaybe<Array<ReleaseStatus>>;
};

export type RequestCreatingRequestInput = {
  attachments?: InputMaybe<Array<Scalars['String']['input']>>;
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type RequestHub = {
  __typename?: 'RequestHub';
  attachments?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isClosed: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type RequestUpdatingRequestInput = {
  attachments?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isClosed?: InputMaybe<Scalars['Boolean']['input']>;
  isDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Restriction = {
  __typename?: 'Restriction';
  expired?: Maybe<Scalars['DateTime']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  restrictedAt?: Maybe<Scalars['DateTime']['output']>;
  type: RestrictionType;
};

export type RestrictionFilterInput = {
  and?: InputMaybe<Array<RestrictionFilterInput>>;
  expired?: InputMaybe<DateTimeOperationFilterInput>;
  or?: InputMaybe<Array<RestrictionFilterInput>>;
  reason?: InputMaybe<StringOperationFilterInput>;
  restrictedAt?: InputMaybe<DateTimeOperationFilterInput>;
  type?: InputMaybe<RestrictionTypeOperationFilterInput>;
};

export type RestrictionSortInput = {
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
  effectiveAt: Scalars['DateTime']['output'];
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
  effectiveAt?: InputMaybe<DateTimeOperationFilterInput>;
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
  effectiveAt?: InputMaybe<SortEnumType>;
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
  track?: Maybe<Track>;
  trackId: Scalars['String']['output'];
  users: Array<Maybe<User>>;
  year: Scalars['Int']['output'];
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

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  id: Scalars['String']['output'];
  stripeProductActive: Scalars['Boolean']['output'];
  stripeProductId: Scalars['String']['output'];
  stripeProductImages?: Maybe<Array<Scalars['String']['output']>>;
  stripeProductMetadata?: Maybe<Array<Metadata>>;
  stripeProductName: Scalars['String']['output'];
  stripeProductType: Scalars['String']['output'];
  subscription?: Maybe<Subscription>;
  subscriptionId: Scalars['String']['output'];
  subscriptionPlanPrices: Array<SubscriptionPlanPrice>;
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
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortOrder: CommentSortOrder;
  trackId: Scalars['String']['input'];
};

export type ThreadedCommentsResponse = {
  __typename?: 'ThreadedCommentsResponse';
  hasNextPage: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  threads: Array<CommentThread>;
  totalThreads: Scalars['Int']['output'];
};

export type TimeSpanOperationFilterInput = {
  eq?: InputMaybe<Scalars['TimeSpan']['input']>;
  gt?: InputMaybe<Scalars['TimeSpan']['input']>;
  gte?: InputMaybe<Scalars['TimeSpan']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['TimeSpan']['input']>>>;
  lt?: InputMaybe<Scalars['TimeSpan']['input']>;
  lte?: InputMaybe<Scalars['TimeSpan']['input']>;
  neq?: InputMaybe<Scalars['TimeSpan']['input']>;
  ngt?: InputMaybe<Scalars['TimeSpan']['input']>;
  ngte?: InputMaybe<Scalars['TimeSpan']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['TimeSpan']['input']>>>;
  nlt?: InputMaybe<Scalars['TimeSpan']['input']>;
  nlte?: InputMaybe<Scalars['TimeSpan']['input']>;
};

export type Track = {
  __typename?: 'Track';
  alternativeDescription: Scalars['String']['output'];
  artist: Array<Maybe<Artist>>;
  category: Array<Maybe<Category>>;
  categoryIds: Array<Scalars['String']['output']>;
  coverImage: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  embeddingVector: Array<Scalars['Float']['output']>;
  favoriteCount: Scalars['Long']['output'];
  featuredArtistIds: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isExplicit: Scalars['Boolean']['output'];
  isMonetized: Scalars['Boolean']['output'];
  lyrics?: Maybe<Scalars['String']['output']>;
  mainArtistIds: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
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

export type TrackComment = {
  __typename?: 'TrackComment';
  commenterId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  depth: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isEdited: Scalars['Boolean']['output'];
  isRootComment: Scalars['Boolean']['output'];
  parentCommentId?: Maybe<Scalars['String']['output']>;
  replyCount: Scalars['Long']['output'];
  rootCommentId?: Maybe<Scalars['String']['output']>;
  sortOrder: Scalars['Int']['output'];
  threadId: Scalars['String']['output'];
  threadPath: Array<Scalars['String']['output']>;
  threadUpdatedAt: Scalars['DateTime']['output'];
  totalRepliesCount: Scalars['Long']['output'];
  trackId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type TrackCommentFilterInput = {
  and?: InputMaybe<Array<TrackCommentFilterInput>>;
  commenterId?: InputMaybe<StringOperationFilterInput>;
  content?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdBy?: InputMaybe<StringOperationFilterInput>;
  depth?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  isEdited?: InputMaybe<BooleanOperationFilterInput>;
  isRootComment?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<TrackCommentFilterInput>>;
  parentCommentId?: InputMaybe<StringOperationFilterInput>;
  replyCount?: InputMaybe<LongOperationFilterInput>;
  rootCommentId?: InputMaybe<StringOperationFilterInput>;
  sortOrder?: InputMaybe<IntOperationFilterInput>;
  threadPath?: InputMaybe<ListStringOperationFilterInput>;
  threadUpdatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  totalRepliesCount?: InputMaybe<LongOperationFilterInput>;
  trackId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
};

export type TrackCommentResponse = {
  __typename?: 'TrackCommentResponse';
  commenterId: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  depth: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isDeleted: Scalars['Boolean']['output'];
  isEdited: Scalars['Boolean']['output'];
  isRootComment: Scalars['Boolean']['output'];
  parentCommentId?: Maybe<Scalars['String']['output']>;
  replyCount: Scalars['Long']['output'];
  rootCommentId?: Maybe<Scalars['String']['output']>;
  threadId: Scalars['String']['output'];
  threadPath: Array<Scalars['String']['output']>;
  threadUpdatedAt: Scalars['DateTime']['output'];
  totalRepliesCount: Scalars['Long']['output'];
  trackId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TrackCommentSortInput = {
  commenterId?: InputMaybe<SortEnumType>;
  content?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  createdBy?: InputMaybe<SortEnumType>;
  depth?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isDeleted?: InputMaybe<SortEnumType>;
  isEdited?: InputMaybe<SortEnumType>;
  isRootComment?: InputMaybe<SortEnumType>;
  parentCommentId?: InputMaybe<SortEnumType>;
  replyCount?: InputMaybe<SortEnumType>;
  rootCommentId?: InputMaybe<SortEnumType>;
  sortOrder?: InputMaybe<SortEnumType>;
  threadUpdatedAt?: InputMaybe<SortEnumType>;
  totalRepliesCount?: InputMaybe<SortEnumType>;
  trackId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
};

/** A segment of a collection. */
export type TrackCommentsCollectionSegment = {
  __typename?: 'TrackCommentsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<TrackComment>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
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
  lyrics?: InputMaybe<StringOperationFilterInput>;
  mainArtistIds?: InputMaybe<ListStringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
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
  lyrics?: Maybe<Scalars['String']['output']>;
  mainArtistIds: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  previewVideo?: Maybe<Scalars['String']['output']>;
  releaseInfo: ReleaseInfo;
  requestedAt: Scalars['DateTime']['output'];
  tags: Array<Scalars['String']['output']>;
  type: TrackType;
};

export type TrackTempRequestFilterInput = {
  and?: InputMaybe<Array<TrackTempRequestFilterInput>>;
  categoryIds?: InputMaybe<ListStringOperationFilterInput>;
  coverImage?: InputMaybe<StringOperationFilterInput>;
  createdBy?: InputMaybe<StringOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  featuredArtistIds?: InputMaybe<ListStringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isExplicit?: InputMaybe<BooleanOperationFilterInput>;
  lyrics?: InputMaybe<StringOperationFilterInput>;
  mainArtistIds?: InputMaybe<ListStringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TrackTempRequestFilterInput>>;
  previewVideo?: InputMaybe<StringOperationFilterInput>;
  releaseInfo?: InputMaybe<ReleaseInfoFilterInput>;
  requestedAt?: InputMaybe<DateTimeOperationFilterInput>;
  tags?: InputMaybe<ListStringOperationFilterInput>;
  type?: InputMaybe<TrackTypeOperationFilterInput>;
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

/** A segment of a collection. */
export type TransactionsCollectionSegment = {
  __typename?: 'TransactionsCollectionSegment';
  /** A flattened list of the items. */
  items?: Maybe<Array<PaymentTransaction>>;
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  totalCount: Scalars['Int']['output'];
};

export type UnfollowUserRequestInput = {
  targetUserId: Scalars['String']['input'];
};

export type UpdateArtistRequestInput = {
  avatarImage?: InputMaybe<Scalars['String']['input']>;
  bannerImage?: InputMaybe<Scalars['String']['input']>;
  biography?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateListenerRequestInput = {
  avatarImage?: InputMaybe<Scalars['String']['input']>;
  bannerImage?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStatusArtistPackageRequestInput = {
  id: Scalars['String']['input'];
  status: ArtistPackageStatus;
};

export type UpdateTrackCommentRequestInput = {
  commentId: Scalars['String']['input'];
  content: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  birthDate: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  gender: UserGender;
  id: Scalars['String']['output'];
  isLinkedWithGoogle: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  status: UserStatus;
  stripeAccountId?: Maybe<Scalars['String']['output']>;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
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
  refreshToken?: InputMaybe<StringOperationFilterInput>;
  refreshTokenExpiryTime?: InputMaybe<DateTimeOperationFilterInput>;
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
  refreshToken?: InputMaybe<SortEnumType>;
  refreshTokenExpiryTime?: InputMaybe<SortEnumType>;
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
  Inactive = 'INACTIVE'
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
  subscription?: Maybe<Subscription>;
  subscriptionId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
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

export type WavFileResponse = {
  __typename?: 'WavFileResponse';
  originalBitrate: Scalars['Long']['output'];
  outputWavPath: Scalars['String']['output'];
};

export type Work = {
  __typename?: 'Work';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  status: WorkStatus;
  track?: Maybe<Track>;
  trackId: Scalars['String']['output'];
  users: Array<Maybe<User>>;
  version: Scalars['Long']['output'];
  workSplits: Array<WorkSplit>;
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
export type WorksQueryableCollectionSegment = {
  __typename?: 'WorksQueryableCollectionSegment';
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

export type UsersListQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilterInput>;
}>;


export type UsersListQuery = { __typename?: 'QueryInitialization', users?: { __typename?: 'UsersCollectionSegment', totalCount: number, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean }, items?: Array<{ __typename?: 'User', id: string, email: string, fullName: string, gender: UserGender, birthDate: any, role: UserRole, phoneNumber?: string | null, status: UserStatus, isLinkedWithGoogle: boolean, stripeCustomerId?: string | null, stripeAccountId?: string | null, lastLoginAt?: any | null, createdAt: any, updatedAt?: any | null }> | null } | null, artists?: { __typename?: 'ArtistsCollectionSegment', items?: Array<{ __typename?: 'Artist', id: string, userId: string, stageName: string, email: string, artistType: ArtistType, categoryIds: Array<string>, biography?: string | null, followerCount: any, popularity: any, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, createdAt: any, updatedAt?: any | null, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, phoneNumber: string, isLeader: boolean, gender: UserGender }>, identityCard: { __typename?: 'IdentityCard', number: string, fullName: string, dateOfBirth: any, gender: UserGender, placeOfOrigin: string, nationality: string, validUntil?: any | null, placeOfResidence: { __typename?: 'Address', street?: string | null, ward?: string | null, province?: string | null, oldDistrict?: string | null, oldWard?: string | null, oldProvince?: string | null, addressLine?: string | null } } }> | null } | null, listeners?: { __typename?: 'ListenersCollectionSegment', items?: Array<{ __typename?: 'Listener', id: string, userId: string, displayName: string, email: string, avatarImage?: string | null, bannerImage?: string | null, isVerified: boolean, verifiedAt?: any | null, followerCount: any, followingCount: any, lastFollowers: Array<string>, lastFollowing: Array<string>, createdAt: any, updatedAt?: any | null, restriction: { __typename?: 'Restriction', type: RestrictionType, reason?: string | null, restrictedAt?: any | null, expired?: any | null } }> | null } | null };

export type CreateModeratorMutationVariables = Exact<{
  createModeratorRequest: CreateModeratorRequestInput;
}>;


export type CreateModeratorMutation = { __typename?: 'MutationInitialization', createModerator: boolean };

export type BanUserMutationVariables = Exact<{
  targetUserId: Scalars['String']['input'];
}>;


export type BanUserMutation = { __typename?: 'MutationInitialization', banUser: boolean };

export type ReActiveUserMutationVariables = Exact<{
  targetUserId: Scalars['String']['input'];
}>;


export type ReActiveUserMutation = { __typename?: 'MutationInitialization', reActiveUser: boolean };

export type TracksWithFiltersQueryVariables = Exact<{
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  where?: InputMaybe<TrackFilterInput>;
  order?: InputMaybe<Array<TrackSortInput> | TrackSortInput>;
}>;


export type TracksWithFiltersQuery = { __typename?: 'QueryInitialization', tracks?: { __typename?: 'TracksCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Track', id: string, name: string, mainArtistIds: Array<string>, streamCount: any, favoriteCount: any, coverImage: string, isExplicit: boolean, releaseInfo: { __typename?: 'ReleaseInfo', releaseDate?: any | null, isReleased: boolean } }> | null, pageInfo: { __typename?: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type TrackListHomeQueryVariables = Exact<{
  take: Scalars['Int']['input'];
}>;


export type TrackListHomeQuery = { __typename?: 'QueryInitialization', tracks?: { __typename?: 'TracksCollectionSegment', totalCount: number, items?: Array<{ __typename?: 'Track', id: string, name: string, coverImage: string, mainArtistIds: Array<string>, artist: Array<{ __typename?: 'Artist', id: string, stageName: string } | null> }> | null } | null };

export type TrackDetailQueryVariables = Exact<{
  trackId: Scalars['String']['input'];
}>;


export type TrackDetailQuery = { __typename?: 'QueryInitialization', tracks?: { __typename?: 'TracksCollectionSegment', items?: Array<{ __typename?: 'Track', id: string, name: string, coverImage: string, favoriteCount: any, streamCount: any, mainArtistIds: Array<string>, artist: Array<{ __typename?: 'Artist', id: string, stageName: string, followerCount: any } | null> }> | null } | null };

export type PendingArtistRegistrationsViewQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
}>;


export type PendingArtistRegistrationsViewQuery = { __typename?: 'QueryInitialization', pendingArtistRegistrations: Array<{ __typename?: 'PendingArtistRegistrationResponse', email: string, fullName: string, stageName: string, artistType: ArtistType, gender: UserGender, birthDate: any, phoneNumber: string, avatarImage?: string | null, id: string }> };

export type PendingArtistRegistrationsDetailQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type PendingArtistRegistrationsDetailQuery = { __typename?: 'QueryInitialization', pendingArtistRegistrations: Array<{ __typename?: 'PendingArtistRegistrationResponse', email: string, fullName: string, stageName: string, artistType: ArtistType, gender: UserGender, birthDate: any, phoneNumber: string, avatarImage?: string | null, id: string, requestedAt: any, timeToLive?: any | null, identityCardNumber: string, identityCardDateOfBirth: any, identityCardFullName: string, placeOfOrigin: string, placeOfResidence: string, frontImageUrl?: string | null, backImageUrl?: string | null, members: Array<{ __typename?: 'ArtistMember', fullName: string, email: string, phoneNumber: string, isLeader: boolean, gender: UserGender }> }> };

export type ApproveArtistRegistrationMutationVariables = Exact<{
  request: ArtistRegistrationApprovalRequestInput;
}>;


export type ApproveArtistRegistrationMutation = { __typename?: 'MutationInitialization', approveArtistRegistration: boolean };

export type RejectArtistRegistrationMutationVariables = Exact<{
  request: ArtistRegistrationApprovalRequestInput;
}>;


export type RejectArtistRegistrationMutation = { __typename?: 'MutationInitialization', rejectArtistRegistration: boolean };

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
      lastFollowing
      createdAt
      updatedAt
      restriction {
        type
        reason
        restrictedAt
        expired
      }
    }
  }
}
    `) as unknown as TypedDocumentString<UsersListQuery, UsersListQueryVariables>;
export const CreateModeratorDocument = new TypedDocumentString(`
    mutation CreateModerator($createModeratorRequest: CreateModeratorRequestInput!) {
  createModerator(createModeratorRequest: $createModeratorRequest)
}
    `) as unknown as TypedDocumentString<CreateModeratorMutation, CreateModeratorMutationVariables>;
export const BanUserDocument = new TypedDocumentString(`
    mutation banUser($targetUserId: String!) {
  banUser(targetUserId: $targetUserId)
}
    `) as unknown as TypedDocumentString<BanUserMutation, BanUserMutationVariables>;
export const ReActiveUserDocument = new TypedDocumentString(`
    mutation ReActiveUser($targetUserId: String!) {
  reActiveUser(targetUserId: $targetUserId)
}
    `) as unknown as TypedDocumentString<ReActiveUserMutation, ReActiveUserMutationVariables>;
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
        isReleased
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
    `) as unknown as TypedDocumentString<TracksWithFiltersQuery, TracksWithFiltersQueryVariables>;
export const TrackListHomeDocument = new TypedDocumentString(`
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
      artist {
        id
        stageName
        followerCount
      }
    }
  }
}
    `) as unknown as TypedDocumentString<TrackDetailQuery, TrackDetailQueryVariables>;
export const PendingArtistRegistrationsViewDocument = new TypedDocumentString(`
    query PendingArtistRegistrationsView($pageNumber: Int!, $pageSize: Int!) {
  pendingArtistRegistrations(pageNumber: $pageNumber, pageSize: $pageSize) {
    email
    fullName
    stageName
    artistType
    gender
    birthDate
    phoneNumber
    avatarImage
    id
  }
}
    `) as unknown as TypedDocumentString<PendingArtistRegistrationsViewQuery, PendingArtistRegistrationsViewQueryVariables>;
export const PendingArtistRegistrationsDetailDocument = new TypedDocumentString(`
    query PendingArtistRegistrationsDetail($id: String) {
  pendingArtistRegistrations(where: {id: {eq: $id}}) {
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
    `) as unknown as TypedDocumentString<PendingArtistRegistrationsDetailQuery, PendingArtistRegistrationsDetailQueryVariables>;
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