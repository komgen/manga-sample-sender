import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductCardProps {
  product: Product;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export default function ProductCard({
  product,
  onQuantityChange,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value, 10);
    setQuantity(newQuantity);
    onQuantityChange(product.id, newQuantity);
  };

  return (
    <div className="border rounded-md p-4 flex flex-col items-center">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-auto object-contain mb-2"
      />
      <h3 className="text-lg font-medium text-center">{product.name}</h3>
      <p className="text-sm text-muted-foreground text-center mb-1">
        {product.description}
      </p>

      {(product.color || product.size) && (
        <p className="text-sm text-muted-foreground text-center mb-2">
          {product.color || ""} {product.color && product.size ? " / " : ""}
          {product.size || ""}
        </p>
      )}

      <div className="mb-2">数量:</div>
      <Select value={quantity.toString()} onValueChange={handleQuantityChange}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="数量" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">0</SelectItem>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
