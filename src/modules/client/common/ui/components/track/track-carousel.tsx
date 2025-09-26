import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackListHomeQuery } from "@/gql/graphql";
import TrackCard from "@/modules/client/common/ui/components/track/track-card";

interface TrackCarouselProps {
  data: TrackListHomeQuery;
  isLoading: boolean;
}

const TrackCarousel = ({ data, isLoading }: TrackCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        watchDrag: false,
      }}
      className="w-full px-12"
    >
      <CarouselContent className="-ml-8">
        {isLoading &&
          Array.from({ length: 14 }).map((_, index) => (
            <CarouselItem key={index} className="basis-auto pl-8">
              <div className="flex flex-col">
                <Skeleton className="size-70 rounded-sm text-sm">
                  &nbsp;
                </Skeleton>
                <Skeleton className="mt-2 h-4 w-32 rounded-sm text-sm">
                  &nbsp;
                </Skeleton>
                <Skeleton className="mt-1 h-3 w-24 rounded-sm text-sm">
                  &nbsp;
                </Skeleton>
              </div>
            </CarouselItem>
          ))}
        {!isLoading &&
          data?.tracks?.items &&
          data.tracks.items.map((track) => (
            <CarouselItem key={track.id} className="basis-auto pl-8">
              <TrackCard
                coverImage={track.coverImage}
                trackName={track.name}
                artists={track.artist}
              />
            </CarouselItem>
          ))}
        {!isLoading &&
          (!data?.tracks?.items || data.tracks.items.length === 0) && (
            <div className="flex w-full items-center justify-center py-8">
              <p className="text-muted-foreground">No tracks available</p>
            </div>
          )}
      </CarouselContent>
      <CarouselPrevious className="left-0 z-20" />
      <CarouselNext className="right-0 z-20" />
    </Carousel>
  );
};

export default TrackCarousel;
