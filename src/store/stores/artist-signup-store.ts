import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import { UserGender } from "@/gql/graphql";
import { ArtistType } from "@/types/artist_type";
// Define artist signup steps
export type ArtistSignUpStep = "form" | "type" | "members" | "identity" | "cccd" | "otp";

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
  
  // CCCD processing states
  isProcessingCCCD: boolean;
  cccdFrontProcessed: boolean;
  cccdBackProcessed: boolean;

  // Actions
  setStep: (step: ArtistSignUpStep) => void;
  updateFormData: (data: Partial<ArtistSignUpFormData>) => void;
  goToNextStep: (stepData?: Partial<ArtistSignUpFormData>) => void;
  goToPreviousStep: () => void;
  
  // CCCD specific actions
  setProcessingCCCD: (processing: boolean) => void;
  setCCCDFrontProcessed: (processed: boolean) => void;
  setCCCDBackProcessed: (processed: boolean) => void;
  updateIdentityCard: (identityData: Partial<IdentityCardData>) => void;
  
  // Registration flow
  proceedToRegistration: () => void; // New action for triggering API registration
  
  // Complete flow
  completeOTPVerification: (otpData: { otp: string }) => void;
  resetForm: () => void;
}

const initialState = {
  currentStep: "form" as ArtistSignUpStep,
  formData: {
    artistType: "Individual" as ArtistType, // Default to Individual
    isLegalRepresentative: true,
    members: [],
    identityCard: {
      placeOfResidence: {}
    }
  },
  isProcessingCCCD: false,
  cccdFrontProcessed: false,
  cccdBackProcessed: false,
};

// Step navigation logic - Updated flow
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
        return "otp"; // Individual -> OTP (call API register before this)
      } else {
        return "members"; // Band/Group -> Members
      }
    case "members":
      return "otp"; // Members -> OTP (call API register before this)
    case "otp":
      return "otp"; // Stay on otp if it's the last step
    default:
      return "form";
  }
};

const getPreviousStep = (current: ArtistSignUpStep, formData?: Partial<ArtistSignUpFormData>): ArtistSignUpStep => {
  switch (current) {
    case "cccd":
      return "form";
    case "type":
      return "cccd";
    case "identity":
      return "type";
    case "members":
      return "identity";
    case "otp":
      // Dynamic back navigation based on artist type
      if (formData?.artistType === "INDIVIDUAL") {
        return "identity"; // Individual: OTP -> Identity
      } else {
        return "members"; // Band/Group: OTP -> Members
      }
    case "form":
      return "form"; // Stay on form if it's the first step
    default:
      return "form";
  }
};

export const useArtistSignUpStore = create<ArtistSignUpState>()(
  devtools(
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
          "artistSignup/updateFormData"
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
          "artistSignup/goToNextStep"
        );
      },

      // Go to previous step
      goToPreviousStep: () => {
        const state = get();
        const currentStep = state.currentStep;
        const prevStep = getPreviousStep(currentStep, state.formData);
        
        set({ currentStep: prevStep }, false, "artistSignup/goToPreviousStep");
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
        console.log("🆔 ArtistSignUp - Updating identity card:", identityData);
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
          "artistSignup/updateIdentityCard"
        );
      },

      // Proceed to registration - triggers API call and moves to OTP
      proceedToRegistration: () => {
        // Move to OTP step - the component will handle API call
        set({ currentStep: "otp" }, false, "artistSignup/proceedToRegistration");
      },

      // Complete OTP verification
      completeOTPVerification: (otpData: { otp: string }) => {
        const { updateFormData } = get();
        
        // Update form data with OTP
        updateFormData(otpData);
        
        // Show success message
        toast.success("Xác thực OTP thành công!");
        
        // Navigation or completion logic can be handled by the component
      },

      // Reset form
      resetForm: () => {
        set(
          {
            ...initialState,
            setStep: get().setStep,
            updateFormData: get().updateFormData,
            goToNextStep: get().goToNextStep,
            goToPreviousStep: get().goToPreviousStep,
            setProcessingCCCD: get().setProcessingCCCD,
            setCCCDFrontProcessed: get().setCCCDFrontProcessed,
            setCCCDBackProcessed: get().setCCCDBackProcessed,
            updateIdentityCard: get().updateIdentityCard,
            proceedToRegistration: get().proceedToRegistration,
            completeOTPVerification: get().completeOTPVerification,
            resetForm: get().resetForm,
          },
          false,
          "artistSignup/resetForm"
        );
      },
    }),
    {
      name: "artist-signup-store",
    }
  )
);