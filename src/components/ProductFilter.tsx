
import { Button } from "@/components/ui/button";
import { productTypeLabels } from "@/data/products";
import { ProductType } from "@/types/product";

interface ProductFilterProps {
  selectedType: ProductType | 'all';
  onTypeChange: (type: ProductType | 'all') => void;
}

export function ProductFilter({ selectedType, onTypeChange }: ProductFilterProps) {
  const allTypes: (ProductType | 'all')[] = ['all', ...Object.keys(productTypeLabels) as ProductType[]];

  return (
    <div className="space-y-2">
      <h3 className="font-medium">商品カテゴリー</h3>
      <div className="flex flex-wrap gap-2">
        {allTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            className={selectedType === type ? "bg-manga-primary hover:bg-manga-secondary" : ""}
            onClick={() => onTypeChange(type)}
          >
            {type === 'all' ? 'すべて' : productTypeLabels[type]}
          </Button>
        ))}
      </div>
    </div>
  );
}
