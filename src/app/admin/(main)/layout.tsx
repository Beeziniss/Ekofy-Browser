import AdminLayout from "@/modules/admin/main-layout/ui/layouts/admin-layout";

interface AdminMainLayoutProps {
  children: React.ReactNode;
}

const AdminMainLayout = ({ children }: AdminMainLayoutProps) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminMainLayout;
