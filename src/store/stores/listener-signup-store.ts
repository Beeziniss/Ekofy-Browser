import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Define types locally to avoid circular dependencies
export type SignUpStep = "form" | "profile" | "otp";

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: Date | string | undefined; // Allow both Date and string to handle localStorage persistence
  gender: string;
  displayName: string;
  avatarImage?: string; // Add avatar image URL
  otp?: string;
}

interface SignUpState {
  // State
  currentStep: SignUpStep;
  formData: Partial<SignUpFormData>;

  // Actions
  setStep: (step: SignUpStep) => void;
  updateFormData: (data: Partial<SignUpFormData>) => void;
  goToNextStep: (stepData?: Partial<SignUpFormData>) => void;
  goToPreviousStep: () => void;
  goToPreviousStepFromOTP: () => void; // Action for OTP back navigation
  completeOTPVerification: (otpData: { otp: string }) => void;
  resetForm: () => void;
  clearOTPData: () => void; // Action to clear OTP data
}

const initialState = {
  currentStep: "form" as SignUpStep,
  formData: {},
};

// Helper function to normalize birthDate
const normalizeBirthDate = (birthDate: Date | string | undefined): Date | undefined => {
  if (!birthDate) return undefined;
  if (birthDate instanceof Date) return birthDate;
  if (typeof birthDate === "string") {
    const date = new Date(birthDate);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
};

// Step navigation logic
const getNextStep = (current: SignUpStep): SignUpStep => {
  switch (current) {
    case "form":
      return "profile";
    case "profile":
      return "otp";
    case "otp":
      return "otp"; // Stay on otp if it's the last step
    default:
      return "form";
  }
};

const getPreviousStep = (current: SignUpStep): SignUpStep => {
  switch (current) {
    case "profile":
      return "form";
    case "otp":
      return "profile";
    case "form":
      return "form"; // Stay on form if it's the first step
    default:
      return "form";
  }
};

export const useSignUpStore = create<SignUpState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Set current step
        setStep: (step: SignUpStep) => {
          set({ currentStep: step }, false, "signup/setStep");
        },

        // Update form data
        updateFormData: (data: Partial<SignUpFormData>) => {
          // Normalize birthDate if it exists in the data
          const normalizedData = { ...data };
          if (data.birthDate !== undefined) {
            normalizedData.birthDate = normalizeBirthDate(data.birthDate);
          }

          set(
            (state) => ({
              formData: { ...state.formData, ...normalizedData },
            }),
            false,
            "signup/updateFormData",
          );
        },

        // Go to next step
        goToNextStep: (stepData?: Partial<SignUpFormData>) => {
          const currentStep = get().currentStep;
          const nextStep = getNextStep(currentStep);
          set(
            (state) => ({
              currentStep: nextStep,
              formData: stepData ? { ...state.formData, ...stepData } : state.formData,
            }),
            false,
            "signup/goToNextStep",
          );
        },

        // Go to previous step
        goToPreviousStep: () => {
          const currentStep = get().currentStep;
          const prevStep = getPreviousStep(currentStep);

          set({ currentStep: prevStep }, false, "signup/goToPreviousStep");
        },

        // Go to previous step from OTP - goes directly to form and clears OTP data
        goToPreviousStepFromOTP: () => {
          set(
            (state) => ({
              currentStep: "profile",
              formData: { ...state.formData, otp: undefined }, // Clear OTP data
            }),
            false,
            "signup/goToPreviousStepFromOTP",
          );
        },

        // Complete OTP verification
        completeOTPVerification: (otpData: { otp: string }) => {
          const { updateFormData } = get();

          // Update form data with OTP
          updateFormData(otpData);

          // Navigation or completion logic can be handled by the component
        },

        // Clear OTP data
        clearOTPData: () => {
          set(
            (state) => ({
              formData: { ...state.formData, otp: undefined },
            }),
            false,
            "signup/clearOTPData",
          );
        },

        // Reset form
        resetForm: () => {
          set(initialState, false, "signup/resetForm");
        },
      }),
      {
        name: "listener-signup-store", // localStorage key for global state persistence
        partialize: (state) => ({
          currentStep: state.currentStep,
          formData: state.formData,
        }), // Only persist essential data
        // Custom storage to handle Date serialization/deserialization
        storage: {
          getItem: (name: string) => {
            const item = localStorage.getItem(name);
            if (!item) return null;

            try {
              const parsed = JSON.parse(item);
              // Convert birthDate string back to Date if it exists
              if (parsed.state?.formData?.birthDate && typeof parsed.state.formData.birthDate === "string") {
                parsed.state.formData.birthDate = new Date(parsed.state.formData.birthDate);
              }
              return parsed;
            } catch (error) {
              console.error("Error parsing stored data:", error);
              return null;
            }
          },
          setItem: (name: string, value: unknown) => {
            try {
              const stringified = JSON.stringify(value);
              localStorage.setItem(name, stringified);
            } catch (error) {
              console.error("Error storing data:", error);
            }
          },
          removeItem: (name: string) => {
            localStorage.removeItem(name);
          },
        },
      },
    ),
    {
      name: "signup-store", // devtools name
    },
  ),
);
