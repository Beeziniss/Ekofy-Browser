import { Base } from "./base";
import { UserRole } from "./role";

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

export type IUserCurrent = Base<IUserCurrentData>;
export type ListenerLoginResponse = Base<ListenerLoginData>;
export type ArtistLoginResponse = Base<ArtistLoginData>;
