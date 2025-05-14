// 該当ファイル：ProductCard.tsx

import { useState } from 'react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onQuantityChange: (productId: string, quantity: number, color?: string, size?: string) => void;
}

export function ProductCard({ product, onQuantityChange }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');

  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    onQuantityChange(product.id, newQty, color, size);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColor = e.target.value;
    setColor(selectedColor);
    onQuantityChange(product.id, quantity, selectedColor, size);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = e.target.value;
    setSize(selectedSize);
    onQuantityChange(product.id, quantity, color, selectedSize);
  };

  const colorOptions = product.color ? product.color.split(',').map(c => c.trim()) : [];
  const sizeOptions = product.size ? product.size.split(',').map(s => s.trim()) : [];

  return (
    <div className="border p-4 rounded-md">
      <img src={product.image} alt={product.name} className="mb-2 w-full object-cover" />
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      {product.description && <p className="text-sm text-muted mb-2">{product.description}</p>}

      {colorOptions.length > 0 && (
        <div className="mb-2">
          <label className="block text-sm font-medium">色:</label>
          <select className="w-full border rounded p-1" value={color} onChange={handleColorChange}>
            <option value="">選択してください</option>
            {colorOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {sizeOptions.length > 0 && (
        <div className="mb-2">
          <label className="block text-sm font-medium">サイズ:</label>
          <select className="w-full border rounded p-1" value={size} onChange={handleSizeChange}>
            <option value="">選択してください</option>
            {sizeOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <label className="text-sm font-medium">数量: </label>
        <select className="border rounded p-1" value={quantity} onChange={(e) => handleQuantityChange(Number(e.target.value))}>
          {[0, 1, 2].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
