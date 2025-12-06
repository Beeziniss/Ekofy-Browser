import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

interface DashboardQuickActionCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: "purple"
//   iconColor: "purple" | "blue" | "green";
}

const colorClasses = {
  purple: {
    border: "hover:border-purple-500",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  }
};

export const DashboardQuickActionCard = ({
  href,
  icon: Icon,
  title,
  description,
  iconColor,
}: DashboardQuickActionCardProps) => {
  const colors = colorClasses[iconColor];

  return (
    <Link
      href={href}
      className={`group flex items-start gap-4 rounded-lg border border-gray-700 bg-white/2 p-4 transition-all ${colors.border} hover:bg-white/10`}
    >
      <div className={`rounded-lg ${colors.iconBg} p-3`}>
        <Icon className={`h-6 w-6 ${colors.iconColor}`} />
      </div>
      <div className="flex-1">
        <h3 className="mb-1 font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        <ArrowRight
          className={`mt-2 h-4 w-4 ${colors.iconColor} opacity-0 transition-opacity group-hover:opacity-100`}
        />
      </div>
    </Link>
  );
};
