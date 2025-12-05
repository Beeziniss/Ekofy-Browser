"use client";

import { DashboardLayout } from "../layout/dashboard-layout";
import { DashboardStatsSection } from "../section/dashboard-stats-section";
import { InvoiceDashboardSection } from "../section/invoice-dashboard-section";
import { PlatformRevenueSection } from "../section/platform-revenue-section";

const AdminDashboardView = () => {
  return (
    <DashboardLayout>
      {/* Stats Section - Always visible at top */}
      <DashboardStatsSection />

      {/* Platform Revenue Section - Shows revenue overview */}
      <div className="mt-8">
        <PlatformRevenueSection />
      </div>

      {/* Invoice Section */}
      <div className="mt-8">
        <InvoiceDashboardSection />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardView;

