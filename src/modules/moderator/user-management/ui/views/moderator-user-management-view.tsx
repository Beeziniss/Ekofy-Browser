import { ModeratorUserManagementLayout } from "../layout";
import { ModeratorUserManagementSection } from "../section";

export function UserManagementModerator() {
  return (
    <ModeratorUserManagementLayout title="User Management" description="Stats updated daily">
      <ModeratorUserManagementSection />
    </ModeratorUserManagementLayout>
  );
}
