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
  followers: Scalars['Long']['output'];
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
  followers?: InputMaybe<LongOperationFilterInput>;
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

export enum ArtistRole {
  Composer = 'COMPOSER',
  Featured = 'FEATURED',
  Main = 'MAIN',
  Remixer = 'REMIXER'
}

export type ArtistSortInput = {
  artistType?: InputMaybe<SortEnumType>;
  avatarImage?: InputMaybe<SortEnumType>;
  bannerImage?: InputMaybe<SortEnumType>;
  biography?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  followers?: InputMaybe<SortEnumType>;
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

export enum CategoryType {
  Genre = 'GENRE',
  Mood = 'MOOD'
}

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

export type CreateAdminRequestInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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

export type CreateCheckoutSessionRequestInput = {
  cancelUrl: Scalars['String']['input'];
  isSavePaymentMethod: Scalars['Boolean']['input'];
  period: PeriodTime;
  subscriptionCode: Scalars['String']['input'];
  successUrl: Scalars['String']['input'];
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

export type CreateModeratorRequestInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateMomoPaymentRequestInput = {
  amount: Scalars['Long']['input'];
  orderId: Scalars['String']['input'];
  orderInfo: Scalars['String']['input'];
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

export type CreateSubScriptionPlanRequestInput = {
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata?: InputMaybe<Array<KeyValuePairOfStringAndStringInput>>;
  name: Scalars['String']['input'];
  prices: Array<CreatePriceRequestInput>;
  subscriptionCode: Scalars['String']['input'];
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

export type EntitlementRoleDefault = {
  __typename?: 'EntitlementRoleDefault';
  role: UserRole;
};

export type EntitlementSubscriptionOverride = {
  __typename?: 'EntitlementSubscriptionOverride';
  subscriptionCode: Scalars['String']['output'];
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

export type ListFilterInputTypeOfLegalDocumentFilterInput = {
  all?: InputMaybe<LegalDocumentFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<LegalDocumentFilterInput>;
  some?: InputMaybe<LegalDocumentFilterInput>;
};

export type ListFilterInputTypeOfSyncedLineFilterInput = {
  all?: InputMaybe<SyncedLineFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<SyncedLineFilterInput>;
  some?: InputMaybe<SyncedLineFilterInput>;
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

export type MutationInitialization = {
  __typename?: 'MutationInitialization';
  approveTrackUploadRequest: Scalars['Boolean']['output'];
  convertToHls: Scalars['String']['output'];
  convertToWavFile: WavFileResponse;
  createAdmin: Scalars['Boolean']['output'];
  createBillingPortalConfiguration: Scalars['Boolean']['output'];
  createCategory: Scalars['Boolean']['output'];
  createCoupon: Scalars['Boolean']['output'];
  createCustomerPortalSession: Scalars['String']['output'];
  /** Create a test entitlement for demonstration purposes. */
  createEntilement: Scalars['Boolean']['output'];
  createEntitlement: Scalars['Boolean']['output'];
  createExpressConnectedAccount: AccountLinkResponse;
  createModerator: Scalars['Boolean']['output'];
  createMomoPaymentQR: MomoPaymentResponse;
  createMomoPaymentVisa: MomoPaymentResponse;
  createRequest: Scalars['Boolean']['output'];
  createSubscriotionCheckoutSession: CheckoutSessionResponse;
  createSubscription: Scalars['Boolean']['output'];
  createSubscriptionPlan: Scalars['Boolean']['output'];
  deactiveEntitlement: Scalars['Boolean']['output'];
  deleteCoupon: Scalars['Boolean']['output'];
  deprecateCoupon: Scalars['Boolean']['output'];
  deprecateSubscription: Scalars['Boolean']['output'];
  entitlementUserCount: Scalars['Long']['output'];
  entitlements: Array<Entitlement>;
  hello: Scalars['String']['output'];
  reactiveEntitlement: Scalars['Boolean']['output'];
  registerArtistManual: Scalars['Boolean']['output'];
  rejectTrackUploadRequest: Scalars['Boolean']['output'];
  seedEntitlements: Scalars['Boolean']['output'];
  updateRequest: Scalars['Boolean']['output'];
  uploadFile: Scalars['String']['output'];
  uploadTrack: Scalars['Boolean']['output'];
};


export type MutationInitializationApproveTrackUploadRequestArgs = {
  recordingId: Scalars['String']['input'];
  trackId: Scalars['String']['input'];
  workId: Scalars['String']['input'];
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


export type MutationInitializationCreateModeratorArgs = {
  createModeratorRequest: CreateModeratorRequestInput;
};


export type MutationInitializationCreateMomoPaymentQrArgs = {
  createMomoPaymentRequest: CreateMomoPaymentRequestInput;
};


export type MutationInitializationCreateMomoPaymentVisaArgs = {
  createMomoPaymentRequest: CreateMomoPaymentRequestInput;
};


export type MutationInitializationCreateRequestArgs = {
  request: RequestCreatingRequestInput;
};


export type MutationInitializationCreateSubscriotionCheckoutSessionArgs = {
  createCheckoutSessionRequest: CreateCheckoutSessionRequestInput;
};


export type MutationInitializationCreateSubscriptionArgs = {
  createSubscriptionRequest: CreateSubscriptionRequestInput;
};


export type MutationInitializationCreateSubscriptionPlanArgs = {
  createSubScriptionPlanRequest: CreateSubScriptionPlanRequestInput;
};


export type MutationInitializationDeactiveEntitlementArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationDeleteCouponArgs = {
  couponIds: Array<Scalars['String']['input']>;
};


export type MutationInitializationDeprecateCouponArgs = {
  couponIds: Array<Scalars['String']['input']>;
};


export type MutationInitializationDeprecateSubscriptionArgs = {
  subscriptionId: Scalars['String']['input'];
};


export type MutationInitializationEntitlementUserCountArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationReactiveEntitlementArgs = {
  code: Scalars['String']['input'];
};


export type MutationInitializationRegisterArtistManualArgs = {
  createArtistRequest: CreateArtistRequestInput;
};


export type MutationInitializationRejectTrackUploadRequestArgs = {
  recordingId: Scalars['String']['input'];
  trackId: Scalars['String']['input'];
  workId: Scalars['String']['input'];
};


export type MutationInitializationUpdateRequestArgs = {
  request: RequestUpdatingRequestInput;
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

export enum PeriodTime {
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type QueryInitialization = {
  __typename?: 'QueryInitialization';
  allCoupons: Array<Coupon>;
  artists: Array<Artist>;
  entitlements: Array<Entitlement>;
  hello: Scalars['String']['output'];
  messagesExecutable: Array<Message>;
  metadataRecordingUploadRequest: RecordingTempRequest;
  metadataTrackUploadRequest: TrackTempRequest;
  metadataWorkUploadRequest: WorkTempRequest;
  originalFileTrackUploadRequest: Scalars['String']['output'];
  pendingTrackUploadRequests: Array<TrackTempRequest>;
  recordingsQueryable: Array<Recording>;
  requests: Array<RequestHub>;
  tracks: Array<Track>;
  userById: User;
  users: Array<User>;
  worksQueryable: Array<Work>;
};


export type QueryInitializationAllCouponsArgs = {
  order?: InputMaybe<Array<CouponSortInput>>;
  where?: InputMaybe<CouponFilterInput>;
};


export type QueryInitializationArtistsArgs = {
  order?: InputMaybe<Array<ArtistSortInput>>;
  where?: InputMaybe<ArtistFilterInput>;
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


export type QueryInitializationOriginalFileTrackUploadRequestArgs = {
  trackId: Scalars['String']['input'];
};


export type QueryInitializationTracksArgs = {
  order?: InputMaybe<Array<TrackSortInput>>;
  where?: InputMaybe<TrackFilterInput>;
};


export type QueryInitializationUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryInitializationUsersArgs = {
  order?: InputMaybe<Array<UserSortInput>>;
  where?: InputMaybe<UserFilterInput>;
};

export type Recording = {
  __typename?: 'Recording';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  recordingSplits: Array<RecordingSplit>;
  trackId: Scalars['String']['output'];
};

export type RecordingSplit = {
  __typename?: 'RecordingSplit';
  artistRole: ArtistRole;
  percentage: Scalars['Decimal']['output'];
  userId: Scalars['String']['output'];
};

export type RecordingTempRequest = {
  __typename?: 'RecordingTempRequest';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  recordingSplitRequests: Array<CreateRecordingSplitRequest>;
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

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Deprecated = 'DEPRECATED',
  Inactive = 'INACTIVE'
}

export enum SubscriptionTier {
  Free = 'FREE',
  Premium = 'PREMIUM',
  Pro = 'PRO'
}

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

export type Track = {
  __typename?: 'Track';
  artist: Array<Maybe<Artist>>;
  category: Array<Maybe<Category>>;
  categoryIds: Array<Scalars['String']['output']>;
  coverImage: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
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

export type TrackFilterInput = {
  and?: InputMaybe<Array<TrackFilterInput>>;
  audioFeature?: InputMaybe<AudioFeatureFilterInput>;
  audioFingerprint?: InputMaybe<AudioFingerprintFilterInput>;
  categoryIds?: InputMaybe<ListStringOperationFilterInput>;
  coverImage?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  createdBy?: InputMaybe<StringOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
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

export type UpdateEntitlementRequestInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  expiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['EntitlementValue']['input']>;
  valueType?: InputMaybe<EntitlementValueType>;
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

export type WavFileResponse = {
  __typename?: 'WavFileResponse';
  originalBitrate: Scalars['Long']['output'];
  outputWavPath: Scalars['String']['output'];
};

export type Work = {
  __typename?: 'Work';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  trackId: Scalars['String']['output'];
  workSplits: Array<WorkSplit>;
};

export type WorkSplit = {
  __typename?: 'WorkSplit';
  artistRole: ArtistRole;
  percentage: Scalars['Decimal']['output'];
  userId: Scalars['String']['output'];
};

export type WorkTempRequest = {
  __typename?: 'WorkTempRequest';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  workSplits: Array<CreateWorkSplitRequest>;
};

export type TracksQueryVariables = Exact<{ [key: string]: never; }>;


export type TracksQuery = { __typename?: 'QueryInitialization', tracks: Array<{ __typename?: 'Track', id: string, name: string, description?: string | null, previewVideo?: string | null }> };

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

export const TracksDocument = new TypedDocumentString(`
    query Tracks {
  tracks {
    id
    name
    description
    previewVideo
  }
}
    `) as unknown as TypedDocumentString<TracksQuery, TracksQueryVariables>;