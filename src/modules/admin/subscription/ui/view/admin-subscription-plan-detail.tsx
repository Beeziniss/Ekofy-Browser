"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2, Image as ImageIcon, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { subscriptionPlanDetailQueryOptions } from "@/gql/options/subscription-options";
import { formatNumber } from "@/utils/format-number";

interface SubscriptionPlanDetailViewProps {
  subscriptionId: string;
  planId: string;
}

export default function SubscriptionPlanDetailView({
  subscriptionId,
  planId,
}: SubscriptionPlanDetailViewProps) {
  const { data, isLoading, error } = useQuery(
    subscriptionPlanDetailQueryOptions(planId)
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.subscriptionPlans?.items?.[0]) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Subscription Plan Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The subscription plan you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href={`/admin/subscription/${subscriptionId}`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subscription
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const plan = data.subscriptionPlans.items[0];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/admin/subscription/${subscriptionId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {plan.stripeProductName}
            </h1>
            <p className="text-gray-600">Subscription Plan Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Product Name</label>
                  <p className="text-sm text-gray-900">{plan.stripeProductName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Product ID</label>
                  <p className="text-sm text-gray-900 font-mono">{plan.stripeProductId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Product Type</label>
                  <p className="text-sm text-gray-900">{plan.stripeProductType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge variant={plan.stripeProductActive ? "default" : "secondary"}>
                    {plan.stripeProductActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Information */}
          {plan.subscription?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.subscription.map((subscription) => (
                    <div key={subscription.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name</label>
                          <p className="text-sm text-gray-900">{subscription.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Code</label>
                          <p className="text-sm text-gray-900 font-mono">{subscription.code}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tier</label>
                          <Badge variant="outline">{subscription.tier}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <Badge variant={subscription.status === "ACTIVE" ? "default" : "secondary"}>
                            {subscription.status}
                          </Badge>
                        </div>
                      </div>
                      {subscription.description && (
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-500">Description</label>
                          <p className="text-sm text-gray-900">{subscription.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.subscriptionPlanPrices.map((price, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Price</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatNumber(price.stripePriceUnitAmount / 100)} {price.stripePriceCurrency}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Interval</label>
                        <p className="text-sm text-gray-900">
                          Every {price.intervalCount} {price.interval.toLowerCase()}(s)
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Lookup Key</label>
                        <p className="text-sm text-gray-900 font-mono">{price.stripePriceLookupKey}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Price ID</label>
                        <p className="text-sm text-gray-900 font-mono">{price.stripePriceId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <Badge variant={price.stripePriceActive ? "default" : "secondary"}>
                          {price.stripePriceActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          {plan.stripeProductImages && plan.stripeProductImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.stripeProductImages.map((imageUrl, index) => (
                    <div key={index} className="space-y-2">
                      <div className="relative w-full h-32 rounded-lg border overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={() => {
                            console.error(`Failed to load image: ${imageUrl}`);
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 break-all">{imageUrl}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {plan.stripeProductMetadata && plan.stripeProductMetadata.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.stripeProductMetadata.map((meta, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{meta.key}</span>
                      </div>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {meta.value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Prices</span>
                <span className="text-sm font-medium">{plan.subscriptionPlanPrices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Prices</span>
                <span className="text-sm font-medium">
                  {plan.subscriptionPlanPrices.filter(p => p.stripePriceActive).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Images</span>
                <span className="text-sm font-medium">
                  {plan.stripeProductImages?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Metadata Fields</span>
                <span className="text-sm font-medium">
                  {plan.stripeProductMetadata?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}