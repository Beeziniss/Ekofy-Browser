"use client";

import React, { useEffect, useState } from 'react';
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
  key: z.string()
    .regex(/^\d+$/, "Key must be numeric"),
  value: z.string()
    .min(1, 'Value is required')
    .regex(/^[A-Za-z\s]+$/, 'Value must only contain letters and spaces'), // Only letters and spaces allowed
});

const createPackageSchema = z.object({
  packageName: z.string()
    .min(1, 'Package name is required')
    .max(100, 'Package name must be at most 100 characters'),
  amount: z.number()
    .min(0, 'Amount must be positive')
    .max(1000000000, 'Amount is too large'),
  estimateDeliveryDays: z.number()
    .min(1, 'Delivery days must be at least 1')
    .max(365, 'Delivery days is too large'),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  serviceDetails: z.array(serviceDetailSchema).min(1, 'At least one service detail is required'),
});

type CreatePackageFormData = z.infer<typeof createPackageSchema>;

interface CreatePackageServiceProps {
  onSubmit: (data: CreatePackageFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CreatePackageService = ({
  onSubmit,
  onCancel,
  isLoading = false,
}: CreatePackageServiceProps) => {
  const [keyCounter, setKeyCounter] = useState(1); // State to track the key counter

  const form = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      packageName: '',
      amount: 0,
      estimateDeliveryDays: 1,
      description: '',
      serviceDetails: [{ key: '1', value: '' }], // Initialize with a default key
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'serviceDetails',
  });

  useEffect(() => {
    const list = form.getValues("serviceDetails");
    setKeyCounter(list.length + 1);
  }, [form]);

  const handleRemoveServiceDetail = (index: number) => {
    remove(index);
    // Reindex sau khi xóa
    const updated = form.getValues("serviceDetails").map((item, i) => ({
      ...item,
      key: (i + 1).toString(),
    }));
    form.setValue("serviceDetails", updated, { shouldValidate: true });

    setKeyCounter(updated.length + 1);
  };

  const handleAddServiceDetail = () => {
    append({ key: keyCounter.toString(), value: '' }); // Use the current keyCounter as the key
    setKeyCounter((prev) => prev + 1); // Increment the keyCounter
  };

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
                    <FormLabel>Package name <span className="text-red-500">*</span></FormLabel>
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
                      <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
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
                      <FormLabel>Delivery time <span className="text-red-500">*</span></FormLabel>
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
                    <FormLabel>Services detail <span className="text-red-500">*</span></FormLabel>
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
                                    disabled // Disable editing of the key
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
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                    field.onChange(value);
                                    }
                                  }}
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
                              onClick={() => handleRemoveServiceDetail(index)}
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
                        onClick={handleAddServiceDetail}
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
                    <FormLabel>Description<span className="text-red-500">*</span></FormLabel>
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