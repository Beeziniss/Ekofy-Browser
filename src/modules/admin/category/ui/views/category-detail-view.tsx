"use client";

import { CategoryLayout } from "../layouts";
import { CategoryDetailSection } from "../sections";

interface CategoryDetailViewProps {
  categoryId: string;
}

export function CategoryDetailView({ categoryId }: CategoryDetailViewProps) {
  return (
    <CategoryLayout>
      <CategoryDetailSection categoryId={categoryId} />
    </CategoryLayout>
  );
}
