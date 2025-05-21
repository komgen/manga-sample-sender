
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
import { parseProductOptions, parseColorImages, parseProductImages } from "@/utils/productUtils";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  const { addToCart, updateQuantity } = useCart();

  const colorOptions = product.color ? parseProductOptions(product.color) : [];
  const sizeOptions = product.size ? parseProductOptions(product.size) : [];
  
  // 商品画像配列を取得
  const productImages = product.images 
    ? parseProductImages(product.images) 
    : product.image ? [product.image] : ['/placeholder.svg'];
  
  // デバッグ用ログ：データの確認
  console.log('商品データ:', product.name);
  console.log('商品画像配列:', productImages);

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
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
      <ProductImageCarousel 
        images={productImages}
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
