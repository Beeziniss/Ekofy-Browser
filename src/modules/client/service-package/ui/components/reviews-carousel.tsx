"use client";

import { useQuery } from "@tanstack/react-query";
import { servicePackageReviewOptions } from "@/gql/options/client-options";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserInitials } from "@/utils/format-shorten-name";
import { formatDistanceToNow } from "date-fns";

interface ReviewsCarouselProps {
  artistPackageId: string;
  averageRating: number;
  totalReviews: number;
}

const ReviewsCarouselSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-7 w-32" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton key={star} className="size-5 rounded" />
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="w-full max-w-sm border-slate-700/50 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Skeleton key={star} className="size-4 rounded" />
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ReviewsCarousel = ({ artistPackageId, averageRating, totalReviews }: ReviewsCarouselProps) => {
  const { data, isLoading } = useQuery({
    ...servicePackageReviewOptions({ artistPackageId, take: 10 }),
    staleTime: 5 * 60 * 1000, // 5 minutes - data từ prefetch sẽ được sử dụng ngay
  });

  // Hiển thị skeleton khi đang loading
  if (isLoading) {
    return <ReviewsCarouselSkeleton />;
  }

  // Filter reviews - chỉ lấy những order có review và review không null/undefined
  const reviews = data?.packageOrders?.items?.filter((item) => {
    return item?.review !== null && item?.review !== undefined;
  }) || [];

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-main-white text-xl font-bold">Reviews</h4>
          {totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`size-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-slate-600 text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-main-white text-lg font-bold">
                  {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
                </span>
                <span className="text-main-white/60 text-xs">({totalReviews || 0} reviews)</span>
              </div>
            </div>
          )}
        </div>
        <p className="text-main-white/70">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
      {/* Header với Rating Summary */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-main-white mb-2 text-xl font-bold">Reviews</h4>
          <div className="flex items-center gap-4">
            {/* Average Rating Display */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`size-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-slate-600 text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <div className="space-x-2">
                <span className="text-main-white text-lg font-bold">
                  {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
                </span>
                <span className="text-main-white/60 text-xs">({totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Carousel
        opts={{
          align: "start",
          watchDrag: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {reviews.map((order) => {
            const review = order?.review;
            const client = order?.client?.[0];
            if (!review) return null;

            return (
              <CarouselItem key={order.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="border-slate-700/50 bg-slate-800/50 h-full py-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="border-main-purple/50 size-12 border-2">
                        <AvatarImage src={client?.avatarImage || undefined} alt={client?.displayName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-bold">
                          {getUserInitials(client?.displayName || "User")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-main-white font-semibold">{client?.displayName || "Anonymous"}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`size-4 ${
                                  star <= (review.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-slate-600 text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-main-white/60 text-xs">
                          {review.createdAt
                            ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                            : ""}
                        </p>
                      </div>
                    </div>
                    {review.content && (
                      <p className="text-main-white/80 line-clamp-4 text-sm leading-relaxed">{review.content}</p>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-12 border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white" />
        <CarouselNext className="-right-12 border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white" />
      </Carousel>
    </div>
  );
};

export default ReviewsCarousel;

