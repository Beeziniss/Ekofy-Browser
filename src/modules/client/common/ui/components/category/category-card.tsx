import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
  };
  className?: string;
}

const CategoryCard = React.memo(({ category, className }: CategoryCardProps) => {
  return (
    <Card
      className={cn(
        "group hover:border-main-purple/70 relative cursor-pointer overflow-hidden rounded-lg border transition-colors hover:shadow-lg",
        className,
      )}
    >
      <CardContent className="flex items-center justify-center p-6">
        <div className="space-y-3 text-center">
          {/* Category icon placeholder - you can customize this */}
          {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-lg font-semibold text-white transition-transform group-hover:scale-110">
            {category.name.charAt(0).toUpperCase()}
          </div> */}

          {/* Category name */}
          <h3 className="group-hover:text-main-purple line-clamp-2 text-center text-xl font-medium">{category.name}</h3>
        </div>
      </CardContent>
    </Card>
  );
});

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
