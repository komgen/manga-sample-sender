
import { Product, ProductType, Variant } from '@/types/product';

interface GASConfig {
  webhookUrl: string;
  fetchUrl?: string;
}

// Function to get Google Apps Script configuration
const getGASConfig = (): GASConfig | null => {
  const configString = localStorage.getItem('googleSheetsConfig');
  return configString ? JSON.parse(configString) : null;
};

// Function to save Google Apps Script configuration
export const saveGASConfig = (config: GASConfig): void => {
  localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
};

// Function to fetch products from Google Sheets via Google Apps Script
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const config = getGASConfig();
    
    if (!config || !config.fetchUrl) {
      console.log('No products fetch URL configured');
      return []; // Return empty array if no fetch URL is configured
    }
    
    const response = await fetch(config.fetchUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid response format');
    }
    
    // Transform the raw data into our Product type
    const products: Product[] = data.products.map((item: any, index: number) => {
      const variants: Variant[] = [];
      
      // Process colors and sizes into variants
      const colors = item.colors ? String(item.colors).split(',').map((c: string) => c.trim()).filter(Boolean) : [];
      const sizes = item.sizes ? String(item.sizes).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      
      // If both colors and sizes exist, create variants for each combination
      if (colors.length > 0 && sizes.length > 0) {
        colors.forEach((color: string) => {
          sizes.forEach((size: string) => {
            variants.push({
              id: `${item.id || index}-${color}-${size}`,
              productId: String(item.id || index),
              color,
              size,
              sku: item.sku ? `${item.sku}-${color}-${size}` : `SKU-${index}-${color}-${size}`
            });
          });
        });
      } 
      // If only colors exist
      else if (colors.length > 0) {
        colors.forEach((color: string) => {
          variants.push({
            id: `${item.id || index}-${color}`,
            productId: String(item.id || index),
            color,
            sku: item.sku ? `${item.sku}-${color}` : `SKU-${index}-${color}`
          });
        });
      }
      // If only sizes exist
      else if (sizes.length > 0) {
        sizes.forEach((size: string) => {
          variants.push({
            id: `${item.id || index}-${size}`,
            productId: String(item.id || index),
            size,
            sku: item.sku ? `${item.sku}-${size}` : `SKU-${index}-${size}`
          });
        });
      }
      // If neither colors nor sizes exist, create a single variant
      else if (variants.length === 0) {
        variants.push({
          id: `${item.id || index}-default`,
          productId: String(item.id || index),
          sku: item.sku || `SKU-${index}`
        });
      }
      
      return {
        id: String(item.id || index),
        name: item.name || `製品 ${index + 1}`,
        type: (item.type as ProductType) || 'other',
        description: item.description || '',
        image: item.image || '/placeholder.svg',
        variants
      };
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return empty array in case of error
  }
};
