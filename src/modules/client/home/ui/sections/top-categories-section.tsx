"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesChannelOptions } from "@/gql/options/client-options";
import { CategoryType } from "@/gql/graphql";
import CategoryCarousel from "@/modules/client/common/ui/components/category/category-carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TopCategoriesSection = () => {
  return (
    <Suspense fallback={<TopCategoriesSkeleton />}>
      <TopCategoriesSectionSuspense />
    </Suspense>
  );
};

const TopCategoriesSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-xl font-semibold">Your top categories</div>
      <CategoryCarousel data={{}} isLoading />
    </div>
  );
};

const TopCategoriesSectionSuspense = () => {
  const { data, isPending } = useSuspenseQuery(categoriesChannelOptions(CategoryType.Genre, 12));

  return (
    <div className="w-full space-y-6 px-4">
      <div className="flex items-center gap-x-3 text-2xl font-semibold">
        <span>Your top genres</span>
        <Link href={"/channels"}>
          <Button variant={"outline"} size={"sm"}>
            View All
          </Button>
        </Link>
      </div>
      <CategoryCarousel data={data} isLoading={isPending} />
    </div>
  );
};

export default TopCategoriesSection;
