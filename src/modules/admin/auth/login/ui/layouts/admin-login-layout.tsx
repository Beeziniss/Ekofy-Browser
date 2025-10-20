import React from "react";

interface AdminLoginLayoutProps {
  children: React.ReactNode;
}

const AdminLoginLayout = ({ children }: AdminLoginLayoutProps) => {
  return (
    <div className="w-full flex min-h-screen">
      {children}
    </div>
  );
};

export default AdminLoginLayout;
