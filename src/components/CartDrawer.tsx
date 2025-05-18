
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { MinusIcon, PlusIcon, ShoppingCart, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { QuantitySelector } from "@/components/product/QuantitySelector";

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
        variant: "destructive",
      });
      return;
    }
    onCheckout();
  };

  const handleUpdateQuantity = (item: any, newQuantity: number) => {
    updateQuantity(
      item.product,
      item.variantId,
      newQuantity,
      item.color,
      item.size
    );
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
              <p className="text-center py-8 text-muted-foreground">
                カートは空です
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${
                      item.variantId || "default"
                    }-${item.color || "none"}-${item.size || "none"}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.product?.name ?? "（商品名不明）"}
                      </h4>
                      {(item.color || item.size) && (
                        <p className="text-sm text-muted-foreground">
                          {[item.color, item.size].filter(Boolean).join(" / ")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <QuantitySelector
                        quantity={item.quantity}
                        onUpdateQuantity={(newQuantity) => handleUpdateQuantity(item, newQuantity)}
                        maxQuantity={2}
                      />
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          removeFromCart(
                            item.productId,
                            item.variantId,
                            item.color,
                            item.size
                          )
                        }
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
