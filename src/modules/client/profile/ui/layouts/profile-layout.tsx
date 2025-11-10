// import PersonalDetailSection from "../sections/personal-detail-section";
// import AccountDetailSection from "../sections/account-detail-section";
import SettingsSection from "../sections/settings-section";
import ActivitySection from "../sections/activity-section";

export default function ProfileLayout() {
  return (
    <div className="w-full p-4 pt-8">
      {/* <PersonalDetailSection /> */}
      {/* <AccountDetailSection /> */}
      <SettingsSection />
      <ActivitySection />
    </div>
  );
}
