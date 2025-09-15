"use client";

import React from "react";

interface ManagerAuthorizationProps {
  isManager: boolean;
  authorizationLetter: File | null;
  errors: Record<string, string>;
  onManagerChange: (value: boolean) => void;
  onFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "authorization"
  ) => void;
}

const ManagerAuthorizationComponent: React.FC<ManagerAuthorizationProps> = ({
  isManager,
  authorizationLetter,
  errors,
  onManagerChange,
  onFileUpload,
}) => {
  return (
    <div className="space-y-6">
      {/* Manager Question */}
      <div className="flex items-center space-x-4 py-4">
        <span className="text-sm text-white">
          Are you the manager acting on behalf of this artist/band?
        </span>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="manager"
              checked={isManager === true}
              onChange={() => onManagerChange(true)}
              className="mr-2"
            />
            <span className="text-sm text-white">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="manager"
              checked={isManager === false}
              onChange={() => onManagerChange(false)}
              className="mr-2"
            />
            <span className="text-sm text-white">No</span>
          </label>
        </div>
      </div>

      {/* Upload Authorization Letter */}
      <div className="relative">
        <div className={`cursor-pointer rounded-lg border-2 border-dashed ${errors.authorizationLetter ? 'border-red-500' : 'border-gray-600'} p-4 text-center transition-colors hover:border-gray-500`}>
          {authorizationLetter ? (
            <p className="text-sm text-white">{authorizationLetter.name}</p>
          ) : (
            <p className="text-sm text-white">
              + Upload authorization letter to prove you have the rights.
            </p>
          )}
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,image/*"
          onChange={(e) => onFileUpload(e, "authorization")}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        {errors.authorizationLetter && (
          <p className="mt-2 text-sm text-red-400">{errors.authorizationLetter}</p>
        )}
      </div>
    </div>
  );
};

export default ManagerAuthorizationComponent;