interface ModeratorLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ModeratorLayoutProps) => {
  // Layout gốc chỉ bao providers chung, không có sidebar
  // Sidebar chỉ có trong (main) layout
  return <>{children}</>;
};

export default Layout;
