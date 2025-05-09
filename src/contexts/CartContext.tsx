
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, Variant } from '@/types/product';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variantId?: string, color?: string, size?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (product: Product, variantId?: string, color?: string, size?: string) => {
    const existingItemIndex = items.findIndex(item => 
      item.productId === product.id && 
      ((!variantId && !item.variantId) || item.variantId === variantId)
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      const item = updatedItems[existingItemIndex];

      if (item.quantity >= 2) {
        toast({
          title: "数量制限",
          description: "各商品は最大2個までしか選択できません",
          variant: "destructive"
        });
        return;
      }

      updatedItems[existingItemIndex] = {
        ...item,
        quantity: item.quantity + 1
      };
      
      setItems(updatedItems);
    } else {
      setItems([
        ...items, 
        { 
          productId: product.id, 
          variantId, 
          quantity: 1, 
          product,
          color,
          size
        }
      ]);
    }

    toast({
      title: "カートに追加しました",
      description: `${product.name} ${color ? `(${color}` : ''}${size ? `/${size})` : color ? ')' : ''} をカートに追加しました`,
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setItems(items.filter(item => 
      !(item.productId === productId && 
        ((!variantId && !item.variantId) || item.variantId === variantId))
    ));
  };

  const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity > 2) {
      toast({
        title: "数量制限",
        description: "各商品は最大2個までしか選択できません",
        variant: "destructive"
      });
      quantity = 2;
    }

    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems(items.map(item => {
      if (
        item.productId === productId && 
        ((!variantId && !item.variantId) || item.variantId === variantId)
      ) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItemCount = () => {
    return items.length;
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
