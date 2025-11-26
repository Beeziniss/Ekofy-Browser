import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistsHomeQuery } from "@/gql/graphql";
import PlaylistCard from "@/modules/client/playlist/ui/components/playlist-card";

interface PlaylistCarouselProps {
  data: PlaylistsHomeQuery;
  isLoading: boolean;
}

const PlaylistCarousel = ({ data, isLoading }: PlaylistCarouselProps) => {
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
                <Skeleton className="aspect-square w-full rounded-sm text-sm">&nbsp;</Skeleton>
                <Skeleton className="mt-2 h-5 w-4/5 rounded-sm text-sm">&nbsp;</Skeleton>
                <Skeleton className="mt-1 h-4 w-3/5 rounded-sm text-sm">&nbsp;</Skeleton>
              </div>
            </CarouselItem>
          ))}
        {!isLoading &&
          data?.playlists?.items &&
          data.playlists.items.map((playlist) => (
            <CarouselItem
              key={playlist.id}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.28%]"
            >
              <PlaylistCard playlist={playlist} />
            </CarouselItem>
          ))}
        {!isLoading && (!data?.playlists?.items || data.playlists.items.length === 0) && (
          <div className="flex w-full items-center justify-center py-8">
            <p className="text-muted-foreground">No playlists available</p>
          </div>
        )}
      </CarouselContent>
      <CarouselPrevious className="-top-9 left-[calc(100%-4.5rem)] z-20" />
      <CarouselNext className="-top-9 right-0 z-20" />
    </Carousel>
  );
};

export default PlaylistCarousel;
