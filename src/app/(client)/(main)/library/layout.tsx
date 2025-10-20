import LibraryLayout from "@/modules/client/library/ui/layouts/library-layout";

interface PageLayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: PageLayoutProps) => {
  return <LibraryLayout>{children}</LibraryLayout>;
};

export default Layout;
