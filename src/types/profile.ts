export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  gender: string;
  birthDate: string;
  role: string;
  phoneNumber?: string | null;
  status: string;
  createdAt: string;
  updatedAt?: string | null;
}
export interface UpdateUserProfileData {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  phoneNumber?: string;
}