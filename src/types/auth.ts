import { Base } from "./base";
import { UserRole } from "./role";

export interface IUserLocalStorage {
  userId: string;
  role: UserRole;
}
export interface IUserCurrentData {
  userId: string;
  role: UserRole;
}

export interface ListenerLoginData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  listenerId: string;
  role: UserRole;
}

export type IUserCurrent = Base<IUserCurrentData>;
export type ListenerLoginResponse = Base<ListenerLoginData>;
