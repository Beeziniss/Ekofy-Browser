"use client";

import { useState } from "react";
import ProfileHeader from "../components/profile-header";
import ProfileInfoSection from "../components/profile-info-section";
import ChangePasswordSection from "../components/change-password-section";
import EditProfileModal from "../components/edit-profile-modal";
import { UserProfile } from "@/types/profile";

interface ProfileSectionProps {
  userProfile: UserProfile | null | undefined;
}

const ProfileSection = ({ userProfile }: ProfileSectionProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  // const handleSaveProfile = (data: any) => {
  //   console.log("Saving profile:", data);
  //   // TODO: Implement profile save logic
  // };

  // const handleSavePassword = (data: any) => {
  //   console.log("Saving password:", data);
  //   // TODO: Implement password change logic
  // };

  if (!userProfile) {
    return <div className="text-white">No user data found</div>;
  }

  return (
    <div className="max-w-8xl mx-auto px-4">
      <div className="border-gradient-input space-y-8 rounded-xl border bg-[#121212] p-8">
        <ProfileHeader userProfile={userProfile} onEditClick={handleEditClick} />

        <div className="border-t border-gray-700 pt-6">
          <ProfileInfoSection userProfile={userProfile} />
        </div>

        <div className="border-t border-gray-700 pt-6">
          <ChangePasswordSection />
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        userProfile={userProfile}
        onClose={handleCloseModal}
        // onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfileSection;
