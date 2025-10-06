"use client";

import ProfileHeader from '@/modules/client/profile/ui/components/profile-header';
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileTab from '../sections/profile-tab'
import TeamTab from '../sections/team-tab'
import AccountTab from '../sections/account-tab'
import Tab from '../components/tabs/tabs';

const ArtistProfileView = () => {
    const mockName = "Nguyen Van A";
  const mockAvatar = ""; 
  const mockBackground = "/image-login.png";

  const handleAvatar = (file: File) => {
    
    console.log("Avatar chọn:", file.name);
  };

  const handleBackground = (file: File) => {
    console.log("Background chọn:", file.name);
  };
  return (
     <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <ProfileHeader
            name={mockName}
            avatarUrl={mockAvatar}
            backgroundUrl={mockBackground}
            onChangeAvatar={handleAvatar}
            onChangeBackground={handleBackground}
          />
          <Tab />
          
          {/* <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:pt-4">
              <div className="md:col-span-9">
                <DetailView />
              </div>
              <div className="md:col-span-3">
                <HelpCard className="md:sticky md:top-10 " />
              </div>
            </div>
          </div> */}
        </div>
  )
}

export default ArtistProfileView