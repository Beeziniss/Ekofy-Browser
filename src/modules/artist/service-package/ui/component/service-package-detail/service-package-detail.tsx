"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, RotateCcw } from "lucide-react";
import { ArtistPackage, Metadata } from "@/gql/graphql";
import { usePackageUtils } from "../../../hooks";

interface ServicePackageDetailProps {
  package: Omit<ArtistPackage, "artist" | "review">;
  onBack: () => void;
}

const ServicePackageDetail: React.FC<ServicePackageDetailProps> = ({ package: pkg, onBack }) => {
  const { formatCurrency, formatRevisionText, getStatusColor, getStatusText } = usePackageUtils();

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Service Packages
        </Button>
      </div>

      <Card className="border-gradient-input">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-white">{pkg.packageName}</CardTitle>
              <div className="flex items-center space-x-4">
                <CardDescription className="text-lg font-semibold text-green-400">
                  {formatCurrency(pkg.amount, pkg.currency)}
                </CardDescription>
                <Badge className={getStatusColor(pkg.status)}>{getStatusText(pkg.status)}</Badge>
              </div>
              <div className="flex items-center space-x-6 text-gray-400">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Delivery: {pkg.estimateDeliveryDays} days
                </CardDescription>
                <CardDescription className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  {formatRevisionText(pkg.maxRevision || 0)}
                </CardDescription>
              </div>
              <CardDescription className="text-gray-400">
                Created: {new Date(pkg.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator className="bg-gray-700" />

          {pkg.description && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">Description</h3>
              <p className="leading-relaxed text-gray-300">{pkg.description}</p>
            </div>
          )}

          {pkg.serviceDetails && pkg.serviceDetails.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">Service Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pkg.serviceDetails.map((detail: Metadata, index: number) => (
                  <Card key={index} className="border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-white">{detail.key}: </span>
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
