"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Entitlement } from "@/types/entitlement";
import { formatDate } from "@/utils/format-date";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye as EyeIcon, MoreHorizontal, Power, PowerOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface EntitlementTableProps {
  entitlements: Entitlement[];
  isLoading?: boolean;
  onView?: (entitlementId: string) => void;
  onDeactivate?: (code: string) => void;
  onReactivate?: (code: string) => void;
}

export function EntitlementTable({
  entitlements,
  isLoading,
  onView,
  onDeactivate,
  onReactivate,
}: EntitlementTableProps) {
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedEntitlement, setSelectedEntitlement] = useState<Entitlement | null>(null);
  const [actionType, setActionType] = useState<"deactivate" | "reactivate" | null>(null);

  const handleActionClick = (entitlement: Entitlement, type: "deactivate" | "reactivate") => {
    setSelectedEntitlement(entitlement);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const handleActionConfirm = () => {
    if (selectedEntitlement && actionType) {
      if (actionType === "deactivate") {
        onDeactivate?.(selectedEntitlement.code);
      } else {
        onReactivate?.(selectedEntitlement.code);
      }
      setActionDialogOpen(false);
      setSelectedEntitlement(null);
      setActionType(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (entitlements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No entitlements found</h3>
          <p className="text-muted-foreground mb-4 mt-2 text-sm">
            You haven&apos;t created any entitlements yet. Start by creating a new entitlement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Value Type</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Default Roles</TableHead> */}
              <TableHead>Subscription Overrides</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entitlements.map((entitlement, index) => (
              <TableRow key={entitlement.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{entitlement.name}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{entitlement.code}</code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{entitlement.valueType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={entitlement.isActive ? "default" : "secondary"}
                    className="flex w-fit items-center gap-1"
                  >
                    {entitlement.isActive ? (
                      <>
                        Active
                      </>
                    ) : (
                      <>
                        Inactive
                      </>
                    )}
                  </Badge>
                </TableCell>
                {/* <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {entitlement.defaultValues?.map((dv, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {dv.role}
                      </Badge>
                    ))}
                    {(!entitlement.defaultValues || entitlement.defaultValues.length === 0) && (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                  </div>
                </TableCell> */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {entitlement.subscriptionOverrides?.map((so, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {so.subscriptionCode}
                      </Badge>
                    ))}
                    {(!entitlement.subscriptionOverrides || entitlement.subscriptionOverrides.length === 0) && (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(entitlement.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView?.(entitlement.id)}>
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {entitlement.isActive ? (
                        <DropdownMenuItem
                          onClick={() => handleActionClick(entitlement, "deactivate")}
                          className="text-destructive focus:text-destructive"
                        >
                          <PowerOff className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleActionClick(entitlement, "reactivate")}
                        >
                          <Power className="mr-2 h-4 w-4" />
                          Reactivate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "deactivate"
                ? `This will deactivate the entitlement "${selectedEntitlement?.name}". Users will no longer have access to this feature.`
                : `This will reactivate the entitlement "${selectedEntitlement?.name}". Users will regain access to this feature.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              className={actionType === "deactivate" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {actionType === "deactivate" ? "Deactivate" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

