import { Product, ProductType, Variant } from "@/types/product";
import { fetchWithGAS } from "@/utils/fetchUtils";

// Function to get Google Apps Script configuration
interface GASConfig {
  webhookUrl: string;
  fetchUrl?: string;
}
const getGASConfig = (): GASConfig | null => {
  const configString = localStorage.getItem("googleSheetsConfig");
  return configString ? JSON.parse(configString) : null;
};

export const saveGASConfig = (config: GASConfig): void => {
  localStorage.setItem("googleSheetsConfig", JSON.stringify(config));
};

// Helper for CORS
const fetchWithGAS = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // （省略：既存のJSONP／fetchロジック）
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const config = getGASConfig();
    if (!config || !config.fetchUrl) {
      console.log("No products fetch URL configured");
      return [];
    }

    console.log("Fetching products from:", config.fetchUrl);
    const response = await fetchWithGAS(config.fetchUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("Received product data:", data);
    if (!data.products || !Array.isArray(data.products)) {
      console.error("Invalid response format, expected products array:", data);
      throw new Error("Invalid response format");
    }

    const products: Product[] = data.products.map((item: any, index: number) => {
      // 元のフィールド読み取り
      const productName = item.名前 || item.name || `製品 ${index + 1}`;
      const productType = (item.タイプ || item.type || "other") as ProductType;
      const description = item.説明 || item.description || "";
      const image = item.画像 || item.image || "/placeholder.svg";

      // **新規追加：images列のマッピング**
      // スプレッドシートで images 列に登録された JSON 配列またはカンマ区切り文字列をそのまま保持
      const imagesString = item.images || item.画像リスト || item["images"] || "";

      const colors = (item.色 || item.colors)
        ? String(item.色 || item.colors)
            .split(",")
            .map((c: string) => c.trim())
            .filter(Boolean)
        : [];
      const sizes = (item.サイズ || item.sizes)
        ? String(item.サイズ || item.sizes)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];
      const sku = item.sku || "";
      const id = String(item.id || index);

      const variants: Variant[] = [];

      if (colors.length > 0 && sizes.length > 0) {
        colors.forEach((color) => {
          sizes.forEach((size) => {
            variants.push({
              id: `${id}-${color}-${size}`,
              productId: id,
              color,
              size,
              sku: sku ? `${sku}-${color}-${size}` : `SKU-${index}-${color}-${size}`,
            });
          });
        });
      } else if (colors.length > 0) {
        colors.forEach((color) => {
          variants.push({
            id: `${id}-${color}`,
            productId: id,
            color,
            sku: sku ? `${sku}-${color}` : `SKU-${index}-${color}`,
          });
        });
      } else if (sizes.length > 0) {
        sizes.forEach((size) => {
          variants.push({
            id: `${id}-${size}`,
            productId: id,
            size,
            sku: sku ? `${sku}-${size}` : `SKU-${index}-${size}`,
          });
        });
      } else {
        variants.push({
          id: `${id}-default`,
          productId: id,
          sku: sku || `SKU-${index}`,
        });
      }

      return {
        id,
        name: productName,
        type: productType,
        description,
        image,
        images: imagesString,   // ← ここを追加
        variants,
      };
    });

    console.log("Processed products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
