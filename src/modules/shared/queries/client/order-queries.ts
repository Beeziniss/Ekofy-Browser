import { graphql } from "@/gql";

export const OrderPackageQuery = graphql(`
  query OrderPackage($where: PackageOrderFilterInput, $take: Int, $skip: Int) {
    packageOrders(where: $where, take: $take, skip: $skip, order: { createdAt: DESC }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
      items {
        id
        status
        clientId
        artistPackageId
        deadline
        package {
          id
          packageName
          amount
        }
        client {
          displayName
          avatarImage
        }
      }
    }
  }
`);
