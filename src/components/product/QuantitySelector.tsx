
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  maxQuantity?: number;
}

export function QuantitySelector({
  quantity,
  onUpdateQuantity,
  maxQuantity = 2
}: QuantitySelectorProps) {
  return (
    <div className="mt-4">
      <label className="block text-sm mb-1">数量: {quantity}</label>
      <div className="flex items-center space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => onUpdateQuantity(Math.max(0, quantity - 1))}
          disabled={quantity === 0}
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
        
        <div className="flex-grow text-center">
          {quantity}
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => onUpdateQuantity(Math.min(maxQuantity, quantity + 1))}
          disabled={quantity >= maxQuantity}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
