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
  lastFollowing: string[];
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