// src/components/ProductCard.tsx
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
import { parseProductOptions, parseProductImages } from "@/utils/productUtils";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // 色・サイズ・数量の state
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(0);

  const { updateQuantity } = useCart();

  // 文字列から選択肢配列を作るユーティリティ
  const colorOptions = product.color
    ? parseProductOptions(product.color)
    : [];
  const sizeOptions = product.size
    ? parseProductOptions(product.size)
    : [];
  // 画像配列（カルーセル用）
  const images = parseProductImages(product.images || product.image);

  // 数量変更ハンドラ
  const handleQuantityChange = (v: string) => {
    const q = parseInt(v, 10);
    setQuantity(q);
  };

  // 「カートに入れる」または「数量更新」処理
  const handleAddToCart = () => {
    updateQuantity(
      product,          // Productオブジェクト
      undefined,        // variantId は今回は未使用
      quantity,         // 選択数量
      selectedColor,    // 色
      selectedSize      // サイズ
    );
  };

  return (
    <div className="border rounded-md p-4 flex flex-col items-center">
      {/* カルーセル画像 */}
      <ProductImageCarousel images={images} alt={product.name} />

      <h3 className="text-lg font-medium text-center">{product.name}</h3>
      <p className="text-sm text-muted-foreground text-center mb-1">
        {product.description}
      </p>

      {/* カラー選択 */}
      {colorOptions.length > 0 && (
        <div className="w-full mb-2">
          <div className="mb-1">カラー:</div>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* サイズ選択 */}
      {sizeOptions.length > 0 && (
        <div className="w-full mb-2">
          <div className="mb-1">サイズ:</div>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 数量プルダウン (0 を選ぶとカートから削除) */}
      <div className="w-full mb-2">
        <div className="mb-1">数量:</div>
        <Select
          value={quantity.toString()}
          onValueChange={handleQuantityChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="数量を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* カート投入ボタン */}
      <Button
        onClick={handleAddToCart}
        className="mt-2 bg-manga-primary hover:bg-manga-secondary w-full"
        disabled={quantity === 0}
      >
        カートに入れる
      </Button>
    </div>
  );
}
