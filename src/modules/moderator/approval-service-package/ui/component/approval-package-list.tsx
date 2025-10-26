import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { PendingArtistPackageResponse, Metadata } from '@/gql/graphql';

interface Artist {
  stageName: string;
  userId: string;
  id: string;
}

interface ApprovalPackageListProps {
  packages: PendingArtistPackageResponse[];
  artists: Artist[];
  onApprove: (packageId: string) => void;
  onReject: (packageId: string) => void;
  onViewDetail?: (packageId: string) => void;
  isLoading?: boolean;
}

const ApprovalPackageList: React.FC<ApprovalPackageListProps> = ({
  packages,
  artists,
  onApprove,
  onReject,
  isLoading = false,
}) => {
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

  const getArtistName = (artistId: string) => {
    const artist = artists.find(a => a.id === artistId);
    return artist?.stageName || 'Unknown Artist';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <Check className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">All caught up!</h3>
        <p className="text-gray-400">No pending service packages require approval.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="w-full border-gray-700 hover:border-gray-600 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CardTitle className="text-white">{pkg.packageName}</CardTitle>
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                  {pkg.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpanded(pkg.id)}
                  className="border-gray-600 text-gray-300 hover:text-white"
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
              Delivery time: {pkg.estimateDeliveryDays} days
            </CardDescription>
          </CardHeader>

          <Collapsible open={expandedItems.has(pkg.id)}>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <Separator className="mb-6 bg-gray-700" />
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Artist Information</h4>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-white font-medium">{getArtistName(pkg.artistId)}</p>
                        </div>
                    </div>

                    {pkg.description && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <p className="text-gray-300 text-sm leading-relaxed">{pkg.description}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {pkg.serviceDetails && pkg.serviceDetails.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Service Details</h4>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <ul className="text-gray-400 text-sm space-y-2">
                            {pkg.serviceDetails.map((detail: Metadata, index: number) => (
                              <li key={index} className="flex justify-between items-start border-b border-gray-600/30 pb-2 last:border-b-0 last:pb-0">
                                <span className="font-medium text-gray-300 mr-3">{detail.key}:</span>
                                <span className="text-right text-white flex-1">{detail.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Package Information */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Package Information</h4>
                      <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-green-400 font-medium">{formatCurrency(pkg.amount, pkg.currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Delivery Time:</span>
                          <span className="text-white">{pkg.estimateDeliveryDays} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-yellow-400">{pkg.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Requested:</span>
                          <span className="text-white">{new Date(pkg.requestedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => onApprove(pkg.id)}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Package
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onReject(pkg.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Package
                    </Button>
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

export default ApprovalPackageList;