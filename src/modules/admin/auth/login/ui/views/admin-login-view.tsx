import React from "react";
import AdminLoginLayout  from "../layouts/admin-login-layout";
import { AdminLoginFormSection, ImageSection } from "../sections";
const AdminLoginView = () => {
  return (
    <AdminLoginLayout>
      <ImageSection />
      <AdminLoginFormSection />
    </AdminLoginLayout>
  );
};

export default AdminLoginView;
