import { Users, FileText, CreditCard } from "lucide-react";
import { DashboardQuickActionCard } from "../components/dashboard-quick-action-card";

export const DashboardQuickActionsSection = () => {
  const quickActions = [
    {
      href: "/admin/user-management",
      icon: Users,
      title: "User Management",
      description: "Manage users, roles, and permissions",
      iconColor: "purple" as const,
    },
    {
      href: "/admin/transactions",
      icon: CreditCard,
      title: "Transactions",
      description: "View and manage payment transactions",
      iconColor: "purple" as const,
    },
    {
      href: "/admin/subscription",
      icon: FileText,
      title: "Subscriptions",
      description: "Manage subscription plans and pricing",
      iconColor: "purple" as const,
    },
  ];

  return (
    <div className="border-gradient-input rounded-xl border bg-[#121212] p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">Get Started</h2>

      <div className="space-y-4">
        <p className="text-gray-300">
          Welcome to the Admin Dashboard. Here you can manage all aspects of the platform.
        </p>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <DashboardQuickActionCard
              key={action.href}
              href={action.href}
              icon={action.icon}
              title={action.title}
              description={action.description}
              iconColor={action.iconColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
