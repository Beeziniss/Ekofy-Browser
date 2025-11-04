import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArtistListQuery } from "@/gql/graphql";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface ArtistHireCardProps {
  artist?: NonNullable<
    NonNullable<ArtistListQuery["artists"]>["items"]
  >[number];
}

const ArtistHireCard = ({ artist }: ArtistHireCardProps) => {
  // Show skeleton if no artist data provided (loading state)
  if (!artist) {
    return (
      <div className="flex flex-col rounded-md border p-6 shadow-sm">
        <div className="flex items-start gap-x-3">
          <Skeleton className="size-15 shrink-0 rounded-full" />
          <div className="flex flex-col gap-y-1">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
        </div>
        <Skeleton className="mt-4 h-20 w-full rounded-md" />
        <Carousel
          opts={{ align: "start", dragFree: true }}
          className="mt-6 w-full px-12"
        >
          <CarouselContent className="-ml-8">
            {[...Array(6)].map((_, idx) => (
              <CarouselItem key={idx} className="basis-auto pl-8">
                <Skeleton className="h-5 w-25 rounded-md" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 z-20" />
          <CarouselNext className="right-0 z-20" />
        </Carousel>
        <Skeleton className="mt-6 h-10 w-full rounded-md" />
      </div>
    );
  }

  const location = artist.identityCard?.placeOfResidence?.province || "Unknown";
  const nationality = artist.identityCard?.nationality || "Unknown";

  return (
    <div className="flex flex-col rounded-md border p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-x-3">
        <Avatar className="size-15 shrink-0">
          <AvatarImage src={artist.avatarImage || ""} alt={artist.stageName} />
          <AvatarFallback>
            {artist.stageName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-y-1">
          <h3 className="truncate text-lg font-semibold">{artist.stageName}</h3>
          <p className="text-muted-foreground truncate text-sm capitalize">
            {location}, {nationality}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-main-white line-clamp-3 min-h-[60px] text-base">
          {artist.biography || "No biography available."}
        </p>
      </div>

      <div className="mt-6 w-full">
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {location}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {nationality}
          </Badge>
        </div>
      </div>

      <Link href={`/artists/${artist.id}`}>
        <Button className="mt-6 w-full" variant="ekofy">
          View Profile
        </Button>
      </Link>
    </div>
  );
};

export default ArtistHireCard;
