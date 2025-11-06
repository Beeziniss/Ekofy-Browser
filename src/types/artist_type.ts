export enum ArtistType {
  Band = "BAND",
  Group = "GROUP",
  Individual = "INDIVIDUAL",
}

// Artist Sign-Up Form Data Types
export interface ArtistSignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface ArtistIdentityData {
  stageName: string;
  avatarImage?: File | null;
  coverImage?: File | null;
}

export interface ArtistMemberData {
  fullName: string;
  email: string;
  phoneNumber: string;
  isLeader: boolean;
  gender: "MALE" | "FEMALE" | "OTHER";
}

export interface ArtistMembersData {
  members: ArtistMemberData[];
}

export interface ArtistCCCDData {
  // CCCD/Identity Card data
  frontId?: File | null;
  backId?: File | null;
  authorizationLetter?: File | null;
  citizenId?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  placeOfOrigin?: string;
  placeOfResidence?: string;
  dateOfExpiration?: string;
  phoneNumber?: string;
  isManager?: boolean;
  managerEmail?: string;
  managerPassword?: string;
  hasManager?: boolean;
  // Legacy fields
  identityCardNumber?: string;
  identityCardFullName?: string;
  identityCardDateOfBirth?: string;
  identityCardGender?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  // Verification data
  isVerified?: boolean;
  verificationError?: string;
}

export interface ArtistOTPData {
  otp?: string | string[];
  otpCode?: string;
  phoneNumber?: string;
}

// Union type for different step data
export type ArtistSignUpStepData =
  | ArtistSignUpFormData
  | ArtistIdentityData
  | ArtistMembersData
  | ArtistCCCDData
  | ArtistOTPData
  | undefined;

// Props for section components
export interface ArtistSignUpSectionProps<T = ArtistSignUpStepData> {
  onNext: (data?: T) => void;
  onBack?: () => void;
  initialData?: T;
}
