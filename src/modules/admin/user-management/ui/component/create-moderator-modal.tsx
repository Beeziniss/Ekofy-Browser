"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { UserGender } from "@/gql/graphql";
import { Eye, EyeOff } from 'lucide-react';

interface CreateModeratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateModeratorData) => void;
}

export interface CreateModeratorData {
  email: string;
  // fullName: string;
  password: string;
  confirmPassword: string;
  // gender: UserGender;
  // phoneNumber: string;
}

export function CreateModeratorModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateModeratorModalProps) {
  const [formData, setFormData] = useState<CreateModeratorData>({
    email: "",
    // fullName: "",
    password: "",
    confirmPassword: "",
    // gender: UserGender.Male,
    // phoneNumber: "",
  });
  const [errors, setErrors] = useState<Partial<CreateModeratorData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<CreateModeratorData> = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    // if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    // if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        email: "",
        // fullName: "",
        password: "",
        confirmPassword: "",
        // gender: UserGender.Male,
        // phoneNumber: "",
      });
    }
  };

  const handleChange = (field: keyof CreateModeratorData, value: string | UserGender) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Form create moderator
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Full Name */}
            {/* <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm">{errors.fullName}</p>
              )}
            </div> */}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Gender */}
            {/* <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-300">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value as UserGender)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value={UserGender.Male} className="text-white hover:bg-gray-600">
                    Male
                  </SelectItem>
                  <SelectItem value={UserGender.Female} className="text-white hover:bg-gray-600">
                    Female
                  </SelectItem>
                  <SelectItem value={UserGender.Other} className="text-white hover:bg-gray-600">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Phone Number */}
            {/* <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.phoneNumber && (
                <p className="text-red-400 text-sm">{errors.phoneNumber}</p>
              )}
            </div> */}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}