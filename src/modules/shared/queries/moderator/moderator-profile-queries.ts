import { graphql } from "@/gql";

export const GetUserProfileQuery = graphql(`
  query Users($where: UserFilterInput) {
    users(where: $where) {
      items {
        id
        email
        fullName
        gender
        birthDate
        role
        phoneNumber
        status
        createdAt
        updatedAt
      }
    }
  }
`);