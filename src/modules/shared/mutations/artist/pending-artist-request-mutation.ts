import { graphql } from "@/gql";

export const CHANGE_REQUEST_STATUS_MUTATION = graphql(`
    mutation ChangeRequestStatus($request: ChangeStatusRequestInput!) {
        changeRequestStatus(request: $request)
    }
`);