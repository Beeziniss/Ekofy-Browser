import TrackUploadFooter from "../components/track-upload-footer";
import TrackUploadHeader from "../components/track-upload-header";

interface TrackUploadLayoutProps {
  children: React.ReactNode;
}

const TrackUploadLayout = ({ children }: TrackUploadLayoutProps) => {
  return (
    <div className="bg-main-dark-bg relative w-full">
      <TrackUploadHeader />
      <main className="pt-16 pb-[58px]">{children}</main>
      <TrackUploadFooter />
    </div>
  );
};

export default TrackUploadLayout;
