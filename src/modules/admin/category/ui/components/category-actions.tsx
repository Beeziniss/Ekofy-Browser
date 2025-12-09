"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoryActionsProps {
  onCreateCategory: () => void;
}

export function CategoryActions({ onCreateCategory }: CategoryActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <p className="text-muted-foreground">
          Manage music categories, genres, and moods
        </p>
      </div>
      <Button onClick={onCreateCategory}>
        <Plus className="mr-2 h-4 w-4" />
        Create Category
      </Button>
    </div>
  );
}
