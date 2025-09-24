import TrackUploadFooter from "../components/track-upload-footer";
import TrackUploadHeader from "../components/track-upload-header";

interface TrackUploadLayoutProps {
  children: React.ReactNode;
}

const TrackUploadLayout = ({ children }: TrackUploadLayoutProps) => {
  return (
    <div className="bg-main-dark-bg relative w-full">
      <TrackUploadHeader />
      <main className="mx-auto w-full max-w-[1240px] py-16">{children}</main>
      <TrackUploadFooter />
    </div>
  );
};

export default TrackUploadLayout;
