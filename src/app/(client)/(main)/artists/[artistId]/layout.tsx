import ArtistDetailLayout from "@/modules/client/artist/ui/layouts/artist-detail-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <ArtistDetailLayout>{children}</ArtistDetailLayout>;
};

export default Layout;
