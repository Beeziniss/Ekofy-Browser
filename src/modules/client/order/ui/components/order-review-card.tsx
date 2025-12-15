"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Edit2, Trash2, X, Check } from "lucide-react";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { useCreateReview, useUpdateReview, useDeleteReview } from "@/gql/client-mutation-options/review-mutation-options";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Review {
    rating: number;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

interface OrderReviewCardProps {
    orderId: string;
    orderStatus: string;
    review: Review | null | undefined;
    onReviewUpdated: () => void;
}

export function OrderReviewCard({ orderId, orderStatus, review, onReviewUpdated }: OrderReviewCardProps) {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(review?.rating || 0);
    const [content, setContent] = useState(review?.content || "");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const createReviewMutation = useCreateReview({
        onSuccess: () => {
            toast.success("Review submitted successfully!");
            setIsEditing(false);
            onReviewUpdated();
        },
        onError: (error) => {
            toast.error(`Failed to submit review: ${error.message}`);
        },
    });

    const updateReviewMutation = useUpdateReview({
        onSuccess: () => {
            toast.success("Review updated successfully!");
            setIsEditing(false);
            onReviewUpdated();
        },
        onError: (error) => {
            toast.error(`Failed to update review: ${error.message}`);
        },
    });

    const deleteReviewMutation = useDeleteReview({
        onSuccess: () => {
            toast.success("Review deleted successfully!");
            setShowDeleteDialog(false);
            onReviewUpdated();
        },
        onError: (error) => {
            toast.error(`Failed to delete review: ${error.message}`);
        },
    });

    // Check permissions
    const isListener = user?.role === UserRole.LISTENER;
    const isArtist = user?.role === UserRole.ARTIST;
    const isCompleted = orderStatus === "COMPLETED";
    const canCreateReview = isListener && isCompleted && !review;
    const canEditReview = isListener && isCompleted && !!review;
    const canViewOnly = isArtist || !isCompleted;

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        if (!content.trim()) {
            toast.error("Please write a review");
            return;
        }

        if (review) {
            // Update existing review
            updateReviewMutation.mutate({
                packageOrderId: orderId,
                rating,
                comment: content.trim(),
            });
        } else {
            // Create new review
            createReviewMutation.mutate({
                packageOrderId: orderId,
                rating,
                content: content.trim(),
            });
        }
    };

    const handleEdit = () => {
        if (review) {
            setRating(review.rating);
            setContent(review.content);
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (review) {
            setRating(review.rating);
            setContent(review.content);
        } else {
            setRating(0);
            setContent("");
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        deleteReviewMutation.mutate({
            reviewId: orderId,
        });
    };

    const renderStars = (currentRating: number, isInteractive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!isInteractive}
                        onClick={() => isInteractive && setRating(star)}
                        onMouseEnter={() => isInteractive && setHoveredRating(star)}
                        onMouseLeave={() => isInteractive && setHoveredRating(0)}
                        className={`transition-colors ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
                    >
                        <Star
                            className={`h-6 w-6 ${
                                star <= (isInteractive ? hoveredRating || currentRating : currentRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                            }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    // If order is not completed and no review exists
    if (!isCompleted && !review) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Review
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        You can leave a review after the order is completed.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Review
                        </div>
                        {canEditReview && !isEditing && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleEdit}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        )}
                    </CardTitle>
                    {review && !isEditing && (
                        <CardDescription>
                            {review.updatedAt !== review.createdAt
                                ? `Updated at ${format(new Date(review.updatedAt || ""), "dd/MM/yyyy HH:mm")}`
                                : `Reviewed at ${format(new Date(review.createdAt), "dd/MM/yyyy HH:mm")}`}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* View Mode */}
                    {review && !isEditing ? (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Rating</label>
                                {renderStars(review.rating, false)}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Content</label>
                                <p className="text-sm">{review.content}</p>
                            </div>
                        </>
                    ) : null}

                    {/* Create/Edit Mode */}
                    {(canCreateReview || (canEditReview && isEditing)) && (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Rating<span className="text-red-500">*</span>
                                </label>
                                {renderStars(rating, true)}
                            </div>
                            <div>
                                <label htmlFor="review-content" className="mb-2 block text-sm font-medium">
                                    Content<span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    id="review-content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your experience about this service..."
                                    className="min-h-[120px]"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                {isEditing && (
                                    <Button variant="outline" onClick={handleCancel}>
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    onClick={handleSubmit}
                                    disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    {createReviewMutation.isPending || updateReviewMutation.isPending
                                        ? "Processing..."
                                        : review
                                        ? "Update"
                                        : "Submit Review"}
                                </Button>
                            </div>
                        </>
                    )}

                    {/* View only for artist or incomplete order */}
                    {canViewOnly && !review && (
                        <p className="text-muted-foreground text-center text-sm">No review yet</p>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteReviewMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
