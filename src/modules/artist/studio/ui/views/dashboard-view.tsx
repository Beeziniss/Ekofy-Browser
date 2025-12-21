"use client";

import { Suspense } from "react";
import DashboardSection, {
  DashboardSectionSkeleton,
} from "@/modules/artist/studio/ui/sections/dashboard/dashboard-section";

const DashboardView = () => {
  return (
    <div className={"w-full"}>
      <Suspense fallback={<DashboardSectionSkeleton />}>
        <DashboardSection />
      </Suspense>
    </div>
  );
};
export default DashboardView;
