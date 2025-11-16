import { graphql } from "@/gql"

// Mutation for creating artist package
export const createArtistPackageMutation = graphql(`
  mutation CreateArtistPackage($createRequest: CreateArtistPackageRequestInput!) {
    createArtistPackage(createRequest: $createRequest)
  }
`)

// Mutation for changing package status
export const changeArtistPackageStatusMutation = graphql(`
  mutation ChangeArtistPackageStatus($updateStatusRequest: UpdateStatusArtistPackageRequestInput!) {
    changeArtistPackageStatus(updateStatusRequest: $updateStatusRequest)
  }
`)

// Mutation for approving artist package
// export const approveArtistPackageMutation = graphql(`
//   mutation ApproveArtistPackage($id: String!) {
//     approveArtistPackage(id: $id)
//   }
// `)

// Mutation for rejecting artist package
// export const rejectArtistPackageMutation = graphql(`
//   mutation RejectArtistPackage($id: String!) {
//     rejectArtistPackage(id: $id)
//   }
// `)

export const updateArtistPackageMutation = graphql(`
  mutation UpdateArtistPackage($updateRequest: UpdateArtistPackageRequestInput!) {
    updateArtistPackage(updateRequest: $updateRequest)
  }
`)

export const deleteArtistPackageMutation = graphql(`
  mutation DeleteArtistPackage($artistPackageId: String!) {
    deleteArtistPackage(artistPackageId: $artistPackageId)
  }
`)