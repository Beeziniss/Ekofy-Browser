import ArtistsPick from "../components/pick/artists-pick";
import BiographySection from "../components/biography";
import MoreInfoCard from "../components/info";

export default function ProfileTab() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="space-y-8 md:col-span-9">
          <ArtistsPick onAdd={() => console.log("Add artist pick clicked")} />
          <BiographySection />
        </div>
        <div className="md:col-span-3">
          <MoreInfoCard />
        </div>
      </div>
    </div>
  );
}
