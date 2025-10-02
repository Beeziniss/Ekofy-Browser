"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/profile";

interface ProfileInfoSectionProps {
  userProfile: UserProfile;
}

const ProfileInfoSection = ({ userProfile }: ProfileInfoSectionProps) => {
  // Format dates
  const formatDate = (dateString?: string | null) => {
    if (!dateString || dateString === "0001-01-01T00:00:00.000Z") {
      return new Date("1990-01-01").toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format gender
  const formatGender = (gender: string) => {
    switch (gender) {
      case "NOT_SPECIFIED":
        return "Not specified";
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      default:
        return gender;
    }
  };

  // Get display name from email
  const displayName = userProfile.email
    .split("@")[0]
    .replace(".", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">
            Full Name
          </Label>
          <Input
            id="fullName"
            value={displayName}
            readOnly
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-white">
            Gender
          </Label>
          <Input
            id="gender"
            value={formatGender(userProfile.gender)}
            readOnly
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-white">
            Date Of Birth
          </Label>
          <Input
            id="birthDate"
            value={formatDate(userProfile.birthDate)}
            readOnly
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="text-white">
            Role
          </Label>
          <Input
            id="role"
            value={userProfile.role}
            readOnly
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-white">
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            value={userProfile.phoneNumber || "Not specified"}
            readOnly
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-white">
            Status
          </Label>
          <Input
            id="status"
            value={userProfile.status}
            readOnly
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>
        {/* Ngày tạo - Full width */}
        <div className="space-y-2">
          <Label htmlFor="createdAt" className="text-white">
            Created At
          </Label>
          <Input
            id="createdAt"
            value={formatDate(userProfile.createdAt)}
            readOnly
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>
        {/* Ngày cập nhật - Full width */}
        <div className="space-y-2">
          <Label htmlFor="updatedAt" className="text-white">
            Updated At
          </Label>
          <Input
            id="updatedAt"
            value={
              userProfile.updatedAt
                ? formatDate(userProfile.updatedAt)
                : "Not updated yet"
            }
            readOnly
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSection;
