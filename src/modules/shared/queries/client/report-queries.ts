import { graphql } from "@/gql";

export const REPORT_QUERIES = graphql(`
    query ReportQueries($skip: Int, $take: Int, $where: ReportFilterInput) {
        reports(skip: $skip, take: $take, where: $where, order: [{ priority: ASC }, { createdAt: DESC }]) {
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
            priority
            nicknameReporter
            nicknameReported
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
            userAssignedTo {
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
            nicknameReporter
            nicknameReported
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
            userAssignedTo {
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
                commenterId
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
            request {
                id
                title
                summary
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

export const QUERY_MODERATOR_REPORTS = graphql(`
    query QueryModeratorReports($where: UserFilterInput ) {
        users(where: $where) {
        items {
            id
            fullName
        }
    }
}
`);
