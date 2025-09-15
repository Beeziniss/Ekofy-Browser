"use client";

import React, { useState } from "react";
import Image from "next/image";
import EkofyLogo from "../../../../../../public/ekofy-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, X, Plus } from "lucide-react";
import { useRouter } from 'next/navigation';

interface Member {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
}

interface ArtistMembersSectionProps {
  onNext: () => void;
  onBack: () => void;
}

const ArtistMembersSection = ({
  onNext,
  onBack,
}: ArtistMembersSectionProps) => {
  const [members, setMembers] = useState<Member[]>([
    // { fullName: '', email: '', phoneNumber: '', gender: '' },
    // { fullName: '', email: '', phoneNumber: '', gender: '' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const addMember = () => {
    setMembers([
      ...members,
      { fullName: "", email: "", phoneNumber: "", gender: "" },
    ]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const updatedMembers = members.map((member, i) =>
      i === index ? { ...member, [field]: value } : member,
    );
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
      }
      if (!member.gender) {
        newErrors[`member-${index}-gender`] = "Gender is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Band members:", members);
      setErrors({ artistType: "Registration successful! Redirecting to login page..." });
      setTimeout(() => {
      router.push('/artist/login');
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-white transition-colors hover:text-blue-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 flex items-center justify-center rounded-full">
              <Image src={EkofyLogo} alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            Add Band / Group Member
          </h2>
          <p className="mb-8 text-sm text-gray-300">
            Invite your fellow artists to join your band and collaborate under
            one profile.
          </p>
        </div>

        <div className="space-y-8">
          {members.map((member, index) => (
            <div key={index} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Member {index + 1}
                </h3>
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Full name*
                  </label>
                  <Input
                    value={member.fullName}
                    onChange={(e) =>
                      updateMember(index, "fullName", e.target.value)
                    }
                    placeholder="Enter full name"
                    className={`w-full ${errors[`member-${index}-fullName`] ? "border-gradient-input-error" : "border-gradient-input"} h-12 text-white placeholder-gray-400`}
                  />
                  {errors[`member-${index}-fullName`] && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors[`member-${index}-fullName`]}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Email*
                  </label>
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      updateMember(index, "email", e.target.value)
                    }
                    placeholder="Enter email"
                    className={`w-full ${errors[`member-${index}-email`] ? "border-gradient-input-error" : "border-gradient-input"} h-12 text-white placeholder-gray-400`}
                  />
                  {errors[`member-${index}-email`] && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors[`member-${index}-email`]}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Phone number*
                  </label>
                  <Input
                    value={member.phoneNumber}
                    onChange={(e) =>
                      updateMember(index, "phoneNumber", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className={`w-full ${errors[`member-${index}-phoneNumber`] ? "border-gradient-input-error" : "border-gradient-input"} h-12 rounded-lg text-white placeholder-gray-400`}
                  />
                  {errors[`member-${index}-phoneNumber`] && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors[`member-${index}-phoneNumber`]}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Gender*
                  </label>
                  <Select
                    value={member.gender}
                    onValueChange={(value) =>
                      updateMember(index, "gender", value)
                    }
                  >
                    <SelectTrigger
                      className={`h-12 w-full rounded-md border ${errors[`member-${index}-gender`] ? "border-gradient-input-error" : "border-gradient-input"} px-3 py-2 text-white`}
                    >
                      <SelectValue
                        placeholder="Gender"
                        className="text-gray-400"
                      />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem
                        value="male"
                        className="text-white hover:bg-gray-700"
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value="female"
                        className="text-white hover:bg-gray-700"
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value="other"
                        className="text-white hover:bg-gray-700"
                      >
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors[`member-${index}-gender`] && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors[`member-${index}-gender`]}
                    </p>
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
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistMembersSection;
