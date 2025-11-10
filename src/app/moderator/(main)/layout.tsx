import ModeratorLayout from "@/modules/moderator/main-layout/ui/layouts/moderator-layout";

interface ModeratorMainLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ModeratorMainLayoutProps) => {
  return <ModeratorLayout>{children}</ModeratorLayout>;
};

export default Layout;
