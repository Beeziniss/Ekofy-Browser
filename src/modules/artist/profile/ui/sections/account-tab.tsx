import ArtistPersonalDetailSection from "./artist-personal-detail-section";
import ArtistAccountDetailSection from "./artist-account-detail-section";
import SettingsSection from "@/modules/client/profile/ui/sections/settings-section";
import ActivitySection from "./activity-section";
import HelpCard from "@/modules/client/profile/ui/components/help-item";

export default function AccountTab() {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="space-y-8 md:col-span-9">
          <ArtistPersonalDetailSection />
          <ArtistAccountDetailSection />
          <SettingsSection />
          <ActivitySection />
        </div>
        <div className="md:col-span-3">
          <HelpCard className="md:sticky md:top-10" />
        </div>
      </div>
    </div>
  );
}
