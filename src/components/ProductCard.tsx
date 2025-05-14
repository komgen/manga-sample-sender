
import { useState, useEffect } from "react";
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
  
  // Parse color options from the product
  const colorOptions = product.color 
    ? product.color.split(',').map(color => color.trim()).filter(Boolean)
    : [];
  
  // Parse size options from the product
  const sizeOptions = product.size
    ? product.size.split(',').map(size => size.trim()).filter(Boolean)
    : [];
  
  // Set initial selected values
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colorOptions.length > 0 ? colorOptions[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizeOptions.length > 0 ? sizeOptions[0] : undefined
  );

  // Check if the product is in cart
  const getCurrentQuantity = () => {
    const cartItem = items.find(item => 
      item.productId === product.id && 
      item.color === selectedColor && 
      item.size === selectedSize
    );
    return cartItem ? cartItem.quantity : 0;
  };

  // Add to cart
  const handleAddToCart = () => {
    addToCart(product, undefined, selectedColor, selectedSize);
  };

  // Remove from cart
  const handleRemoveFromCart = () => {
    removeFromCart(product.id, undefined, selectedColor, selectedSize);
  };

  // Update quantity
  const handleUpdateQuantity = (quantity: number) => {
    updateQuantity(product.id, undefined, quantity, selectedColor, selectedSize);
  };

  // Get current quantity in cart
  const currentQuantity = getCurrentQuantity();
  
  // Reset cart item when selected options change
  useEffect(() => {
    // This ensures we're showing the correct quantity when options change
    getCurrentQuantity();
  }, [selectedColor, selectedSize]);

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
        {colorOptions.length > 0 && (
          <div className="mb-3">
            <label className="block text-sm mb-1">カラー</label>
            <Select
              value={selectedColor}
              onValueChange={setSelectedColor}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="カラーを選択" />
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
          <div className="mb-3">
            <label className="block text-sm mb-1">サイズ</label>
            <Select 
              value={selectedSize} 
              onValueChange={setSelectedSize}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="サイズを選択" />
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
              (colorOptions.length > 0 && !selectedColor) || 
              (sizeOptions.length > 0 && !selectedSize)
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
