import ProfileView from "../../../../modules/client/profile/ui/views/profile-view";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading profile…</div>}>
      <ProfileView />
    </Suspense>
  );
}
