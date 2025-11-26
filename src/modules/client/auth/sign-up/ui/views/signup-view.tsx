"use client";

import React from "react";
import SignUpLayout from "../layouts/signup-layout";
import { SignUpImageSection, SignUpFormSection, OTPVerificationSection, ProfileCompletionSection } from "../sections";
import { useSignUpStore } from "@/store/stores/listener-signup-store";
// import { ClientSignUpStep } from '@/types/client-auth';

const SignUpView = () => {
  const { currentStep, formData } = useSignUpStore();

  // Helper function to normalize date from store
  const normalizeDateFromStore = (dateValue: Date | string | undefined): Date | undefined => {
    if (!dateValue) return undefined;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === "string") {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "form":
        return (
          <SignUpLayout>
            <SignUpFormSection
              onNext={() => {}}
              initialData={{
                email: formData.email || "",
              }}
            />
            <SignUpImageSection />
          </SignUpLayout>
        );
      case "profile":
        return (
          <ProfileCompletionSection
            onNext={() => {}}
            onBack={() => {}}
            initialData={{
              displayName: formData.displayName || "",
              fullName: formData.fullName || "",
              dateOfBirth: normalizeDateFromStore(formData.birthDate),
              gender: (formData.gender as "Male" | "Female" | "Other") || "Male",
              avatar: null,
            }}
          />
        );
      case "otp":
        return (
          <OTPVerificationSection
            onNext={() => {}}
            onBack={() => {}}
            initialData={{
              otp: formData.otp || "",
            }}
          />
        );
      default:
        return (
          <SignUpLayout>
            <SignUpFormSection
              onNext={() => {}}
              initialData={{
                email: formData.email || "",
              }}
            />
            <SignUpImageSection />
          </SignUpLayout>
        );
    }
  };

  return renderCurrentStep();
};

export default SignUpView;
