
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { MinusCircle, PlusCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.variants && product.variants.length > 0 && product.variants[0].color
      ? product.variants[0].color
      : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.variants && product.variants.length > 0 && product.variants[0].size
      ? product.variants[0].size
      : undefined
  );

  const availableColors = product.variants
    ? Array.from(new Set(product.variants.map(v => v.color).filter(Boolean)))
    : [];

  const availableSizes = product.variants
    ? Array.from(
        new Set(
          product.variants
            .filter(v => !selectedColor || v.color === selectedColor)
            .map(v => v.size)
            .filter(Boolean)
        )
      )
    : [];

  const getSelectedVariant = () => {
    if (!product.variants || product.variants.length === 0) {
      return null;
    }

    return product.variants.find(
      v => 
        (!selectedColor || v.color === selectedColor) && 
        (!selectedSize || v.size === selectedSize)
    );
  };

  const getCurrentQuantity = () => {
    const variant = getSelectedVariant();
    const cartItem = items.find(item => 
      item.productId === product.id && 
      ((!variant?.id && !item.variantId) || item.variantId === variant?.id)
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = () => {
    const variant = getSelectedVariant();
    addToCart(product, variant?.id, selectedColor, selectedSize);
  };

  const handleRemoveFromCart = () => {
    const variant = getSelectedVariant();
    removeFromCart(product.id, variant?.id);
  };

  const handleUpdateQuantity = (quantity: number) => {
    const variant = getSelectedVariant();
    updateQuantity(product.id, variant?.id, quantity);
  };

  const currentQuantity = getCurrentQuantity();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="aspect-square w-full bg-muted rounded-md overflow-hidden mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {availableColors.length > 0 && (
          <div className="mb-3">
            <label className="block text-sm mb-1">カラー</label>
            <Select
              value={selectedColor}
              onValueChange={(value) => {
                setSelectedColor(value);
                // Reset size if the current size is not available for the new color
                const sizesForColor = Array.from(
                  new Set(
                    product.variants
                      ?.filter(v => v.color === value)
                      .map(v => v.size)
                      .filter(Boolean) || []
                  )
                );
                if (selectedSize && !sizesForColor.includes(selectedSize)) {
                  setSelectedSize(sizesForColor[0]);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="カラーを選択" />
              </SelectTrigger>
              <SelectContent>
                {availableColors.map((color) => (
                  <SelectItem key={color} value={color || ''}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableSizes.length > 0 && (
          <div className="mb-3">
            <label className="block text-sm mb-1">サイズ</label>
            <Select 
              value={selectedSize} 
              onValueChange={(value) => setSelectedSize(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="サイズを選択" />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map((size) => (
                  <SelectItem key={size} value={size || ''}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm mb-1">数量: {currentQuantity}</label>
          <div className="flex items-center space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => handleUpdateQuantity(Math.max(0, currentQuantity - 1))}
              disabled={currentQuantity === 0}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            
            <div className="flex-grow text-center">
              {currentQuantity}
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => handleUpdateQuantity(Math.min(2, currentQuantity + 1))}
              disabled={currentQuantity >= 2}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {currentQuantity === 0 ? (
          <Button 
            className="w-full bg-manga-primary hover:bg-manga-secondary" 
            onClick={handleAddToCart}
            disabled={
              (availableColors.length > 0 && !selectedColor) || 
              (availableSizes.length > 0 && !selectedSize)
            }
          >
            サンプル追加
          </Button>
        ) : (
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleRemoveFromCart}
          >
            カートから削除
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
