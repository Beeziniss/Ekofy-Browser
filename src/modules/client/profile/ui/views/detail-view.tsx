import PersonalDetailSection from "../sections/personal-detail-section";
import AccountDetailSection from "../sections/account-detail-section";
import SettingsSection from "../sections/settings-section";
import ActivitySection from "../sections/activity-section";
import type { UserGender } from "@/gql/graphql";
import SubscriptionSection from "../sections/subscription-section";

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

const DetailView = ({ personal, account, userId }: DetailViewProps) => {
  return (
    <div className="w-full space-y-6 pb-10">
      <PersonalDetailSection personal={personal} userId={userId} />
      <AccountDetailSection account={account} />
      <SubscriptionSection />
      <SettingsSection />
      <ActivitySection />
    </div>
  );
};

export default DetailView;
