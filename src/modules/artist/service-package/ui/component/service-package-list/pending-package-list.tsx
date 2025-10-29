"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

import { PendingArtistPackageResponse, Metadata } from '@/gql/graphql';

interface Artist {
  stageName: string;
  userId: string;
  id: string;
}

interface PendingPackageListProps {
  packages: PendingArtistPackageResponse[];
  artists: Artist[];
  onCancel: (packageId: string) => void;
}

const PendingPackageList = ({
  packages,
  artists,
}: PendingPackageListProps) => {
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
    console.log('🎯 Looking for artist:', { artistId, artist, allArtists: artists });
    return artist?.stageName || 'Unknown Artist';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  if (packages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pending service packages found.</p>
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
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  Pending
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpanded(pkg.id)}
                  className="border-gray-600 text-gray-300 hover:text-white"
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
            <CardDescription className="text-gray-400">
              Requested: {new Date(pkg.requestedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          {/* details */}
          <Collapsible open={expandedItems.has(pkg.id)}>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <Separator className="mb-6 bg-gray-700" />
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Artist</h4>
                      <p className="text-gray-400 text-sm bg-gray-700/50 rounded-lg p-4">
                        <span className="text-white font-medium">{getArtistName(pkg.artistId)}</span>
                      </p>
                    </div>

                    {pkg.description && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                        <p className="text-gray-400 text-sm leading-relaxed bg-gray-700/50 rounded-lg p-4">{pkg.description}</p>
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

export default PendingPackageList;