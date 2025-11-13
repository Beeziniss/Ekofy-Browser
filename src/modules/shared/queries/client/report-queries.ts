import { graphql } from "@/gql";

export const REPORT_QUERIES = graphql(`
    query ReportQueries($skip: Int, $take: Int, $where: ReportFilterInput) {
        reports(skip: $skip, take: $take, where: $where) {
            totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            reportedUserId
            reporterId
            reportType
            status
            relatedContentType
            relatedContentId
            assignedModeratorId
            actionTaken
            totalReportsCount
            createdAt
            description
            userReporter {
                id
                fullName
                role
            }
            userReported {
                id
                fullName
                role
            }
            track {
                id
                name
            }
            comment {
                id
                commentType
                content
                targetId
                user {
                    id
                    fullName
                }
                listener {
                    id
                    displayName
                }
                artist {
                    id
                    stageName
                }
                track {
                    id
                    name
                }
            }
        }
    }
}
`);

export const REPORT_DETAIL_QUERY = graphql(`
    query ReportDetailQuery($where: ReportFilterInput) {
        reports(where: $where) {
        items {
            id
            reportedUserId
            reporterId
            reportType
            status
            relatedContentType
            relatedContentId
            assignedModeratorId
            actionTaken
            totalReportsCount
            createdAt
            updatedAt
            userReporter {
                id
                fullName
                role
            }
            userReported {
                id
                fullName
                role
            }
            track {
                id
                name
            }
            comment {
                id
                commentType
                content
                targetId
                user {
                    id
                    fullName
                }
                listener {
                    id
                    displayName
                }
                artist {
                    id
                    stageName
                }
                track {
                    id
                    name
                }
            }
            description
            priority
            evidences
            note
            resolvedAt
        }
    }
}
`);


