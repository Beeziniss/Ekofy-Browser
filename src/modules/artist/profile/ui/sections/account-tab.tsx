import ArtistPersonalDetailSection from "./artist-personal-detail-section";
import ArtistAccountDetailSection from "./artist-account-detail-section";
import SettingsSection from "@/modules/client/profile/ui/sections/settings-section";
import ActivitySection from "@/modules/client/profile/ui/sections/activity-section";
import HelpCard from "@/modules/client/profile/ui/components/help-card";
import type { UserGender } from "@/gql/graphql";

interface AccountTabProps {
  artistData: {
    data?: {
      stageName?: string;
    };
    createdAt?: string;
    userStatus?: string;
    artistType?: string;
    membershipStatus?: string;
    identityCard?: {
      number?: string;
      fullName?: string;
      dateOfBirth?: string;
      gender?: UserGender;
      placeOfOrigin?: string;
      placeOfResidence?: {
        addressLine?: string;
      };
      validUntil?: string;
    };
  };
}

export default function AccountTab({ artistData }: AccountTabProps) {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="space-y-8 md:col-span-9">
          <ArtistPersonalDetailSection identityCard={artistData.identityCard} />
          <ArtistAccountDetailSection
            data={artistData.data}
            createdAt={artistData.createdAt}
            userStatus={artistData.userStatus}
            artistType={artistData.artistType}
            membershipStatus={artistData.membershipStatus}
          />
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
