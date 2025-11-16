import { Base } from "./base";
import { UserRole } from "./role";
import { UserGender } from "@/gql/graphql"; // Use GraphQL enum
import { ArtistType } from "./artist_type";
export interface IUserLocalStorage {
  userId: string;
  listenerId?: string;
  artistId?: string;
  role: UserRole;
}
export interface IUserCurrentData {
  userId: string;
  role: UserRole;
  listenerId?: string;
  artistId?: string;
}

export interface ListenerLoginData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  listenerId: string;
  role: UserRole;
}

export interface ArtistLoginData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  artistId: string;
  role: UserRole;
}

export interface ModeratorLoginData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  role: UserRole;
}

export interface AdminLoginData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  role: UserRole;
}

export interface RegisterListenerData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: string;
  gender: string;
  displayName: string;
}

export interface RegisterArtistData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: string; // ISO date format
  gender: UserGender;
  phoneNumber: string;
  avatarImage?: string; // Add avatar image URL
  // Artist specific
  stageName?: string;
  artistType: ArtistType;

  // Members (for groups)
  members: {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: UserGender;
  }[];

  // Identity card information
  identityCard: {
    number: string;
    fullName: string;
    dateOfBirth: string;
    gender: UserGender;
    placeOfOrigin: string;
    nationality: string;
    placeOfResidence: {
      street?: string;
      ward?: string;
      province?: string;
      addressLine: string;
    };
    frontImage: string;
    backImage: string;
    validUntil: string;
  };
}

export interface RefreshTokenData {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type IUserCurrent = Base<IUserCurrentData>;
export type ListenerLoginResponse = Base<ListenerLoginData>;
export type ArtistLoginResponse = Base<ArtistLoginData>;
export type ModeratorLoginResponse = Base<ModeratorLoginData>;
export type AdminLoginResponse = Base<AdminLoginData>;
export type RegisterArtistResponse = Base<RegisterArtistData>;
export type RefreshTokenResponse = Base<RefreshTokenData>;
