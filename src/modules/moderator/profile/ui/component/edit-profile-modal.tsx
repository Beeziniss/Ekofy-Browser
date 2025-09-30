"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Camera, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  email: string;
  gender: string;
  birthDate: string;
  role: string;
  phoneNumber?: string | null;
  status: string;
  createdAt: string;
  updatedAt?: string | null;
}

interface EditProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onSave: (data: any) => void;
}

const EditProfileModal = ({ isOpen, userProfile, onClose, onSave }: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "NOT_SPECIFIED",
    birthDate: new Date(),
    phoneNumber: "",
  });

  // Update form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      const displayName = userProfile.email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());
      const birthDate = userProfile.birthDate && userProfile.birthDate !== "0001-01-01T00:00:00.000Z" 
        ? new Date(userProfile.birthDate) 
        : new Date("1990-01-01");
      
      setFormData({
        fullName: displayName,
        gender: userProfile.gender || "NOT_SPECIFIED",
        birthDate: birthDate,
        phoneNumber: userProfile.phoneNumber || "",
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      birthDate: format(formData.birthDate, "yyyy-MM-dd"),
    };
    onSave(submitData);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original user data
    if (userProfile) {
      const displayName = userProfile.email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());
      const birthDate = userProfile.birthDate && userProfile.birthDate !== "0001-01-01T00:00:00.000Z" 
        ? new Date(userProfile.birthDate) 
        : new Date("1990-01-01");
      
      setFormData({
        fullName: displayName,
        gender: userProfile.gender || "NOT_SPECIFIED",
        birthDate: birthDate,
        phoneNumber: userProfile.phoneNumber || "",
      });
    }
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Custom backdrop overlay with blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Dialog without default overlay */}
      <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
        <DialogContent 
          className="sm:max-w-[600px] bg-[#121212] border-gradient-input z-50 fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] duration-200"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-white text-xl">Update Profile</DialogTitle>
          </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-avatar.png" alt={formData.fullName} />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-purple-400 to-blue-600 text-white">
                  {getInitials(formData.fullName)}
                </AvatarFallback>
              </Avatar>
              {/* <Button
                variant="secondary"
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button> */}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="NOT_SPECIFIED">Not Specified</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-white">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white",
                      !formData.birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birthDate ? format(formData.birthDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={formData.birthDate}
                    onSelect={(date) => date && handleInputChange("birthDate", date)}
                    initialFocus
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">Phone number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="primary_gradient hover:opacity-60 text-white"
            >
              Save change
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default EditProfileModal;