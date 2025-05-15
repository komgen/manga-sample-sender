
import { useState } from "react";
import { Product } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { parseProductOptions } from "@/utils/productUtils";

interface ProductCardProps {
  product: Product;
}

// Exporting as a named export to match the import in Index.tsx
export function ProductCard({ product }: ProductCardProps) {
  console.log('Product debug:', {
    name: product.name,
    color: product.color,
    size: product.size,
    type: product.type,
  });
  
  const [quantity, setQuantity] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  
  const { addToCart, updateQuantity, removeFromCart } = useCart();

  // Parse color and size options from comma-separated strings
  const colorOptions = product.color ? parseProductOptions(product.color) : [];
  const sizeOptions = product.size ? parseProductOptions(product.size) : [];

  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value, 10);
    setQuantity(newQuantity);
    
    if (newQuantity === 0) {
      removeFromCart(product.id);
    } else if (quantity === 0) {
      // Convert newQuantity to string if needed by the addToCart function
      addToCart(product, newQuantity, selectedColor, selectedSize);
    } else {
      // The error is here - we need to ensure we're passing the correct type
      // Convert productId to string if the function expects a string
      updateQuantity(product.id, undefined, newQuantity.toString());
    }
  };

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
    if (quantity > 0) {
      updateQuantity(product.id, undefined, quantity.toString());
    }
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    if (quantity > 0) {
      updateQuantity(product.id, undefined, quantity.toString());
    }
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

      {colorOptions.length > 0 && (
        <div className="w-full mb-2">
          <div className="mb-1">カラー:</div>
          <Select value={selectedColor} onValueChange={handleColorChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {sizeOptions.length > 0 && (
        <div className="w-full mb-2">
          <div className="mb-1">サイズ:</div>
          <Select value={selectedSize} onValueChange={handleSizeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="w-full mb-2">
        <div className="mb-1">数量:</div>
        <Select value={quantity.toString()} onValueChange={handleQuantityChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="数量" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
