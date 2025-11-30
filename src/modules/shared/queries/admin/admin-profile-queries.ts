import { graphql } from "@/gql";

export const GetAdminProfileQuery = graphql(`
  query AdminProfile($where: UserFilterInput) {
    users(where: $where) {
      items {
        id
        email
        fullName
        gender
        birthDate
        phoneNumber
        status
        role
        createdAt
        updatedAt
      }
    }
  }
`);
