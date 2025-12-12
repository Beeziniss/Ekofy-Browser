import { UserStatus, UserGender, UserRole, ArtistType } from "@/gql/graphql";

export interface UserManagementUser {
  id: string;
  email: string;
  fullName: string;
  gender: UserGender;
  birthDate: string;
  role: UserRole;
  phoneNumber: string;
  status: UserStatus;
  isLinkedWithGoogle: boolean;
  stripeCustomerId?: string;
  stripeAccountId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserManagementArtist {
  id: string;
  userId: string;
  stageName: string;
  email: string;
  artistType: ArtistType;
  categoryIds: string[];
  biography?: string;
  followers: number;
  popularity: number;
  avatarImage?: string;
  bannerImage?: string;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  members?: ArtistMember[];
  identityCard?: IdentityCard;
  requestedAt: string;
}

export interface ArtistMember {
  fullName: string;
  email: string;
  phoneNumber: string;
  isLeader: boolean;
  gender: UserGender;
}

export interface IdentityCard {
  number: string;
  fullName: string;
  dateOfBirth: string;
  gender: UserGender;
  placeOfOrigin: string;
  nationality: string;
  validUntil: string;
  placeOfResidence?: PlaceOfResidence;
}

export interface PlaceOfResidence {
  street: string;
  ward: string;
  province: string;
  oldDistrict: string;
  oldWard: string;
  oldProvince: string;
  addressLine: string;
}

export interface UserManagementListener {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  avatarImage?: string;
  bannerImage?: string;
  isVerified: boolean;
  verifiedAt?: string;
  followerCount: number;
  followingCount: number;
  lastFollowers: string[];
  lastFollowings: string[];
  createdAt: string;
  updatedAt: string;
  restriction?: ListenerRestriction;
}

export interface ListenerRestriction {
  type: string;
  reason: string;
  restrictedAt: string;
  expired: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
}

export interface CreateModeratorForm {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  gender: UserGender;
  phoneNumber: string;
}

// Moderator-specific interfaces for user management
export interface ModeratorUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface ModeratorArtist {
  id: string;
  userId: string;
  stageName: string;
  artistType: ArtistType;
  bio?: string | null;
  biography?: string | null;
  bannerImage?: string | null;
  avatarImage?: string | null;
  followerCount: number;
  members?: ModeratorArtistMember[];
}

export interface ModeratorListener {
  id: string;
  userId: string;
  displayName: string;
  bio?: string | null;
  bannerImage?: string | null;
  avatarImage?: string | null;
  followerCount: number;
  followingCount: number;
}

export interface ModeratorArtistMember {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  isLeader?: boolean;
  gender?: "MALE" | "FEMALE" | "OTHER" | string;
  role?: string;
}

export interface ModeratorUserTableData {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  gender?: string;
  avatarImage?: string;
}

export interface ModeratorUserStatsData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
}

// GraphQL Response interfaces for Moderator User Detail queries

export interface ModeratorArtistDetailResponse {
  id: string;
  userId: string;
  stageName: string;
  email: string;
  artistType: ArtistType;
  members: ModeratorArtistDetailMember[];
  categoryIds: string[];
  biography?: string | null;
  followerCount: number;
  popularity: number;
  avatarImage?: string | null;
  bannerImage?: string | null;
  isVerified: boolean;
  verifiedAt?: string | null;
  identityCard: ModeratorIdentityCard;
  createdAt: string;
  user: ModeratorUserBasic;
}

export interface ModeratorArtistDetailMember {
  fullName: string;
  email: string;
  phoneNumber: string;
  isLeader: boolean;
  gender: UserGender;
}

export interface ModeratorIdentityCard {
  number: string;
  fullName: string;
  dateOfBirth: string | Date;
  gender: UserGender;
  placeOfOrigin: string;
  nationality: string;
  validUntil?: string | Date;
  placeOfResidence: ModeratorPlaceOfResidence;
}

export interface ModeratorPlaceOfResidence {
  street: string;
  ward: string;
  province: string;
  oldDistrict: string;
  oldWard: string;
  oldProvince: string;
  addressLine: string;
}

export interface ModeratorListenerDetailResponse {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  avatarImage?: string | null;
  bannerImage?: string | null;
  isVerified: boolean;
  verifiedAt?: string | null;
  followerCount: number;
  followingCount: number;
  createdAt: string;
  restriction?: ModeratorListenerRestriction | null; // Can be null
  user?: ModeratorUserBasic | null; // Can be null
}

export interface ModeratorListenerRestriction {
  type: string;
  reason?: string | null; // Can be null
  restrictedAt?: string | null; // Can be null
  expired?: string | null; // Can be null
}

export interface ModeratorUserBasic {
  fullName: string;
  role?: UserRole;
  phoneNumber?: string;
  birthDate?: string;
  gender?: UserGender;
}
