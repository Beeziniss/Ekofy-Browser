import { useMutation, useQueryClient } from "@tanstack/react-query";
import { execute } from "../execute";
import {
  REPORT_MUTATION,
  PROCESS_REPORT,
  ASSIGN_REPORT_TO_MODERATOR,
  RESTORE_USER,
  RESTORE_CONTENT,
} from "@/modules/shared/mutations/client/report-mutations";
import { CreateReportRequestInput, ProcessReportRequestInput } from "../graphql";

// Create a new report
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateReportRequestInput) => {
      const result = await execute(REPORT_MUTATION, { request });
      return result.createReport;
    },
    onSuccess: () => {
      // Invalidate reports list
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-infinite"] });
    },
  });
};

// Process a report (approve/reject/dismiss)
export const useProcessReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ProcessReportRequestInput) => {
      const result = await execute(PROCESS_REPORT, { request });
      return result.processReport;
    },
    onSuccess: (_, variables) => {
      // Invalidate reports lists
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["reports-by-status"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-reports"] });
      
      // Invalidate specific report detail if we have the reportId
      if (variables.reportId) {
        queryClient.invalidateQueries({ queryKey: ["report-detail", variables.reportId] });
      }
    },
  });
};

// Assign report to moderator
export const useAssignReportToModerator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, moderatorId }: { reportId: string; moderatorId: string }) => {
      const result = await execute(ASSIGN_REPORT_TO_MODERATOR, { reportId, moderatorId });
      return result.assignReportToModerator;
    },
    onSuccess: (_, variables) => {
      // Invalidate reports lists
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-reports"] });
      
      // Invalidate specific report detail
      queryClient.invalidateQueries({ queryKey: ["report-detail", variables.reportId] });
    },
  });
};

// Restore user from a report
export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId: string) => {
      const result = await execute(RESTORE_USER, { reportId });
      return result.restoreUser;
    },
    onSuccess: (_, reportId) => {
      // Invalidate reports lists
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["reports-by-status"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-reports"] });
      // Invalidate specific report detail
      queryClient.invalidateQueries({ queryKey: ["report-detail", reportId] });
    },
  });
};

// Restore content from a report
export const useRestoreContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId: string) => {
      const result = await execute(RESTORE_CONTENT, { reportId });
      return result.restoreContent;
    },
    onSuccess: (_, reportId) => {
      // Invalidate reports lists
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["reports-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["reports-by-status"] });
      queryClient.invalidateQueries({ queryKey: ["assigned-reports"] });
      // Invalidate specific report detail
      queryClient.invalidateQueries({ queryKey: ["report-detail", reportId] });
    },
  });
};
