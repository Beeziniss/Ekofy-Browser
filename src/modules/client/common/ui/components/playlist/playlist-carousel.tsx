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
      className="w-full px-12"
    >
      <CarouselContent className="-ml-8">
        {isLoading &&
          Array.from({ length: 14 }).map((_, index) => (
            <CarouselItem key={index} className="basis-auto pl-8">
              <div className="flex flex-col">
                <Skeleton className="size-70 rounded-sm text-sm">&nbsp;</Skeleton>
                <Skeleton className="mt-2 h-5 w-32 rounded-sm text-sm">&nbsp;</Skeleton>
                <Skeleton className="mt-1 h-4 w-24 rounded-sm text-sm">&nbsp;</Skeleton>
              </div>
            </CarouselItem>
          ))}
        {!isLoading &&
          data?.playlists?.items &&
          data.playlists.items.map((playlist) => (
            <CarouselItem key={playlist.id} className="shrink-0 grow-0 basis-[312px] pl-8">
              <div className="w-[280px]">
                <PlaylistCard playlist={playlist} />
              </div>
            </CarouselItem>
          ))}
        {!isLoading && (!data?.playlists?.items || data.playlists.items.length === 0) && (
          <div className="flex w-full items-center justify-center py-8">
            <p className="text-muted-foreground">No playlists available</p>
          </div>
        )}
      </CarouselContent>
      <CarouselPrevious className="left-0 z-20" />
      <CarouselNext className="right-0 z-20" />
    </Carousel>
  );
};

export default PlaylistCarousel;
