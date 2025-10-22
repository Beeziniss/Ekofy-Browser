"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { ArtistPackage, ArtistPackageStatus, Metadata } from '@/gql/graphql';

interface ServicePackageDetailProps {
  package: ArtistPackage;
  onBack: () => void;
}

const ServicePackageDetail: React.FC<ServicePackageDetailProps> = ({
  package: pkg,
  onBack,
}) => {
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Service Packages
        </Button>
      </div>

      <Card className=" border-gradient-input">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-white text-2xl">{pkg.packageName}</CardTitle>
              <div className="flex items-center space-x-4">
                <CardDescription className="text-green-400 text-lg font-semibold">
                  {formatCurrency(pkg.amount, pkg.currency)}
                </CardDescription>
                <Badge className={getStatusColor(pkg.status)}>
                  {pkg.status}
                </Badge>
              </div>
              <CardDescription className="text-gray-400">
                Delivery time: {pkg.estimateDeliveryDays} days
              </CardDescription>
              <CardDescription className="text-gray-400">
                Create At: {new Date(pkg.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Separator className="bg-gray-700" />
          
          {pkg.description && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{pkg.description}</p>
            </div>
          )}

          {pkg.serviceDetails && pkg.serviceDetails.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Service Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.serviceDetails.map((detail: Metadata, index: number) => (
                  <Card key={index} className="border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-white font-medium">{detail.key}: </span>
                        <span className="text-white">{detail.value}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicePackageDetail;