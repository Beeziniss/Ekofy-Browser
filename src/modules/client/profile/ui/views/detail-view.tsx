import PersonalDetailSection from "../sections/personal-detail-section";
import AccountDetailSection from "../sections/account-detail-section";
import SettingsSection from "../sections/settings-section";
import ActivitySection from "../sections/activity-section";
import type { UserGender } from "@/gql/graphql";

interface DetailViewProps {
  personal: {
    readonly displayName: string;
    readonly email: string;
    readonly birthDate: string | undefined;
    readonly gender: UserGender | undefined;
  };
  account: {
    createdAt: string;
    membershipStatus: string;
  };
  userId?: string;
}

export default function DetailView({ personal, account, userId }: DetailViewProps) {
  return (
    <div className="w-full p-4 pt-6">
      <PersonalDetailSection personal={personal} userId={userId} />
      <AccountDetailSection account={account} />
      <SettingsSection />
      <ActivitySection />
    </div>
  );
}
