
import { useState } from "react";
import { Product } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { parseProductOptions, parseColorImages } from "@/utils/productUtils";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { ProductImage } from "@/components/product/ProductImage";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [currentImage, setCurrentImage] = useState<string>(product.image);

  const { addToCart, updateQuantity } = useCart();

  const colorOptions = product.color ? parseProductOptions(product.color) : [];
  const sizeOptions = product.size ? parseProductOptions(product.size) : [];
  const colorImages = product.color_images ? parseColorImages(product.color_images) : {};

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
    
    // 選択したカラーに対応する画像があれば、それに切り替える
    if (colorImages[value]) {
      setCurrentImage(colorImages[value]);
    } else {
      // 対応する画像がなければデフォルトに戻す
      setCurrentImage(product.image);
    }
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
  };

  const handleQuantityUpdate = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      updateQuantity(product, undefined, quantity, selectedColor, selectedSize);
    }
  };

  // 選択が必要かつ未選択の場合にボタンを無効化する条件
  const isColorRequired = colorOptions.length > 0;
  const isSizeRequired = sizeOptions.length > 0;
  const isColorSelected = !isColorRequired || selectedColor;
  const isSizeSelected = !isSizeRequired || selectedSize;
  const isButtonDisabled = quantity <= 0 || !isColorSelected || !isSizeSelected;

  return (
    <div className="border rounded-md p-4 flex flex-col items-center">
      <ProductImage 
        src={currentImage}
        alt={product.name}
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
        <QuantitySelector 
          quantity={quantity} 
          onUpdateQuantity={handleQuantityUpdate} 
          maxQuantity={2}
        />
      </div>

      <Button
        onClick={handleAddToCart}
        className="mt-2 bg-manga-primary hover:bg-manga-secondary w-full"
        disabled={isButtonDisabled}
      >
        カートに入れる
      </Button>
    </div>
  );
}
