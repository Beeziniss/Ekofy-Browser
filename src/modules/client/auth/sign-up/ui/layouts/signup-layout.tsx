import React from "react";

interface SignUpLayoutProps {
  children: React.ReactNode;
}

const SignUpLayout = ({ children }: SignUpLayoutProps) => {
  return <div className="flex w-full">{children}</div>;
};

export default SignUpLayout;
