import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSubscriptionMutation } from "@/gql/client-mutation-options/subscription-mutation-options";
import { SubscriptionStatus, SubscriptionTier } from "@/gql/graphql";
import type { CreateSubscriptionInput } from "@/types";
import { useState } from "react";

// Helper function to format number with dots
const formatCurrency = (value: string): string => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, '');
  
  // Add dots every 3 digits from right to left
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Helper function to parse formatted currency to number
const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/\./g, '')) || 0;
};

const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  code: z.string()
    .min(1, "Code is required")
    .max(50, "Code must be less than 50 characters")
    .regex(/^[a-z][a-z0-9_]*$/, "Code must be lowercase, start with a letter, and contain only letters, numbers, and underscores"),
  version: z.number().min(1, "Version must be at least 1"),
  tier: z.nativeEnum(SubscriptionTier),
  price: z.number().min(0, "Price must be at least 0"),
  status: z.nativeEnum(SubscriptionStatus),
});

type CreateSubscriptionFormData = z.infer<typeof createSubscriptionSchema>;

interface CreateSubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateSubscriptionForm({
  open,
  onOpenChange,
  onSuccess,
}: CreateSubscriptionFormProps) {
  const createSubscriptionMutation = useCreateSubscriptionMutation();
  const [formattedPrice, setFormattedPrice] = useState('0');

  const form = useForm<CreateSubscriptionFormData>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
      version: 1,
      tier: SubscriptionTier.Free,
      price: 0,
      status: SubscriptionStatus.Active,
    },
  });

  const onSubmit = async (data: CreateSubscriptionFormData) => {
    try {
      await createSubscriptionMutation.mutateAsync(data as CreateSubscriptionInput);
      form.reset();
      setFormattedPrice('0'); // Reset formatted price as well
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  const isLoading = createSubscriptionMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Subscription</DialogTitle>
          <DialogDescription>
            Create a new subscription plan for your platform.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Premium Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="premium_plan" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the subscription
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the subscription benefits..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SubscriptionTier.Free}>Free</SelectItem>
                        <SelectItem value={SubscriptionTier.Premium}>Premium</SelectItem>
                        <SelectItem value={SubscriptionTier.Pro}>Pro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SubscriptionStatus.Active}>Active</SelectItem>
                        <SelectItem value={SubscriptionStatus.Inactive}>Inactive</SelectItem>
                        <SelectItem value={SubscriptionStatus.Deprecated}>Deprecated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (VND)</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      value={formattedPrice}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        setFormattedPrice(formatted);
                        
                        // Update the form field with the numeric value
                        const numericValue = parseCurrency(formatted);
                        field.onChange(numericValue);
                      }}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the subscription price (e.g., 100.000 for 100,000 VND)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                  setFormattedPrice('0');
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Subscription"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}