
import { Product, ProductType } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "キャラクターTシャツ",
    type: "tshirt",
    description: "人気キャラクターをフィーチャーしたTシャツ",
    image: "/placeholder.svg",
    variants: [
      { id: "1-1", productId: "1", color: "白", size: "S", sku: "TS-WH-S" },
      { id: "1-2", productId: "1", color: "白", size: "M", sku: "TS-WH-M" },
      { id: "1-3", productId: "1", color: "白", size: "L", sku: "TS-WH-L" },
      { id: "1-4", productId: "1", color: "黒", size: "S", sku: "TS-BL-S" },
      { id: "1-5", productId: "1", color: "黒", size: "M", sku: "TS-BL-M" },
      { id: "1-6", productId: "1", color: "黒", size: "L", sku: "TS-BL-L" },
    ]
  },
  {
    id: "2",
    name: "ロゴパーカー",
    type: "hoodie",
    description: "作品ロゴをデザインしたパーカー",
    image: "/placeholder.svg",
    variants: [
      { id: "2-1", productId: "2", color: "グレー", size: "M", sku: "HD-GY-M" },
      { id: "2-2", productId: "2", color: "グレー", size: "L", sku: "HD-GY-L" },
      { id: "2-3", productId: "2", color: "黒", size: "M", sku: "HD-BL-M" },
      { id: "2-4", productId: "2", color: "黒", size: "L", sku: "HD-BL-L" },
    ]
  },
  {
    id: "3",
    name: "キャラクターキャップ",
    type: "cap",
    description: "キャラクターをあしらったキャップ",
    image: "/placeholder.svg",
    variants: [
      { id: "3-1", productId: "3", color: "紺", sku: "CP-NV" },
      { id: "3-2", productId: "3", color: "黒", sku: "CP-BL" },
    ]
  },
  {
    id: "4",
    name: "アートポスター",
    type: "poster",
    description: "オリジナルイラストのポスター",
    image: "/placeholder.svg",
    variants: [
      { id: "4-1", productId: "4", sku: "PS-A3" },
    ]
  },
  {
    id: "5",
    name: "キャラクターキーホルダー",
    type: "keychain",
    description: "かわいいキャラクターのキーホルダー",
    image: "/placeholder.svg",
    variants: [
      { id: "5-1", productId: "5", sku: "KC-01" },
    ]
  },
  {
    id: "6",
    name: "ロゴマグカップ",
    type: "mug",
    description: "作品ロゴが入ったマグカップ",
    image: "/placeholder.svg",
    variants: [
      { id: "6-1", productId: "6", sku: "MG-01" },
    ]
  },
  {
    id: "7",
    name: "キャラクターステッカー",
    type: "sticker",
    description: "キャラクターデザインのステッカーセット",
    image: "/placeholder.svg",
    variants: [
      { id: "7-1", productId: "7", sku: "ST-01" },
    ]
  },
];

export const productTypeLabels: Record<ProductType, string> = {
  tshirt: "Tシャツ",
  hoodie: "パーカー",
  cap: "キャップ",
  poster: "ポスター",
  keychain: "キーホルダー",
  mug: "マグカップ",
  sticker: "ステッカー",
  other: "その他",
};
