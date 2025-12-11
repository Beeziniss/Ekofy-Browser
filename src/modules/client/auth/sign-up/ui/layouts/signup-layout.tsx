import React from "react";

interface SignUpLayoutProps {
  children: React.ReactNode;
}

const SignUpLayout = ({ children }: SignUpLayoutProps) => {
  return <div className="flex h-screen w-full overflow-hidden">{children}</div>;
};

export default SignUpLayout;
