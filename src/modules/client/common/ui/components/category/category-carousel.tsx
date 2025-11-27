import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesChannelQuery } from "@/gql/graphql";
import CategoryCard from "./category-card";

interface CategoryCarouselProps {
  data: CategoriesChannelQuery;
  isLoading: boolean;
}

const CategoryCarousel = ({ data, isLoading }: CategoryCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        watchDrag: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {isLoading &&
          Array.from({ length: 12 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.28%]"
            >
              <div className="flex flex-col">
                <Skeleton className="h-[120px] w-full rounded-lg text-sm">&nbsp;</Skeleton>
              </div>
            </CarouselItem>
          ))}
        {!isLoading &&
          data?.categories?.items &&
          data.categories.items.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.28%]"
            >
              <CategoryCard category={category} />
            </CarouselItem>
          ))}
        {!isLoading && (!data?.categories?.items || data.categories.items.length === 0) && (
          <div className="flex w-full items-center justify-center py-8">
            <p className="text-muted-foreground">No categories available</p>
          </div>
        )}
      </CarouselContent>
      <CarouselPrevious className="-top-9 left-[calc(100%-4.5rem)] z-20" />
      <CarouselNext className="-top-9 right-0 z-20" />
    </Carousel>
  );
};

export default CategoryCarousel;
