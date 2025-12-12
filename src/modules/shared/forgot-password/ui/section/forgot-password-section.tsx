"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ForgotPasswordForm, ResetPasswordForm, SuccessMessage } from "../component";

type ForgotPasswordStep = "email" | "reset" | "success";

const ForgotPasswordSection: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "listener"; // Default to listener if not specified
  
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState<string>("");

  const handleEmailSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep("reset");
  };

  const handleResetSuccess = () => {
    setCurrentStep("success");
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
  };

  const handleBackToLogin = () => {
    // Redirect based on user type
    const loginPath = userType === "artist" ? "/artist/login" : "/login";
    router.push(loginPath);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "email":
        return <ForgotPasswordForm onSuccess={handleEmailSuccess} />;
      case "reset":
        return (
          <ResetPasswordForm
            email={email}
            userType={userType}
            onSuccess={handleResetSuccess}
            onBackToForgotPassword={handleBackToEmail}
          />
        );
      case "success":
        return <SuccessMessage onBackToLogin={handleBackToLogin} />;
      default:
        return <ForgotPasswordForm onSuccess={handleEmailSuccess} />;
    }
  };

  return (
    <div className="w-full">
      {renderCurrentStep()}
    </div>
  );
};

export default ForgotPasswordSection;