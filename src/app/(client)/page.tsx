import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TrackCard from "@/modules/client/common/ui/components/track/track-card";

export default function Home() {
  return (
    <Carousel
      opts={{
        align: "start",
        watchDrag: false,
      }}
      className="w-full px-12"
    >
      <CarouselContent className="-ml-8">
        {[...Array(9)].map((_, index) => (
          <CarouselItem key={index} className="basis-auto pl-8">
            <TrackCard />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 z-20" />
      <CarouselNext className="right-0 z-20" />
    </Carousel>
  );
}
