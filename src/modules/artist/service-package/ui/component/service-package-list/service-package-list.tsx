"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, ChevronDown, ChevronUp, Eye, Trash2 } from 'lucide-react';
import { ArtistPackageStatus, ArtistPackage, Metadata } from '@/gql/graphql';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

interface ServicePackageListProps {
  packages: ArtistPackage[];
  onEdit: (packageId: string) => void;
  onDelete: (packageId: string) => void;
  onViewDetail: (packageId: string) => void;
  onStatusChange: (packageId: string, status: ArtistPackageStatus) => void;
}

const ServicePackageList= ({
  packages,
  onEdit,
  onDelete,
  onViewDetail,
  onStatusChange,
}: ServicePackageListProps) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

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
        return 'bg-green-500 hover:bg-green-600';
      case ArtistPackageStatus.Disabled:
        return 'bg-red-500 hover:bg-red-600';
      case ArtistPackageStatus.Pending:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case ArtistPackageStatus.Rejected:
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  if (packages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No service packages found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="w-full border-gradient-input">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CardTitle className="text-white">{pkg.packageName}</CardTitle>
                <Badge className={getStatusColor(pkg.status)}>
                  {pkg.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                  {pkg.status === ArtistPackageStatus.Enabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusChange(pkg.id, ArtistPackageStatus.Disabled)}
                      className="border-gradient-input text-blue-600 hover:text-white w-28 h-10"
                    >
                      Disable
                    </Button>
                  )}
                  {pkg.status === ArtistPackageStatus.Disabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusChange(pkg.id, ArtistPackageStatus.Enabled)}
                      className="border-gradient-input text-purple-400 hover:text-white w-28 h-10"
                    >
                      Enable
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(pkg.id)}
                  className="border-gray-600 text-gray-300 hover:text-white w-16 h-10"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(pkg.id)}
                  className="border-gray-600 text-gray-300 hover:text-white w-16 h-10"
                  title="Edit Package"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(pkg.id)}
                  className="border-red-600 text-red-400 hover:text-white hover:border-red-500 w-16 h-10"
                  title="Delete Package"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpanded(pkg.id)}
                  className="border-gray-600 text-gray-300 hover:text-white w-16 h-10"
                  title={expandedItems.has(pkg.id) ? "Collapse" : "Expand"}
                >
                  {expandedItems.has(pkg.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                
            </div>
            </div>
            <CardDescription className="text-green-400">
              {formatCurrency(pkg.amount, pkg.currency)}
            </CardDescription>
            <CardDescription className="text-gray-400">
              Purchase count: {pkg.estimateDeliveryDays}
            </CardDescription>
          </CardHeader>

          <Collapsible open={expandedItems.has(pkg.id)}>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <Separator className="mb-4 bg-gray-700" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                {pkg.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                    <p className="text-gray-400 text-sm bg-gray-700/50 rounded-lg p-4">{pkg.description}</p>
                  </div>
                )}
                                {pkg.createdAt && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Created At</h4>
                    <p className="text-gray-400 text-sm bg-gray-700/50 rounded-lg p-4">{new Date(pkg.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
                                {pkg.updatedAt && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Updated At</h4>
                    <p className="text-gray-400 text-sm bg-gray-700/50 rounded-lg p-4">{new Date(pkg.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}
                </div>
                                  <div className="space-y-4">

                {pkg.serviceDetails && pkg.serviceDetails.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Service Details</h4>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                                              <ul className="text-gray-400 text-sm space-y-2">
                                                {pkg.serviceDetails.map((detail: Metadata, index: number) => (
                                                  <li key={index} className="items-start border-b border-gray-600/30 pb-2 last:border-b-0 last:pb-0">
                                                    <span className="font-medium text-gray-300 mr-3">{detail.key}:</span>
                                                    <span className="text-right text-white flex-1">{detail.value}</span>
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