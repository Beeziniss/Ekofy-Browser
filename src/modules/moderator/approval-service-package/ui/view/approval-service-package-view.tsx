import React from "react";
import ApprovalServicePackageLayout from "../layout/approval-service-package-layout";
import ApprovalServicePackageSection from "../section/approval-service-package-section";

const ApprovalServicePackageView: React.FC = () => {
  return (
    <ApprovalServicePackageLayout>
      <ApprovalServicePackageSection />
    </ApprovalServicePackageLayout>
  );
};

export default ApprovalServicePackageView;
