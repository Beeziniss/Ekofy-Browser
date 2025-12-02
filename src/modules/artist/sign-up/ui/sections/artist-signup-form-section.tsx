"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CircleHelp } from "lucide-react";
import Link from "next/link";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import { UserGender } from "@/gql/graphql";
import { toast } from "sonner";
import { ArtistSignUpFormData, ArtistSignUpSectionProps } from "@/types/artist_type";
import { EkofyLogo } from "@/assets/icons";

type ArtistSignUpFormSectionProps = ArtistSignUpSectionProps<ArtistSignUpFormData>;

const ArtistSignUpFormSection = ({ onNext, initialData }: ArtistSignUpFormSectionProps) => {
  const { formData, updateFormData, updateSessionData, goToNextStep } = useArtistSignUpStore();

  // Initialize state from global store or initial data
  const [email, setEmail] = useState(initialData?.email || formData.email || "");
  // Always reset password fields when component mounts for security
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(initialData?.agreeTerms || false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Password validation state
  const [passwordFocus, setPasswordFocus] = useState(false);

  // Load data from global state when component mounts or store updates
  useEffect(() => {
    if (formData.email && !initialData?.email) setEmail(formData.email);
    // Do not restore password fields for security reasons - they reset on back navigation
    // Always ensure password fields start empty for security
    setPassword("");
    setConfirmPassword("");
  }, [formData.email, initialData?.email]);

  // Save form data to global state on input change (debounced)
  // Note: Only save email to persistent data, password is only saved in session for current flow
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFormData({ email });
      // Save password to session data only for current navigation (not restored on back)
      updateSessionData({ password, confirmPassword });
    }, 300); // Debounce to avoid too many updates

    return () => clearTimeout(timeoutId);
  }, [email, password, confirmPassword, updateFormData, updateSessionData]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasLetters: /[a-zA-Z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommonWords: !/(password|123456|qwerty|abc123)/i.test(password),
    };
  };

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Comprehensive form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (email.length > 50) {
      newErrors.email = "Email must be less than 50 characters";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length > 50) {
      newErrors.password = "Password must be less than 50 characters";
    } else if (!isPasswordValid) {
      newErrors.password = "Password does not meet security requirements";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation
  const validateField = (field: string, value: string | boolean) => {
    const newErrors = { ...errors };

    if (field === "email") {
      const emailValue = value as string;
      if (!emailValue) {
        newErrors.email = "Email is required";
      } else if (emailValue.length > 50) {
        newErrors.email = "Email must be less than 50 characters";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      const passwordValue = value as string;
      if (!passwordValue) {
        newErrors.password = "Password is required";
      } else if (passwordValue.length > 50) {
        newErrors.password = "Password must be less than 50 characters";
      } else {
        const validation = validatePassword(passwordValue);
        const isValid = Object.values(validation).every(Boolean);
        if (!isValid) {
          newErrors.password = "Password does not meet security requirements";
        } else {
          delete newErrors.password;
        }
      }

      // Re-validate confirm password if password changes
      if (confirmPassword && passwordValue !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else if (confirmPassword && passwordValue === confirmPassword) {
        delete newErrors.confirmPassword;
      }
    }

    if (field === "confirmPassword") {
      const confirmValue = value as string;
      if (!confirmValue) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmValue) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (field === "agreeTerms") {
      const agreeValue = value as boolean;
      if (!agreeValue) {
        newErrors.agreeTerms = "You must agree to the terms and conditions";
      } else {
        delete newErrors.agreeTerms;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    // Update store with form data (preserve existing data)
    // Note: Include password only for the current submission, not for persistence
    const formDataToStore = {
      email,
      password, // Only included for immediate API call
      confirmPassword, // Only included for immediate API call
      // Preserve existing values if they exist
      fullName: formData.fullName || "",
      birthDate: formData.birthDate || "",
      gender: formData.gender || ("Male" as UserGender),
      phoneNumber: formData.phoneNumber || "",
    };

    // Update store without persisting password fields
    updateFormData({
      email,
      // Do not include password in persistent store data
      fullName: formData.fullName || "",
      birthDate: formData.birthDate || "",
      gender: formData.gender || ("Male" as UserGender),
      phoneNumber: formData.phoneNumber || "",
    });

    // Navigate to next step with complete data (including password for API)
    goToNextStep(formDataToStore);

    // Also call the original onNext for backward compatibility
    onNext({
      email,
      password,
      confirmPassword,
      agreeTerms,
    });
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#121212] px-6 py-12 lg:px-8">
      <div className="w-full max-w-md space-x-6">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">Let’s get started</h2>
          <p className="text-sm text-gray-300">
            Enter your email and password to create a new account. We will send you a verification code through the
            registered email.
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Email<span className="text-red-500">*</span></label>
            <Input
              type="email"
              value={email}
              maxLength={50}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 50) {
                  setEmail(value);
                  validateField("email", value);
                } else {
                  // Show notification that limit is reached
                  const newErrors = { ...errors };
                  newErrors.email = "Email must be less than 50 characters";
                  setErrors(newErrors);
                }
              }}
              placeholder="Enter your email"
              className={`border-gradient-input h-12 w-full text-white placeholder-gray-400 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="relative">
            <label className="mb-2 flex items-center gap-1 text-sm font-medium text-white">
              Password<span className="text-red-500">*</span>
              <Link href="#" className="ml-2">
                <CircleHelp className="h-4 w-4 text-white" />
              </Link>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                maxLength={50}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 50) {
                    setPassword(value);
                    validateField("password", value);
                  } else {
                    // Show notification that limit is reached
                    const newErrors = { ...errors };
                    newErrors.password = "Password must be less than 50 characters";
                    setErrors(newErrors);
                  }
                }}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                placeholder="Create password"
                className={`border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}

            {/* Password validation tooltip */}
            {(passwordFocus || (password && !isPasswordValid)) && (
              <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-lg">
                <div className="space-y-1 text-xs">
                  <div
                    className={`flex items-center ${passwordValidation.minLength ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.minLength ? "✓" : "○"}</span>
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasLetters ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasLetters ? "✓" : "○"}</span>
                    Contains letters
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasNumbers ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasNumbers ? "✓" : "○"}</span>
                    Contains numbers
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasSpecialChars ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.hasSpecialChars ? "✓" : "○"}</span>
                    Contains special characters
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.noCommonWords ? "text-green-400" : "text-gray-400"}`}
                  >
                    <span className="mr-2">{passwordValidation.noCommonWords ? "✓" : "○"}</span>
                    Avoid common passwords
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Confirm Password<span className="text-red-500">*</span></label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                maxLength={50}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 50) {
                    setConfirmPassword(value);
                    validateField("confirmPassword", value);
                  } else {
                    // Show notification that limit is reached
                    const newErrors = { ...errors };
                    newErrors.confirmPassword = "Password must be less than 50 characters";
                    setErrors(newErrors);
                  }
                }}
                placeholder="Confirm password"
                className={`border-gradient-input h-12 w-full pr-10 text-white placeholder-gray-400 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className={`mt-1 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 ${
                errors.agreeTerms ? "border-red-500" : ""
              }`}
              required
            />
            <div>
              <label className="text-sm text-gray-300">
                I agree to the{" "}
                <Link href="#" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </label>
              {errors.agreeTerms && <p className="mt-1 text-xs text-red-400">{errors.agreeTerms}</p>}
            </div>
          </div>

          <Button
            type="submit"
            className="primary_gradient w-full rounded-md px-4 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-60"
            size="lg"
          >
            Continue
          </Button>
          {/* Login Link */}
          <div className="mt-2 text-center">
            <span className="text-sm text-white">Already have an account? </span>
            <Link
              href="/artist/login"
              className="font-medium text-white underline transition-colors hover:text-blue-400"
            >
              Log in to Ekofy.
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#121212] px-2 text-gray-400">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          className="mb-6 w-full border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700/50"
          size="lg"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default ArtistSignUpFormSection;
