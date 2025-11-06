import React from "react";

interface ApprovalServicePackageLayoutProps {
  children: React.ReactNode;
}

const ApprovalServicePackageLayout: React.FC<ApprovalServicePackageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto">{children}</div>
    </div>
  );
};

export default ApprovalServicePackageLayout;
