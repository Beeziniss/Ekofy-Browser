// Utility functions for sign up process
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { ArtistSignUpFormData } from "@/store/stores/artist-signup-store";
import { RegisterArtistData, RegisterArtistResponse } from "@/types/auth";
import { User, UserRole as GraphQLUserRole } from "@/gql/graphql";
import { UserRole } from "@/types/role";

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Vietnamese phone number format
 * @param phoneNumber - Phone number string to validate
 * @returns boolean - true if valid format
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Remove all spaces and special characters
  const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^\d+]/g, '');
  
  // Vietnamese phone number patterns:
  // 1. Mobile: 03x, 05x, 07x, 08x, 09x (10 digits total)
  // 2. With country code: +84 followed by 9 digits
  // 3. International format: 84 followed by 9 digits
  
  const patterns = [
    /^0[3-9]\d{8}$/, // 0xxxxxxxxx (10 digits, starts with 03-09)
    /^\+84[3-9]\d{8}$/, // +84xxxxxxxxx 
    /^84[3-9]\d{8}$/, // 84xxxxxxxxx
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
};

/**
 * Format phone number to standard format
 * @param phoneNumber - Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^\d+]/g, '');
  
  // If starts with +84, keep it
  if (cleanPhone.startsWith('+84')) {
    return cleanPhone;
  }
  
  // If starts with 84, add +
  if (cleanPhone.startsWith('84') && cleanPhone.length === 11) {
    return '+' + cleanPhone;
  }
  
  // If starts with 0, convert to +84
  if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
    return '+84' + cleanPhone.substring(1);
  }
  
  return cleanPhone;
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least 1 lowercase letter");
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter");
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least 1 number");
  }
  
  return errors;
};

export const handleAPIError = (error: any): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    // Just return detail if available, otherwise generic message
    return data?.detail || "An error occurred. Please try again.";
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return "An unknown error occurred";
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const formatServiceError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    // Just return detail if available, otherwise generic message
    return data?.detail || "An error occurred. Please try again.";
  }
  return "An error occurred. Please try again.";
};

export const formatSimpleAPIError = (error: any): string => {
  if (isAxiosError(error)) {
    const response = error.response;
    const data = response?.data;
    
    // Use detail if available, otherwise fallback to generic message
    if (data?.detail) {
      return data.detail;
    }
    
    // Fallback based on status
    if (response?.status === 409) {
      return "The data already exists in the system.";
    }
    
    return error.message || "An error occurred. Please try again.";
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An error occurred. Please try again.";
};

// Convert artist signup store data to API format
export const convertArtistStoreDataToAPIFormat = (formData: Partial<ArtistSignUpFormData>): RegisterArtistData => {
  
  // Debug log
  console.log("🔄 Converting store data to API format:", formData);
  
  // Check basic info
  const missingBasicFields = [];
  if (!formData.email) missingBasicFields.push("email");
  if (!formData.password) missingBasicFields.push("password");
  if (!formData.confirmPassword) missingBasicFields.push("confirmPassword");
  if (!formData.fullName) missingBasicFields.push("fullName (should be auto-mapped from ID card)");
  if (!formData.birthDate) missingBasicFields.push("birthDate (should be auto-mapped from ID card dateOfBirth)");
  if (!formData.gender) missingBasicFields.push("gender (should be auto-mapped from ID card)");
  if (!formData.phoneNumber) missingBasicFields.push("phoneNumber (should be from ID card section)");
  if (!formData.artistType) missingBasicFields.push("artistType");
  if (!formData.identityCard) missingBasicFields.push("identityCard");
  
  if (missingBasicFields.length > 0) {
    console.error("❌ Missing required fields:", missingBasicFields);
    throw new Error(`Missing required information: ${missingBasicFields.join(", ")}`);
  }

  // Check identity card info
  const missingIdFields = [];
  if (formData.identityCard) {
    if (!formData.identityCard.number) missingIdFields.push("number");
    if (!formData.identityCard.fullName) missingIdFields.push("fullName");
    if (!formData.identityCard.dateOfBirth) missingIdFields.push("dateOfBirth");
    if (!formData.identityCard.gender) missingIdFields.push("gender");
    if (!formData.identityCard.placeOfOrigin) missingIdFields.push("placeOfOrigin");
    if (!formData.identityCard.nationality) missingIdFields.push("nationality");
    if (!formData.identityCard.placeOfResidence?.addressLine) missingIdFields.push("placeOfResidence.addressLine");
    if (!formData.identityCard.frontImage) missingIdFields.push("frontImage");
    if (!formData.identityCard.backImage) missingIdFields.push("backImage");
    if (!formData.identityCard.validUntil) missingIdFields.push("validUntil");
  }
  
  if (missingIdFields.length > 0) {
    console.error("❌ Missing ID card fields:", missingIdFields);
    throw new Error(`Missing ID card information: ${missingIdFields.join(", ")}`);
  }

  // For Individual artists, use fullName as stageName if not provided
  const finalStageName = formData.stageName || formData.fullName || formData.identityCard!.fullName;
  
  if (!finalStageName) {
    throw new Error("Missing stageName: neither stageName nor fullName is available");
  }

  // Handle phone number - could be from form or a default
  let finalPhoneNumber = formData.phoneNumber;
  if (!finalPhoneNumber) {
    // For now, we'll require phone to be entered separately
    // In future, this could be extracted from CCCD or other sources
    console.warn("⚠️ Phone number not found, this will cause API validation error");
  }

  const result = {
    // Basic info
    email: formData.email!,
    password: formData.password!,
    confirmPassword: formData.confirmPassword!,
    fullName: formData.fullName!,
    birthDate: formData.birthDate!,
    gender: formData.gender!,
    phoneNumber: finalPhoneNumber || "", // Allow empty for now to see specific API error
    
    // Artist specific - stageName is required by API
    stageName: finalStageName,
    artistType: formData.artistType!,
    
    // Members (for groups)
    members: formData.members || [],
    
    // Identity card information
    identityCard: {
      number: formData.identityCard!.number!,
      fullName: formData.identityCard!.fullName!,
      dateOfBirth: formData.identityCard!.dateOfBirth!,
      gender: formData.identityCard!.gender!,
      placeOfOrigin: formData.identityCard!.placeOfOrigin!,
      nationality: formData.identityCard!.nationality!,
      placeOfResidence: {
        street: formData.identityCard!.placeOfResidence!.street,
        ward: formData.identityCard!.placeOfResidence!.ward,
        province: formData.identityCard!.placeOfResidence!.province,
        addressLine: formData.identityCard!.placeOfResidence!.addressLine!,
      },
      frontImage: formData.identityCard!.frontImage!,
      backImage: formData.identityCard!.backImage!,
      validUntil: formData.identityCard!.validUntil!,
    },
  };
  
  console.log("✅ Final result before API call:", {
    hasEmail: !!result.email,
    hasPassword: !!result.password, 
    hasConfirmPassword: !!result.confirmPassword,
    hasFullName: !!result.fullName,
    hasStageName: !!result.stageName,
    hasPhoneNumber: !!result.phoneNumber,
    hasIdentityCard: !!result.identityCard,
    hasIdentityCardFields: {
      number: !!result.identityCard.number,
      frontImage: !!result.identityCard.frontImage,
      backImage: !!result.identityCard.backImage,
    }
  });
  
  return result;
};

// Map GraphQL UserRole to local UserRole
export const mapGraphQLUserRoleToLocal = (graphqlRole: GraphQLUserRole): UserRole => {
  switch (graphqlRole) {
    case GraphQLUserRole.Admin:
      return UserRole.ADMIN;
    case GraphQLUserRole.Artist:
      return UserRole.ARTIST;
    case GraphQLUserRole.Listener:
      return UserRole.LISTENER;
    case GraphQLUserRole.Moderator:
      return UserRole.MODERATOR;
    default:
      return UserRole.LISTENER; // fallback
  }
};