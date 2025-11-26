import { graphql } from "@/gql";

export const DeActiveUserMutation = graphql(`
  mutation BanUser($targetUserId: String!) {
    banUser(targetUserId: $targetUserId)
  }
`);

export const ReActiveUserMutation = graphql(`
  mutation UnbanUser($targetUserId: String!) {
    unbanUser(targetUserId: $targetUserId)
  }
`);
