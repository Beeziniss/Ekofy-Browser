interface AuthLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: AuthLayoutProps) => {
  return <div className="bg-background w-full">{children}</div>;
};

export default Layout;
