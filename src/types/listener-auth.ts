// Client Authentication Types

export type ClientSignUpStep = "form" | "profile" | "otp";

// Form data interfaces for each step
export interface ClientSignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ClientProfileData {
  displayName: string;
  fullName: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  avatar?: File | null;
  avatarImage?: string;
}

export interface ClientOTPData {
  otp: string;
}

// Complete client sign-up data combining all steps
export interface CompleteClientSignUpData extends ClientSignUpFormData, Omit<ClientProfileData, "avatar"> {
  avatarImage?: string;
}

// Props interfaces for section components
export interface ClientSignUpSectionProps<T = unknown> {
  onNext: (data?: T) => void;
  onBack?: () => void;
  initialData?: Partial<T>;
}

// Specific props for each section
export interface ClientSignUpFormSectionProps {
  onNext: (data?: ClientSignUpFormData) => void;
  initialData?: Partial<ClientSignUpFormData>;
}

export interface ClientProfileCompletionSectionProps {
  onNext: (data?: ClientProfileData) => void;
  onBack: () => void;
  initialData?: Partial<ClientProfileData & { dateOfBirth?: Date | undefined }>;
}

export interface ClientOTPVerificationSectionProps {
  onNext: (data?: ClientOTPData) => void;
  onBack: () => void;
  initialData?: Partial<ClientOTPData>;
}

// Store state interface
export interface ClientSignUpStoreState {
  currentStep: ClientSignUpStep;
  formData: Partial<CompleteClientSignUpData>;
}

// Store actions interface
export interface ClientSignUpStoreActions {
  setStep: (step: ClientSignUpStep) => void;
  updateFormData: (data: Partial<CompleteClientSignUpData>) => void;
  goToNextStep: (stepData?: Partial<CompleteClientSignUpData>) => void;
  goToPreviousStep: () => void;
  goToPreviousStepFromOTP: () => void;
  completeOTPVerification: (otpData: ClientOTPData) => void;
  resetForm: () => void;
  clearOTPData: () => void;
}

// Combined store interface
export interface ClientSignUpStore extends ClientSignUpStoreState, ClientSignUpStoreActions {}

// API request interfaces
export interface ClientRegistrationRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: string; // API expects string format
  gender: string;
  displayName: string;
  avatarImage?: string;
}

export interface ClientOTPVerificationRequest {
  otp: string;
}

export interface ClientResendOTPRequest {
  email: string;
}

// Response types
export interface ClientRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

export interface ClientOTPVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    token: string;
  };
}
