import { ActivityIcon, DownloadIcon, HeartIcon, MessageSquareTextIcon } from "lucide-react";
import TrackStatCard from "../../components/track-stat-card";

const trackStats = [
  {
    title: "Likes",
    value: 1234,
    icon: HeartIcon,
  },
  {
    title: "Comments",
    value: 567,
    icon: MessageSquareTextIcon,
  },
  {
    title: "Downloads",
    value: 890,
    icon: DownloadIcon,
  },
  {
    title: "Streams",
    value: 2345,
    icon: ActivityIcon,
  },
];

const TrackStatSection = () => {
  return (
    <div className="rounded-md border border-white/30 p-8 pb-6">
      <div className="flex items-end gap-x-3">
        <h2 className="text-xl font-bold">Artist Tracks</h2>
        <span className="primary_gradient w-fit bg-clip-text text-sm text-transparent">Stats updated daily</span>
      </div>

      <div className="mt-12 flex items-center justify-between gap-8">
        {trackStats.map((stat) => (
          <TrackStatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default TrackStatSection;
