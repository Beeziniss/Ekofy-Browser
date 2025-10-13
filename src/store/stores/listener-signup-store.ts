import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";

// Define types locally to avoid circular dependencies
export type SignUpStep = "form" | "profile" | "otp";

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: Date | undefined;
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
  completeOTPVerification: (otpData: { otp: string }) => void;
  resetForm: () => void;
}

const initialState = {
  currentStep: "form" as SignUpStep,
  formData: {},
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
    (set, get) => ({
      ...initialState,

      // Set current step
      setStep: (step: SignUpStep) => {
        set({ currentStep: step }, false, "signup/setStep");
      },

      // Update form data
      updateFormData: (data: Partial<SignUpFormData>) => {
        set(
          (state) => ({
            formData: { ...state.formData, ...data },
          }),
          false,
          "signup/updateFormData"
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
          "signup/goToNextStep"
        );
        
      },

      // Go to previous step
      goToPreviousStep: () => {
        const currentStep = get().currentStep;
        const prevStep = getPreviousStep(currentStep);
        
        set({ currentStep: prevStep }, false, "signup/goToPreviousStep");
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
        set(initialState, false, "signup/resetForm");
      },
    }),
    {
      name: "signup-store", // Remove persistence, just for devtools
    }
  )
);