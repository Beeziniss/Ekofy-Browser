"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EkofyLogo from '../../../../../../public/ekofy-logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Upload, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileCompletionSectionProps {
  onBack: () => void;
}

const ProfileCompletionSection: React.FC<ProfileCompletionSectionProps> = ({ onBack }) => {
  const [displayName, setDisplayName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [dateError, setDateError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date of birth
    if (!dateOfBirth) {
      setDateError('Date of birth is required');
      return;
    }
    
    if (dateOfBirth > new Date()) {
      setDateError('Date of birth cannot be in the future');
      return;
    }
    
    // Clear any previous errors
    setDateError('');
    
    // Handle profile completion logic here
    console.log('Profile completed:', { displayName, dateOfBirth, gender, avatar });
    
    // Here you would typically redirect to dashboard or welcome page
    alert('Registration completed successfully!');
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && date > new Date()) {
      setDateError('Date of birth cannot be in the future');
      return;
    }
    setDateError('');
    setDateOfBirth(date);
  };

  const handleBack = () => {
    // Handle back navigation
    onBack();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center text-white hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Logo and Title - Centered */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-full flex items-center justify-center mr-3">
              <Image src={EkofyLogo} alt="Logo" width={32} height={32} />
            </div>
            <h1 className="text-2xl font-bold text-primary-gradient">Ekofy</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome</h2>
          <p className="text-gray-300 text-sm">
            We need further information to complete the registration process.
          </p>
        </div>

        <div className="flex gap-16 items-start justify-center">
          {/* Avatar Upload Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-64 h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-800/30">
                {avatar ? (
                  <div className="w-full h-full relative">
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Avatar preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-white text-sm font-medium">Add avatar image</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-gray-400 text-xs mt-3 max-w-64 text-center">
              Upload a high-quality image that represents you.<br />
              Recommended size 1500x1500px, JPG or PNG, under 5MB
            </p>
          </div>

          {/* Form Section */}
          <div className="flex-1 max-w-sm">
            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Display Name Field */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-white mb-2">
                  Display name*
                </label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  required
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50 h-12"
                />
              </div>

              {/* Date of Birth Field */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white mb-2">
                  Date of Birth*
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800 justify-start text-left font-normal h-12 ${
                        !dateOfBirth && "text-gray-400"
                      } ${dateError && "border-red-500"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : "DD/MM/YYYY"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date()}
                      captionLayout="dropdown"
                      fromYear={1700}
                      toYear={new Date().getFullYear()}
                      className="rounded-md"
                      classNames={{
                        months: "text-white",
                        month: "space-y-4",
                        caption: "text-white flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium text-white hidden",
                        caption_dropdowns: "flex justify-center gap-2",
                        vhidden: "hidden",
                        dropdown: "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                        dropdown_month: "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                        dropdown_year: "bg-gray-700 border border-gray-600 text-white rounded px-3 py-1 text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-600",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white hover:bg-gray-700 rounded",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1 mt-4",
                        head_row: "flex",
                        head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-1",
                        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal text-white hover:bg-gray-700 rounded-md transition-colors cursor-pointer flex items-center justify-center",
                        day_range_end: "day-range-end",
                        day_selected: "bg-blue-600 text-white hover:bg-blue-500",
                        day_today: "bg-gray-700 text-white font-semibold",
                        day_outside: "text-gray-500 opacity-50",
                        day_disabled: "text-gray-500 opacity-30 cursor-not-allowed hover:bg-transparent",
                        day_range_middle: "aria-selected:bg-gray-700 aria-selected:text-white",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {dateError && (
                  <p className="text-red-400 text-xs mt-1">{dateError}</p>
                )}
              </div>

              {/* Gender Field */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-white mb-2">
                  Gender*
                </label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 text-white h-12">
                    <SelectValue placeholder="Gender" className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="male" className="text-white hover:bg-gray-700">Male</SelectItem>
                    <SelectItem value="female" className="text-white hover:bg-gray-700">Female</SelectItem>
                    <SelectItem value="other" className="text-white hover:bg-gray-700">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say" className="text-white hover:bg-gray-700">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Continue Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full primary_gradient hover:opacity-90 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionSection;