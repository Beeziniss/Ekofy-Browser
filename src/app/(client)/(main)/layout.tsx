import ClientLayout from "@/modules/client/common/ui/layouts/client-layout";

interface PageLayoutProps {
  children: React.ReactNode;
}
const PageLayout = ({ children }: PageLayoutProps) => {
  return <ClientLayout>{children}</ClientLayout>;
};

export default PageLayout;
