import FollowerCard from "./follower-card";
import { FollowingInfiniteQuery } from "@/gql/graphql";
import { InfiniteData } from "@tanstack/react-query";

interface FollowingListProps {
  data: InfiniteData<FollowingInfiniteQuery, unknown>;
}

const FollowingList = ({ data }: FollowingListProps) => {
  return (
    <>
      {data?.pages
        .flatMap((page) => page.followings?.items || [])
        .map((following) => (
          <FollowerCard key={following.id} follower={following} />
        ))}
    </>
  );
};

export default FollowingList;
