import ArtistHireSection from "../sections/artist-hire-section";
import BannerSection from "../sections/banner-section";

const ArtistHireView = () => {
  return (
    <div className="w-full">
      <BannerSection />

      <ArtistHireSection />
    </div>
  );
};

export default ArtistHireView;
