# Report Control Module

Module manages report control functionality for moderators, including viewing, filtering, and processing user reports.

## Structure

This module follows the **view/section/layout/component** architecture pattern:

```
report-control/
├── ui/
│   ├── view/                    # Main orchestrator components
│   │   ├── report-list-view.tsx       # List view with filters, table, pagination
│   │   └── report-detail-view.tsx     # Detail view with all report information
│   ├── section/                 # Specific feature sections
│   │   ├── report-filters-section.tsx        # Search and filter controls
│   │   ├── report-table-section.tsx          # Data table with actions
│   │   ├── report-pagination-section.tsx     # Pagination controls
│   │   ├── report-detail-header-section.tsx  # Detail page header with actions
│   │   ├── report-detail-info-section.tsx    # Report information card
│   │   └── report-detail-sidebar-section.tsx # Sidebar with user info & timeline
│   ├── layout/                  # Layout components
│   │   ├── report-control-layout.tsx  # List page layout structure
│   │   └── report-detail-layout.tsx   # Detail page layout structure
│   └── components/              # Reusable components
│       └── process-report-dialog.tsx  # Dialog for processing reports
└── README.md
```

## Architecture Pattern

### 1. **View Components**
Main orchestrator that combines sections and manages state:
- `ReportListView`: Orchestrates filters + table + pagination for list page
- `ReportDetailView`: Orchestrates header + info + sidebar for detail page

**Responsibilities:**
- Manage page-level state (filters, pagination, dialogs)
- Coordinate data fetching with React Query
- Pass data and callbacks to sections

### 2. **Section Components**
Focused feature blocks that handle specific UI areas:
- `ReportFiltersSection`: Search bar and status/type filters
- `ReportTableSection`: Data table with action buttons
- `ReportPaginationSection`: Page navigation controls
- `ReportDetailHeaderSection`: Back button and process action
- `ReportDetailInfoSection`: Report details, evidence, notes
- `ReportDetailSidebarSection`: Reporter, reported user, moderator, timeline

**Responsibilities:**
- Handle specific UI functionality
- Receive data via props
- Emit events via callbacks
- No direct API calls (data comes from view)

### 3. **Layout Components**
Define page structure and grid:
- `ReportControlLayout`: Simple wrapper for list page
- `ReportDetailLayout`: 2-column grid (2/3 main, 1/3 sidebar)

**Responsibilities:**
- Define responsive grid/flex layouts
- Accept sections as children/props
- No business logic

### 4. **Component Components**
Shared, reusable UI elements:
- `ProcessReportDialog`: Modal for processing reports with action selection

**Responsibilities:**
- Highly reusable across different contexts
- Self-contained with own state
- Configurable via props

## Features

### Report List Page
- **Search & Filter**: By status, report type, reporter, reported user
- **Data Table**: Shows report type, users, status, action, created date
- **Actions**: 
  - View: Navigate to detail page
  - Assign: Assign report to current moderator
  - Process: Open process dialog
- **Pagination**: Page-based navigation with count

### Report Detail Page
- **Header**: Back to list + Process button (if actionable)
- **Main Content**:
  - Report information with status badge
  - Report type and description
  - Related content (Track, Comment, etc.)
  - Evidence links
  - Moderator notes (if processed)
- **Sidebar**:
  - Reporter information
  - Reported user information
  - Assigned moderator (if assigned)
  - Timeline (created, updated)

## Data Flow

### List Page
```
Page Component (SSR)
  └─> prefetchQuery(reportsOptions) 
        └─> ReportListView
              ├─> useQuery(reportsOptions) [skip-based]
              ├─> ReportFiltersSection (filters state)
              ├─> ReportTableSection (reports data)
              └─> ReportPaginationSection (pagination state)
```

### Detail Page
```
Page Component (SSR)
  └─> prefetchQuery(reportDetailOptions)
        └─> ReportDetailView
              ├─> ReportDetailLayout
              │     ├─> header: ReportDetailHeaderSection
              │     ├─> mainContent: ReportDetailInfoSection
              │     └─> sidebar: ReportDetailSidebarSection
              └─> ProcessReportDialog (controlled)
```

## GraphQL Queries

Uses `report-options.ts` for all query configurations:

- `reportsOptions(skip, take, where)` - List with pagination
- `reportDetailOptions(reportId)` - Single report detail
- `reportsByStatusOptions(status, skip, take)` - Filter by status
- `assignedReportsOptions(moderatorId, skip, take)` - Moderator's reports
- `infiniteReportsOptions(take, where)` - Infinite scroll

## Report Processing Flow

1. **User Report**: Click "Report" → Fill form → Submit (PENDING)
2. **Moderator Assign**: Click "Assign" → Assign to self (ASSIGN_REPORT_TO_MODERATOR)
3. **Moderator Process**: Click "Process" → Select action → Submit (PROCESS_REPORT)

## Actions & Status

### Report Actions
- **NoAction**: No action → Status: DISMISSED/REJECTED
- **Warning**: Warning → Status: APPROVED
- **Suspended**: Suspend account → Status: APPROVED (requires days)
- **EntitlementRestriction**: Restrict permissions → Status: APPROVED (select permissions)
- **ContentRemoval**: Remove content → Status: APPROVED
- **PermanentBan**: Permanent ban → Status: APPROVED

### Report Status
- **PENDING**: Waiting for assignment
- **UNDER_REVIEW**: Assigned to moderator, under review
- **APPROVED**: Report accepted, action taken
- **REJECTED**: Report rejected
- **DISMISSED**: Report dismissed
- **ESCALATED**: Escalated to higher level

## Usage Example

### List Page
```tsx
import { ReportListView } from "@/modules/moderator/report-control/ui";

export default function ReportControlPage() {
  return <ReportListView />;
}
```

### Detail Page
```tsx
import { ReportDetailView } from "@/modules/moderator/report-control/ui";
import { reportDetailOptions } from "@/gql/options/report-options";

export default async function ReportDetailPage({ params }) {
  const report = await queryClient.fetchQuery(
    reportDetailOptions(params.reportId)
  );
  
  if (!report) notFound();
  
  return <ReportDetailView report={report} />;
}
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each component has a clear, single responsibility
2. **Reusability**: Sections can be reused in different views or layouts
3. **Testability**: Easy to test sections in isolation
4. **Maintainability**: Changes to one section don't affect others
5. **Scalability**: Easy to add new sections or modify layouts
6. **Type Safety**: Strong TypeScript typing throughout
7. **Consistency**: Same pattern used across list and detail pages

## Related Files

- **GraphQL Options**: `src/gql/options/report-options.ts`
- **GraphQL Queries**: `src/modules/shared/queries/client/report-queries.ts`
- **GraphQL Mutations**: `src/modules/shared/mutations/client/report-mutations.ts`
- **Types**: `src/types/report.ts`
- **Routes**: 
  - List: `src/app/moderator/(main)/report-control/page.tsx`
  - Detail: `src/app/moderator/(main)/report-control/[reportId]/page.tsx`
