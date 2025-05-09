
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon, ShoppingCart, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "エラー",
        description: "カートにアイテムがありません",
        variant: "destructive"
      });
      return;
    }
    
    onCheckout();
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5 mr-2" />
          カート
          {getCartTotal() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-manga-primary">
              {getCartTotal()}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>選択したサンプル</DrawerTitle>
            <DrawerDescription>
              サンプル送付商品の確認と数量の調整ができます
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {items.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">カートは空です</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      {item.color && item.size && (
                        <p className="text-sm text-muted-foreground">
                          {item.color} / {item.size}
                        </p>
                      )}
                      {item.color && !item.size && (
                        <p className="text-sm text-muted-foreground">{item.color}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(
                          item.productId, 
                          item.variantId, 
                          item.quantity - 1
                        )}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        min={1} 
                        max={2}
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(
                          item.productId, 
                          item.variantId, 
                          parseInt(e.target.value) || 1
                        )}
                        className="h-8 w-12 text-center"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(
                          item.productId, 
                          item.variantId, 
                          item.quantity + 1
                        )}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-medium">
              <span>合計点数:</span>
              <span>{getCartTotal()} 点</span>
            </div>
          </div>
          <DrawerFooter>
            <Button 
              onClick={handleCheckout} 
              disabled={items.length === 0}
              className="bg-manga-primary hover:bg-manga-secondary"
            >
              確認画面へ進む
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
