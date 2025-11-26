"use client";

import React from "react";
import { ForgotPasswordLayout } from "../layout";
import { ForgotPasswordSection } from "../section";

const ForgotPasswordView: React.FC = () => {
  return (
    <ForgotPasswordLayout>
      <ForgotPasswordSection />
    </ForgotPasswordLayout>
  );
};

export default ForgotPasswordView;