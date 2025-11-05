"use client";

import React from "react";
import { EkofyLogo } from "@/assets/icons";

const VerificationHeader: React.FC = () => {
  return (
    <div className="mb-8 text-center">
      <div className="mb-6 flex items-center justify-center">
        <div className="mr-3 flex items-center justify-center rounded-full">
          <EkofyLogo className="size-[60px]" />
        </div>
        <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
      </div>
      <h2 className="mb-4 text-3xl font-bold text-white">
        Identity Verification
      </h2>
      <p className="mb-8 text-sm text-gray-300">
        Enter your personal information to complete the registration process.
        <br />
        If you are a member of a band/group, enter the representative
        information.
      </p>
    </div>
  );
};

export default VerificationHeader;
