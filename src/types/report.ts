import { ReportType, ReportRelatedContentType } from "@/gql/graphql";

export interface ReportFormData {
  reportType: ReportType;
  description: string;
  evidences?: string[];
  reportedUserId: string;
  relatedContentId?: string;
  relatedContentType?: ReportRelatedContentType;
}

export interface ReportButtonProps {
  contentType: ReportRelatedContentType;
  contentId?: string; // For Track, Comment, Request
  reportedUserId: string;
  reportedUserName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Report type mapping based on content type
export const REPORT_TYPES_BY_CONTENT: Record<ReportRelatedContentType, ReportType[]> = {
  [ReportRelatedContentType.Artist]: [
    ReportType.Harassment,
    ReportType.HateSpeech,
    ReportType.Impersonation,
    ReportType.CopyrightViolation,
    ReportType.FakeAccount,
    ReportType.ScamOrFraud,
  ],
  [ReportRelatedContentType.Comment]: [
    ReportType.Spam,
    ReportType.Harassment,
    ReportType.HateSpeech,
    ReportType.InappropriateContent,
    ReportType.SelfHarmOrDangerousContent,
    ReportType.Other,
  ],
  [ReportRelatedContentType.Listener]: [
    ReportType.Spam,
    ReportType.Harassment,
    ReportType.FakeAccount,
    ReportType.ScamOrFraud,
    ReportType.Impersonation,
  ],
  [ReportRelatedContentType.Request]: [
    ReportType.Spam,
    ReportType.ScamOrFraud,
    ReportType.InappropriateContent,
    ReportType.CopyrightViolation,
    ReportType.Other,
  ],
  [ReportRelatedContentType.Track]: [
    ReportType.CopyrightViolation,
    ReportType.InappropriateContent,
    ReportType.HateSpeech,
    ReportType.ScamOrFraud,
    ReportType.Other,
  ],
};

// Report type labels
export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  [ReportType.Harassment]: "Harassment",
  [ReportType.HateSpeech]: "Hate Speech",
  [ReportType.Impersonation]: "Impersonation",
  [ReportType.CopyrightViolation]: "Copyright Violation",
  [ReportType.FakeAccount]: "Fake Account",
  [ReportType.ScamOrFraud]: "Scam/Fraud",
  [ReportType.Spam]: "Spam",
  [ReportType.InappropriateContent]: "Inappropriate Content",
  [ReportType.SelfHarmOrDangerousContent]: "Self-Harm or Dangerous",
  [ReportType.PrivacyViolation]: "Privacy Violation",
  [ReportType.UnapprovedUploadedTrack]: "Unapproved Uploaded Track",
  [ReportType.Other]: "Other",
};

// Content type labels
export const CONTENT_TYPE_LABELS: Record<ReportRelatedContentType, string> = {
  [ReportRelatedContentType.Artist]: "Artist",
  [ReportRelatedContentType.Comment]: "Comment",
  [ReportRelatedContentType.Listener]: "Listener",
  [ReportRelatedContentType.Request]: "Request",
  [ReportRelatedContentType.Track]: "Track",
};
