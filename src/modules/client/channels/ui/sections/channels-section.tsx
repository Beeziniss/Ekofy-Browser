"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesChannelOptions } from "@/gql/options/client-options";
import { CategoryType } from "@/gql/graphql";
import ChannelGrid from "../components/channel-grid";

const ChannelsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Genres</h2>

      {/* Genres Section */}
      <Suspense fallback={<ChannelGridSkeleton />}>
        <GenresSection />
      </Suspense>

      <h2 className="text-2xl font-semibold text-white">Moods</h2>
      {/* Mood Section */}
      <Suspense fallback={<ChannelGridSkeleton />}>
        <MoodSection />
      </Suspense>
    </div>
  );
};

const ChannelGridSkeleton = () => {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: 24 }).map((_, index) => (
        <div key={index} className="aspect-square animate-pulse rounded-lg bg-gray-800" />
      ))}
    </div>
  );
};

const GenresSection = () => {
  const { data, isPending } = useSuspenseQuery(categoriesChannelOptions(CategoryType.Genre, 50));

  if (isPending) {
    return <ChannelGridSkeleton />;
  }

  return <ChannelGrid categories={data?.categories?.items || []} />;
};

const MoodSection = () => {
  const { data, isPending } = useSuspenseQuery(categoriesChannelOptions(CategoryType.Mood, 50));

  if (isPending) {
    return <ChannelGridSkeleton />;
  }

  return <ChannelGrid categories={data?.categories?.items || []} />;
};

export default ChannelsSection;
