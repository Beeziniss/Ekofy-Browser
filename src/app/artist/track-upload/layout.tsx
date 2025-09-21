import TrackUploadLayout from "@/modules/artist/track-upload/ui/layouts/track-upload-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <TrackUploadLayout>{children}</TrackUploadLayout>;
};

export default Layout;
