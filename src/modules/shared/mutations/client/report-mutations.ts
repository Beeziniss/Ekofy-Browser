import { graphql } from "@/gql";

export const REPORT_MUTATION = graphql(`
    mutation ReportMutation($request: CreateReportRequestInput!) {
     createReport(request: $request)
    }
`);

export const PROCESS_REPORT = graphql(`
    mutation ProcessReport($request: ProcessReportRequestInput!) {
     processReport(request: $request)
    }
`);

export const ASSIGN_REPORT_TO_MODERATOR = graphql(`
    mutation AssignReportToModerator($reportId: String!, $moderatorId: String!) {
     assignReportToModerator(reportId: $reportId, moderatorId: $moderatorId)
    }
`);

export const RESTORE_USER = graphql(`
    mutation RestoreUser($reportId: String!) {
     restoreUser(reportId: $reportId)
    }
`);

export const RESTORE_CONTENT = graphql(`
    mutation RestoreContent($reportId: String!) {
     restoreContent(reportId: $reportId)
    }
`);