
export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description: string;
  image: string;
  price?: number; // Not required for sample selection but good for reference
  variants?: Variant[];
}

export interface Variant {
  id: string;
  productId: string;
  color?: string;
  size?: string;
  sku: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  color?: string;
  size?: string;
}

export type ProductType = 
  | "tshirt" 
  | "hoodie" 
  | "cap" 
  | "poster" 
  | "keychain" 
  | "mug" 
  | "sticker" 
  | "other";
