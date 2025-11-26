"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, ChevronDown, ChevronUp, Trash2, Clock, RotateCcw } from "lucide-react";
import { ArtistPackageStatus, ArtistPackage, Metadata } from "@/gql/graphql";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { usePackageUtils } from "../../../hooks";

interface ServicePackageListProps {
  packages: Omit<ArtistPackage, "artist" | "review">[];
  onEdit: (packageId: string) => void;
  onDelete: (packageId: string) => void;
  // onViewDetail: (packageId: string) => void;
  onStatusChange: (packageId: string, status: ArtistPackageStatus) => void;
}

const ServicePackageList = ({ packages, onEdit, onDelete, onStatusChange }: ServicePackageListProps) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const { formatRevisionText } = usePackageUtils();

  const toggleExpanded = (packageId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusColor = (status: ArtistPackageStatus) => {
    switch (status) {
      case ArtistPackageStatus.Enabled:
        return "bg-green-500 hover:bg-green-600";
      case ArtistPackageStatus.Disabled:
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  if (packages.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No service packages found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="border-gradient-input w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CardTitle className="text-white">{pkg.packageName}</CardTitle>
                <Badge className={getStatusColor(pkg.status)}>{pkg.status}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-2">
                  {pkg.status === ArtistPackageStatus.Enabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusChange(pkg.id, ArtistPackageStatus.Disabled)}
                      className="border-gradient-input h-10 w-28 text-blue-600 hover:text-white"
                    >
                      Disable
                    </Button>
                  )}
                  {pkg.status === ArtistPackageStatus.Disabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusChange(pkg.id, ArtistPackageStatus.Enabled)}
                      className="border-gradient-input h-10 w-28 text-purple-400 hover:text-white"
                    >
                      Enable
                    </Button>
                  )}
                </div>

                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(pkg.id)}
                  className="h-10 w-16 border-gray-600 text-gray-300 hover:text-white"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(pkg.id)}
                  className="h-10 w-16 border-gray-600 text-gray-300 hover:text-white"
                  title="Edit Package"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(pkg.id)}
                  className="h-10 w-16 border-red-600 text-red-400 hover:border-red-500 hover:text-white"
                  title="Delete Package"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpanded(pkg.id)}
                  className="h-10 w-16 border-gray-600 text-gray-300 hover:text-white"
                  title={expandedItems.has(pkg.id) ? "Collapse" : "Expand"}
                >
                  {expandedItems.has(pkg.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <CardDescription className="text-green-400">{formatCurrency(pkg.amount, pkg.currency)}</CardDescription>
            <CardDescription className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {pkg.estimateDeliveryDays} day{pkg.estimateDeliveryDays > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                {formatRevisionText(pkg.maxRevision || 0)}
              </span>
            </CardDescription>
          </CardHeader>

          <Collapsible open={expandedItems.has(pkg.id)}>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <Separator className="mb-4 bg-gray-700" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    {pkg.description && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-300">Description</h4>
                        <p className="rounded-lg bg-gray-700/50 p-4 text-sm text-gray-400">{pkg.description}</p>
                      </div>
                    )}
                    {pkg.createdAt && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-300">Created At</h4>
                        <p className="rounded-lg bg-gray-700/50 p-4 text-sm text-gray-400">
                          {new Date(pkg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {pkg.updatedAt && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-300">Updated At</h4>
                        <p className="rounded-lg bg-gray-700/50 p-4 text-sm text-gray-400">
                          {new Date(pkg.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {pkg.serviceDetails && pkg.serviceDetails.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-300">Service Details</h4>
                        <div className="rounded-lg bg-gray-700/50 p-4">
                          <ul className="space-y-2 text-sm text-gray-400">
                            {pkg.serviceDetails.map((detail: Metadata, index: number) => (
                              <li
                                key={index}
                                className="items-start border-b border-gray-600/30 pb-2 last:border-b-0 last:pb-0"
                              >
                                <span className="mr-3 font-medium text-gray-300">{detail.key}:</span>
                                <span className="flex-1 text-right text-white">{detail.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};

export default ServicePackageList;
