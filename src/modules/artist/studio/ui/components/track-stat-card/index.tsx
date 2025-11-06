import { LucideIcon } from "lucide-react";

interface TrackStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const TrackStatCard = ({ title, value, icon }: TrackStatCardProps) => {
  const Icon = icon;

  return (
    <div className="relative w-full rounded-md border border-white/30 p-4 shadow-md">
      <div className="flex flex-col gap-y-2">
        <p className="text-main-white text-base font-semibold">{title}</p>
        <p className="primary_gradient inline w-fit bg-clip-text text-xl font-bold text-transparent">{value}</p>
        <Icon className="absolute top-4 right-4" />
      </div>
    </div>
  );
};

export default TrackStatCard;
