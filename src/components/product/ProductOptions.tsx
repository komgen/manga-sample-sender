
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ProductOptionsProps {
  colorOptions: string[];
  sizeOptions: string[];
  selectedColor?: string;
  selectedSize?: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
}

export function ProductOptions({
  colorOptions,
  sizeOptions,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange
}: ProductOptionsProps) {
  return (
    <>
      {colorOptions.length > 0 && (
        <div className="mb-3">
          <label className="block text-sm mb-1">カラー</label>
          <Select
            value={selectedColor}
            onValueChange={onColorChange}
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
            onValueChange={onSizeChange}
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
    </>
  );
}
