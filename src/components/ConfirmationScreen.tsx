
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { GoogleSheetsConfig } from "@/components/GoogleSheetsConfig";

interface ConfirmationScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function ConfirmationScreen({ onBack, onSubmit }: ConfirmationScreenProps) {
  const { items, getCartTotal } = useCart();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">サンプル確認</h2>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">選択したアイテム ({getCartTotal()}点)</h3>
        <div className="bg-muted p-4 rounded-md">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex justify-between mb-2">
              <div>
                <p className="font-medium">{item.product.name}</p>
                {(item.color || item.size) && (
                  <p className="text-sm text-muted-foreground">
                    {item.color ? item.color : ''}
                    {item.color && item.size ? ' / ' : ''}
                    {item.size ? item.size : ''}
                  </p>
                )}
              </div>
              <p>{item.quantity}点</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" onClick={onBack}>
            戻る
          </Button>
          <GoogleSheetsConfig />
        </div>
        <Button onClick={onSubmit} className="bg-manga-primary hover:bg-manga-secondary">
          送信する
        </Button>
      </div>
    </div>
  );
}
