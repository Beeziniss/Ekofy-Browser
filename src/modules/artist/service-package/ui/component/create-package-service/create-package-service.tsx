"use client";

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const serviceDetailSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

const createPackageSchema = z.object({
  packageName: z.string().min(1, 'Package name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  estimateDeliveryDays: z.number().min(1, 'Delivery days must be at least 1'),
  description: z.string().min(1, 'Description is required'),
  serviceDetails: z.array(serviceDetailSchema).min(1, 'At least one service detail is required'),
});

type CreatePackageFormData = z.infer<typeof createPackageSchema>;

interface CreatePackageServiceProps {
  onSubmit: (data: CreatePackageFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CreatePackageService: React.FC<CreatePackageServiceProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      packageName: '',
      amount: 0,
      estimateDeliveryDays: 1,
      description: '',
      serviceDetails: [{ key: '', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'serviceDetails',
  });

  const handleSubmit = (data: CreatePackageFormData) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className=" border-gradient-input">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Artist Service Package - Create</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="packageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Like 'Vocal creator'..."
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          placeholder="Default currency is VND"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimateDeliveryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          placeholder="Estimated time to complete package (hours)"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceDetails"
                render={() => (
                  <FormItem>
                    <FormLabel>Services detail *</FormLabel>
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end space-x-2">
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`serviceDetails.${index}.key`}
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Service key"
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </FormControl>
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`serviceDetails.${index}.value`}
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Description"
                                    className="bg-gray-700 border-gray-600 text-white"
                                  />
                                </FormControl>
                              )}
                            />
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                              className="border-red-600 text-red-400 hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ key: '', value: '' })}
                        className="border-gray-600 text-gray-300 hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service Detail
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter package description..."
                        className="bg-gray-700 border-gray-600 text-white min-h-32"
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
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePackageService;