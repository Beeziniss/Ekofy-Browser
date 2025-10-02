export interface UserProfile {
  id: string;
  email: string;
  gender: string;
  birthDate: string;
  role: string;
  phoneNumber?: string | null;
  status: string;
  createdAt: string;
  updatedAt?: string | null;
}