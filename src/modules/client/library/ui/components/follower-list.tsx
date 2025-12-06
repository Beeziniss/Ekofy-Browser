import FollowerCard from "./follower-card";
import { FollowerInfiniteQuery } from "@/gql/graphql";
import { InfiniteData } from "@tanstack/react-query";

interface FollowerListProps {
  data: InfiniteData<FollowerInfiniteQuery, unknown>;
}

const FollowerList = ({ data }: FollowerListProps) => {
  return (
    <>
      {data?.pages
        .flatMap((page) => page.followers?.items || [])
        .map((follower) => (
          <FollowerCard key={follower.id} follower={follower} />
        ))}
    </>
  );
};

export default FollowerList;
