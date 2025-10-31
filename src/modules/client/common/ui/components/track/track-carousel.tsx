import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TrackListHomeQuery } from "@/gql/graphql";
import { Skeleton } from "@/components/ui/skeleton";
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
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {isLoading &&
          Array.from({ length: 14 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.28%]"
            >
              <div className="flex flex-col">
                <Skeleton className="aspect-square w-full rounded-sm text-sm">
                  &nbsp;
                </Skeleton>
                <Skeleton className="mt-2 h-5 w-4/5 rounded-sm text-sm">
                  &nbsp;
                </Skeleton>
                <Skeleton className="mt-1 h-4 w-3/5 rounded-sm text-sm">
                  &nbsp;
                </Skeleton>
              </div>
            </CarouselItem>
          ))}
        {!isLoading &&
          data?.tracks?.items &&
          data.tracks.items.map((track) => (
            <CarouselItem
              key={track.id}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.28%]"
            >
              <TrackCard
                trackId={track.id}
                coverImage={track.coverImage}
                trackName={track.name}
                checkTrackInFavorite={track.checkTrackInFavorite}
                artists={
                  track.mainArtists?.items?.map((artist) => ({
                    id: artist.id,
                    stageName: artist.stageName,
                  })) || []
                }
                trackQueue={
                  data.tracks?.items?.filter(
                    (item): item is NonNullable<typeof item> => item !== null,
                  ) || []
                }
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
      <CarouselPrevious className="-top-9 left-[calc(100%-4.5rem)] z-20" />
      <CarouselNext className="-top-9 right-0 z-20" />
    </Carousel>
  );
};

export default TrackCarousel;
