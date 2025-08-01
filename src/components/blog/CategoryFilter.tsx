import { Button } from "@/components/ui/button";

interface Category {
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (slug: string | null) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onCategorySelect(null)}
          className="rounded-full"
        >
          All Posts
        </Button>
        {categories.map((category) => (
          <Button
            key={category.slug}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            onClick={() => onCategorySelect(category.slug)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};