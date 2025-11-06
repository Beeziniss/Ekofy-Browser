"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArtistPackage } from "@/gql/graphql";

const updatePackageSchema = z.object({
  id: z.string().min(1, "Package ID is required"),
  packageName: z.string().min(1, "Package name is required"),
  description: z.string().optional(),
});

type UpdatePackageFormData = z.infer<typeof updatePackageSchema>;

interface UpdatePackageServiceProps {
  package: ArtistPackage;
  onSubmit: (data: UpdatePackageFormData) => void;
  onCancel: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const UpdatePackageService = ({
  package: pkg,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
}: UpdatePackageServiceProps) => {
  const form = useForm<UpdatePackageFormData>({
    resolver: zodResolver(updatePackageSchema),
    defaultValues: {
      id: pkg.id,
      packageName: pkg.packageName,
      description: pkg.description || "",
    },
  });

  const handleSubmit = (data: UpdatePackageFormData) => {
    onSubmit(data);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Card className="border-gradient-input">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Update Artist Service Package</CardTitle>
            <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
              Delete Package
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Hidden ID field */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Package Information Display */}
              <div className="border-gradient-input rounded-md p-4">
                <h3 className="mb-4 text-lg font-medium text-white">Current Package Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Package ID:</span>
                    <span className="ml-2 text-white">{pkg.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 text-white">{pkg.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <span className="ml-2 text-white">
                      {pkg.amount.toLocaleString()} {pkg.currency}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Delivery Days:</span>
                    <span className="ml-2 text-white">{pkg.estimateDeliveryDays}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="ml-2 text-white">{new Date(pkg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Updated:</span>
                    <span className="ml-2 text-white">{new Date(pkg.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {pkg.serviceDetails && pkg.serviceDetails.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-400">Service Details:</span>
                    <div className="mt-2 space-y-1">
                      {pkg.serviceDetails.map((detail, index) => (
                        <div key={index} className="text-sm">
                          <span className="text-gray-300">{detail.key}:</span>
                          <span className="ml-2 text-white">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Editable Fields */}
              <FormField
                control={form.control}
                name="packageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Package Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-gray-600 bg-gray-700 text-white"
                        placeholder="Enter package name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter package description"
                        className="min-h-32 border-gray-600 bg-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="bg-gray-700" />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-gray-600 text-gray-300 hover:text-white"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="hover:primary_gradient bg-white text-black">
                  {isLoading ? "Updating..." : "Update Package"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePackageService;
