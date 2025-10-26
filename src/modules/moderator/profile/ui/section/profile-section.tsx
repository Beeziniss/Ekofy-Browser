"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { moderatorProfileOptions } from "@/gql/options/moderator-options";
import ProfileHeader from "../component/profile-header";
import ProfileInfoSection from "../component/profile-info-section";
import ChangePasswordSection from "../component/change-password-section";
import EditProfileModal from "../component/edit-profile-modal";

const ProfileSection = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  
  // Fetch user profile data
  const { data: userProfile } = useQuery({
    ...moderatorProfileOptions(user?.userId || ""),
    enabled: isAuthenticated && !!user?.userId
  });

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
      <div className="bg-[#121212] rounded-xl border border-gradient-input p-8 space-y-8">
        <ProfileHeader 
          userProfile={userProfile}
          onEditClick={handleEditClick} 
        />
        
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