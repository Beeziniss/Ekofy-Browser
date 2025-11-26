import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface ChannelCardProps {
  category: {
    id: string;
    name: string;
  };
  className?: string;
}

const ChannelCard = React.memo(({ category, className }: ChannelCardProps) => {
  // Generate a consistent background gradient based on category name
  const getGradientColors = (name: string) => {
    const gradients = [
      "from-purple-600 to-blue-600",
      "from-pink-600 to-red-600",
      "from-green-600 to-teal-600",
      "from-yellow-600 to-orange-600",
      "from-indigo-600 to-purple-600",
      "from-red-600 to-pink-600",
      "from-blue-600 to-cyan-600",
      "from-emerald-600 to-green-600",
      "from-orange-600 to-red-600",
      "from-cyan-600 to-blue-600",
    ];

    const hash = name.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return gradients[hash % gradients.length];
  };

  const gradientClass = getGradientColors(category.name);

  return (
    <Link href={`/channels/${category.id}`}>
      <div
        className={cn(
          "group relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-xl",
          className,
        )}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90`} />

        {/* Optional overlay image placeholder */}
        <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <div className="text-white">
            <h3 className="line-clamp-2 text-xl leading-tight font-semibold">{category.name}</h3>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
    </Link>
  );
});

ChannelCard.displayName = "ChannelCard";

export default ChannelCard;
