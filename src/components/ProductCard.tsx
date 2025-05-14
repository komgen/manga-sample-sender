
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
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { parseProductOptions } from "@/utils/productUtils";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductOptions } from "@/components/product/ProductOptions";
import { QuantitySelector } from "@/components/product/QuantitySelector";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  
  // Parse options
  const colorOptions = parseProductOptions(product.color);
  const sizeOptions = parseProductOptions(product.size);
  
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
    addToCart(product, selectedColor, selectedSize);
  };

  // Remove from cart
  const handleRemoveFromCart = () => {
    removeFromCart(product.id, selectedColor, selectedSize);
  };

  // Update quantity
  const handleUpdateQuantity = (quantity: number) => {
    updateQuantity(product.id, quantity, selectedColor, selectedSize);
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
        <ProductImage src={product.image} alt={product.name} />
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ProductOptions
          colorOptions={colorOptions}
          sizeOptions={sizeOptions}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
        />

        <QuantitySelector
          quantity={currentQuantity}
          onUpdateQuantity={handleUpdateQuantity}
        />
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
