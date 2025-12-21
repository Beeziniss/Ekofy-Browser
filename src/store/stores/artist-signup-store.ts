import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// import { toast } from "sonner";
import { UserGender } from "@/gql/graphql";
import { ArtistType } from "@/types/artist_type";
// Define artist signup steps - removed OTP step
export type ArtistSignUpStep = "form" | "type" | "members" | "identity" | "cccd" /* | "otp" */;

export interface ArtistMemberData {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: UserGender;
}

export interface IdentityCardData {
  number?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: UserGender;
  placeOfOrigin?: string;
  nationality?: string;
  placeOfResidence?: {
    street?: string;
    ward?: string;
    province?: string;
    addressLine?: string;
  };
  frontImage?: string;
  backImage?: string;
  validUntil?: string;
}

export interface ArtistSignUpFormData {
  // Basic info
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: string;
  gender: UserGender;
  phoneNumber: string;

  // Artist specific
  stageName?: string;
  artistType?: ArtistType;
  isLegalRepresentative?: boolean;
  avatarImage?: string; // Add avatar image URL

  // Members (for groups)
  members?: ArtistMemberData[];

  // Identity verification
  identityCard?: IdentityCardData;

  // OTP
  otp?: string;
}

interface ArtistSignUpState {
  // State
  currentStep: ArtistSignUpStep;
  formData: Partial<ArtistSignUpFormData>;

  // Temporary session data (not persisted)
  sessionData: {
    password?: string;
    confirmPassword?: string;
  };

  // CCCD processing states
  isProcessingCCCD: boolean;
  cccdFrontProcessed: boolean;
  cccdBackProcessed: boolean;

  // Actions
  setStep: (step: ArtistSignUpStep) => void;
  updateFormData: (data: Partial<ArtistSignUpFormData>) => void;
  updateSessionData: (data: { password?: string; confirmPassword?: string }) => void;
  goToNextStep: (stepData?: Partial<ArtistSignUpFormData>) => void;
  goToPreviousStep: () => void;

  // CCCD specific actions
  setProcessingCCCD: (processing: boolean) => void;
  setCCCDFrontProcessed: (processed: boolean) => void;
  setCCCDBackProcessed: (processed: boolean) => void;
  updateIdentityCard: (identityData: Partial<IdentityCardData>) => void;

  // // Registration flow
  // proceedToRegistration: () => void; // New action for triggering API registration

  // Complete flow
  completeOTPVerification: (otpData: { otp: string }) => void;
  clearSessionData: () => void;
  resetForm: () => void;
}

const initialState = {
  currentStep: "form" as ArtistSignUpStep,
  formData: {
    artistType: "Individual" as ArtistType, // Default to Individual
    isLegalRepresentative: true,
    members: [],
    identityCard: {
      placeOfResidence: {},
    },
  },
  sessionData: {
    password: undefined,
    confirmPassword: undefined,
  },
  isProcessingCCCD: false,
  cccdFrontProcessed: false,
  cccdBackProcessed: false,
};

// Step navigation logic - Updated flow without OTP
const getNextStep = (current: ArtistSignUpStep, formData?: Partial<ArtistSignUpFormData>): ArtistSignUpStep => {
  switch (current) {
    case "form":
      return "cccd"; // Form -> CCCD
    case "cccd":
      return "type"; // CCCD -> Type Selection
    case "type":
      return "identity"; // Type -> Identity (always)
    case "identity":
      // Dynamic navigation based on artist type
      if (formData?.artistType === "INDIVIDUAL") {
        return "identity"; // Individual -> Stay on identity (registration happens here)
      } else {
        return "members"; // Band/Group -> Members
      }
    case "members":
      return "members"; // Members -> Stay on members (registration happens here)
    // case "otp":
    //   return "otp"; // Stay on otp if it's the last step
    default:
      return "form";
  }
};

const getPreviousStep = (current: ArtistSignUpStep): ArtistSignUpStep => {
  switch (current) {
    case "cccd":
      return "form";
    case "type":
      return "cccd";
    case "identity":
      return "type";
    case "members":
      return "identity";
    // case "otp":
    //   // Dynamic back navigation based on artist type
    //   if (formData?.artistType === "INDIVIDUAL") {
    //     return "identity"; // Individual: OTP -> Identity
    //   } else {
    //     return "members"; // Band/Group: OTP -> Members
    //   }
    case "form":
      return "form"; // Stay on form if it's the first step
    default:
      return "form";
  }
};

export const useArtistSignUpStore = create<ArtistSignUpState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Set current step
        setStep: (step: ArtistSignUpStep) => {
          set({ currentStep: step }, false, "artistSignup/setStep");
        },

        // Update form data
        updateFormData: (data: Partial<ArtistSignUpFormData>) => {
          set(
            (state) => ({
              formData: { ...state.formData, ...data },
            }),
            false,
            "artistSignup/updateFormData",
          );
        },

        // Update session data (not persisted)
        updateSessionData: (data: { password?: string; confirmPassword?: string }) => {
          set(
            (state) => ({
              sessionData: { ...state.sessionData, ...data },
            }),
            false,
            "artistSignup/updateSessionData",
          );
        },

        // Go to next step
        goToNextStep: (stepData?: Partial<ArtistSignUpFormData>) => {
          const state = get();
          const currentStep = state.currentStep;
          const updatedFormData = stepData ? { ...state.formData, ...stepData } : state.formData;
          const nextStep = getNextStep(currentStep, updatedFormData);
          set(
            {
              currentStep: nextStep,
              formData: updatedFormData,
            },
            false,
            "artistSignup/goToNextStep",
          );
        },

        // Go to previous step
        goToPreviousStep: () => {
          const state = get();
          const currentStep = state.currentStep;
          const prevStep = getPreviousStep(currentStep);

          // Only clear password session data when navigating back to form step for security
          let sessionData = state.sessionData;
          if (prevStep === "form") {
            sessionData = {
              password: undefined,
              confirmPassword: undefined,
            };
          }

          set(
            {
              currentStep: prevStep,
              sessionData: sessionData,
            },
            false,
            "artistSignup/goToPreviousStep",
          );
        },

        // CCCD processing
        setProcessingCCCD: (processing: boolean) => {
          set({ isProcessingCCCD: processing }, false, "artistSignup/setProcessingCCCD");
        },

        setCCCDFrontProcessed: (processed: boolean) => {
          set({ cccdFrontProcessed: processed }, false, "artistSignup/setCCCDFrontProcessed");
        },

        setCCCDBackProcessed: (processed: boolean) => {
          set({ cccdBackProcessed: processed }, false, "artistSignup/setCCCDBackProcessed");
        },

        updateIdentityCard: (identityData: Partial<IdentityCardData>) => {
          set(
            (state) => ({
              ...state,
              formData: {
                ...state.formData,
                identityCard: {
                  ...state.formData.identityCard,
                  ...identityData,
                  placeOfResidence: {
                    ...state.formData.identityCard?.placeOfResidence,
                    ...identityData.placeOfResidence,
                  },
                },
              },
            }),
            false,
            "artistSignup/updateIdentityCard",
          );
        },
        completeOTPVerification: () => {
          // No longer used - keeping for compatibility
        },

        // Clear session data (for security)
        clearSessionData: () => {
          set(
            () => ({
              sessionData: {
                password: undefined,
                confirmPassword: undefined,
              },
            }),
            false,
            "artistSignup/clearSessionData",
          );
        },

        // Reset form
        resetForm: () => {
          set(
            {
              ...initialState,
              setStep: get().setStep,
              updateFormData: get().updateFormData,
              updateSessionData: get().updateSessionData,
              goToNextStep: get().goToNextStep,
              goToPreviousStep: get().goToPreviousStep,
              setProcessingCCCD: get().setProcessingCCCD,
              setCCCDFrontProcessed: get().setCCCDFrontProcessed,
              setCCCDBackProcessed: get().setCCCDBackProcessed,
              updateIdentityCard: get().updateIdentityCard,
              // proceedToRegistration: get().proceedToRegistration,
              completeOTPVerification: get().completeOTPVerification,
              clearSessionData: get().clearSessionData,
              resetForm: get().resetForm,
            },
            false,
            "artistSignup/resetForm",
          );
        },
      }),
      {
        name: "artist-signup-store", // localStorage key for global state persistence
        partialize: (state) => ({
          currentStep: state.currentStep,
          formData: state.formData,
          isProcessingCCCD: state.isProcessingCCCD,
          cccdFrontProcessed: state.cccdFrontProcessed,
          cccdBackProcessed: state.cccdBackProcessed,
          // sessionData is intentionally excluded from persistence for security
        }), // Only persist essential data
      },
    ),
    {
      name: "artist-signup-devtools", // devtools name
    },
  ),
);
