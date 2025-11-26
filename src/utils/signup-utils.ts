// Utility functions for sign up process
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { ArtistSignUpFormData } from "@/store/stores/artist-signup-store";
import { RegisterArtistData } from "@/types/auth";
import { UserRole as GraphQLUserRole } from "@/gql/graphql";
import { UserRole } from "@/types/role";

export const formatDate = (date: Date | undefined | null): string => {
  // Handle null/undefined cases
  if (!date) {
    throw new Error("Date is required");
  }

  // Handle string dates that might be passed accidentally
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date string provided");
    }
    return parsedDate.toISOString().split("T")[0];
  }

  // Handle Date objects
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date object");
  }

  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

export const handleAPIError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    // Just return detail if available, otherwise generic message
    return data?.detail || "An error occurred. Please try again.";
  }

  if (error instanceof Error && error.message) {
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

export const formatSimpleAPIError = (error: unknown): string => {
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
  const finalPhoneNumber = formData.phoneNumber;
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
    birthDate: convertDateToISO(formData.birthDate!), // Convert DD/MM/YYYY to ISO for API
    gender: formData.gender!,
    phoneNumber: finalPhoneNumber || "", // Allow empty for now to see specific API error
    avatarImage: formData.avatarImage, // Optional avatar URL - sử dụng camelCase
    // Artist specific - stageName is required by API
    stageName: finalStageName,
    artistType: formData.artistType!,

    // Members (for groups)
    members: formData.members || [],

    // Identity card information
    identityCard: {
      number: formData.identityCard!.number!,
      fullName: formData.identityCard!.fullName!,
      dateOfBirth: convertDateToISO(formData.identityCard!.dateOfBirth!), // Convert DD/MM/YYYY to ISO
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
      validUntil: convertDateToISO(formData.identityCard!.validUntil!), // Convert DD/MM/YYYY to ISO
    },
  };

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

/**
 * Convert DD/MM/YYYY format to ISO string for API consumption
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns ISO date string
 */
export const convertDateToISO = (dateString: string): string => {
  if (!dateString) return "";

  // If already ISO format, return as is
  if (dateString.includes("T") && dateString.includes("Z")) {
    return dateString;
  }

  // If DD/MM/YYYY format, convert to ISO
  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    return formatDate(date);
  }

  return dateString;
};

/**
 * Convert ISO date string back to DD/MM/YYYY format for display
 * @param isoString - ISO date string
 * @returns DD/MM/YYYY formatted string
 */
export const convertISOToDisplayDate = (isoString: string): string => {
  if (!isoString) return "";

  // If already DD/MM/YYYY format, return as is
  if (isoString.includes("/")) {
    return isoString;
  }

  // If ISO format, convert to DD/MM/YYYY
  if (isoString.includes("T") && isoString.includes("Z")) {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return isoString;
};
