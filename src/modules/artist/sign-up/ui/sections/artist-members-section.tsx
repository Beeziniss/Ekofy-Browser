"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, X, Plus } from "lucide-react";
import { useArtistSignUpStore } from "@/store/stores/artist-signup-store";
import useArtistSignUp from "../../hooks/use-artist-sign-up";
import { convertArtistStoreDataToAPIFormat } from "@/utils/signup-utils";
// import { isValidPhoneNumber } from '@/utils/signup-utils';
import { toast } from "sonner";
import { UserGender } from "@/gql/graphql";
import { useRouter } from "next/navigation";
import { ArtistMembersData, ArtistSignUpSectionProps, ArtistMemberData } from "@/types/artist_type";
import { EkofyLogo } from "@/assets/icons";

type ArtistMembersSectionProps = ArtistSignUpSectionProps<ArtistMembersData> & {
  onBack: () => void;
};

const ArtistMembersSection = ({ onNext, onBack, initialData }: ArtistMembersSectionProps) => {
  const router = useRouter();
  const { formData, sessionData, updateFormData, resetForm, clearSessionData } = useArtistSignUpStore();

  // Handle navigation to login after successful registration
  const handleNavigateToLogin = () => {
    // Clear all global state data after successful registration
    resetForm();
    clearSessionData();
    router.push("/artist/login");
  };

  const { signUp, isLoading } = useArtistSignUp(handleNavigateToLogin);
  const initialMembers = Array.isArray(initialData) ? initialData : initialData?.members || formData.members || [];
  const [members, setMembers] = useState<ArtistMemberData[]>(
    initialMembers.map((member) => ({
      ...member,
      isLeader: false, // Add default isLeader property
    })),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addMember = () => {
    setMembers([
      ...members,
      {
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "MALE",
        isLeader: false,
      },
    ]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof ArtistMemberData, value: string | boolean) => {
    const updatedMembers = members.map((member, i) => (i === index ? { ...member, [field]: value } : member));
    setMembers(updatedMembers);
    // Clear errors for this field when user starts typing
    const errorKey = `member-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    members.forEach((member, index) => {
      if (!member.fullName.trim()) {
        newErrors[`member-${index}-fullName`] = "Full name is required";
      }
      if (!member.email.trim()) {
        newErrors[`member-${index}-email`] = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(member.email)) {
        newErrors[`member-${index}-email`] = "Invalid email format";
      }
      if (!member.phoneNumber.trim()) {
        newErrors[`member-${index}-phoneNumber`] = "Phone number is required";
      } else if (member.phoneNumber.length !== 10) {
        newErrors[`member-${index}-phoneNumber`] = "Invalid phone number format. It must contain exactly 10 digits.";
      }
      if (!member.gender) {
        newErrors[`member-${index}-gender`] = "Gender is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Convert members to proper format for store
      const membersData = members.map((member) => ({
        fullName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber, // Format phone number
        gender: member.gender as UserGender,
      }));

      // Update store with members data
      updateFormData({ members: membersData });

      // Check if password exists in session data before attempting registration
      if (!sessionData.password || !sessionData.confirmPassword) {
        toast.error("Password information is missing. Please go back to the first step and re-enter your password.");
        // Navigate back to form step to re-enter password
        // router.push('/artist/sign-up');
        return;
      }

      try {
        // Convert store data to API format for registration
        const registrationData = convertArtistStoreDataToAPIFormat({
          ...formData,
          ...sessionData, // Include password from session data
          members: membersData,
        });

        // Call registration API
        signUp(registrationData);
        // Registration will redirect to login on success via hook
      } catch (error) {
        if (error instanceof Error) {
          // Check if error is related to missing password and redirect accordingly
          if (error.message.includes("password")) {
            toast.error(
              "Password information is missing. Please go back to the first step and re-enter your password.",
            );
            router.push("/artist/sign-up");
            return;
          }
          toast.error(error.message);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }

      // Also call the original onNext for backward compatibility
      onNext({ members });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button onClick={onBack} className="mb-8 flex items-center text-white transition-colors hover:text-blue-400">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <EkofyLogo className="size-[60px]" />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">Add Band / Group Member</h2>
          <p className="mb-8 text-sm text-gray-300">
            Invite your fellow artists to join your band and collaborate under one profile.
          </p>
        </div>

        <div className="space-y-8">
          {members.map((member, index) => (
            <div key={index} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Member {index + 1}</h3>
                {members.length > 1 && (
                  <button type="button" onClick={() => removeMember(index)} className="text-red-400 hover:text-red-300">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Full name*</label>
                  <Input
                    value={member.fullName}
                    onChange={(e) => updateMember(index, "fullName", e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full ${errors[`member-${index}-fullName`] ? "border-gradient-input-error" : "border-gradient-input"} h-12 text-white placeholder-gray-400`}
                  />
                  {errors[`member-${index}-fullName`] && (
                    <p className="mt-2 text-sm text-red-400">{errors[`member-${index}-fullName`]}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Email*</label>
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) => updateMember(index, "email", e.target.value)}
                    placeholder="Enter email"
                    className={`w-full ${errors[`member-${index}-email`] ? "border-gradient-input-error" : "border-gradient-input"} h-12 text-white placeholder-gray-400`}
                  />
                  {errors[`member-${index}-email`] && (
                    <p className="mt-2 text-sm text-red-400">{errors[`member-${index}-email`]}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Phone number*</label>
                  <Input
                    value={member.phoneNumber}
                    onChange={(e) => updateMember(index, "phoneNumber", e.target.value)}
                    placeholder="Enter Phone Number (0912345678)"
                    className={`w-full ${errors[`member-${index}-phoneNumber`] ? "border-gradient-input-error" : "border-gradient-input"} h-12 rounded-lg text-white placeholder-gray-400`}
                  />
                  {errors[`member-${index}-phoneNumber`] && (
                    <p className="mt-2 text-sm text-red-400">{errors[`member-${index}-phoneNumber`]}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Gender*</label>
                  <Select value={member.gender} onValueChange={(value) => updateMember(index, "gender", value)}>
                    <SelectTrigger
                      className={`h-12 w-full rounded-md border ${errors[`member-${index}-gender`] ? "border-gradient-input-error" : "border-gradient-input"} px-3 py-2 text-white`}
                    >
                      <SelectValue placeholder="Gender" className="text-gray-400" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="Male" className="text-white hover:bg-gray-700">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" className="text-white hover:bg-gray-700">
                        Female
                      </SelectItem>
                      <SelectItem value="Other" className="text-white hover:bg-gray-700">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[`member-${index}-gender`] && (
                    <p className="mt-2 text-sm text-red-400">{errors[`member-${index}-gender`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Member Button */}
          <div className="rounded-lg border-2 border-dashed border-gray-600 p-6 text-center transition-colors hover:border-gray-500">
            <button
              type="button"
              onClick={addMember}
              className="flex w-full items-center justify-center text-gray-400 transition-colors hover:text-gray-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add a member
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            className="primary_gradient rounded-md px-8 py-3 font-medium text-white transition duration-300 ease-in-out hover:opacity-60"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistMembersSection;
