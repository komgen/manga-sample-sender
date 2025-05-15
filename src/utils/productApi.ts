
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

// Helper function to handle CORS with Google Apps Script
const fetchWithGAS = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // For Google Apps Script, we need to append ?callback=jsonp to bypass CORS
  // And use a jsonp-like approach for GET requests
  if (options.method === 'GET' || !options.method) {
    const jsonpUrl = url.includes('?') 
      ? `${url}&callback=jsonp&_=${Date.now()}` 
      : `${url}?callback=jsonp&_=${Date.now()}`;
    
    console.log('Fetching with JSONP workaround:', jsonpUrl);
    
    return new Promise((resolve, reject) => {
      // Create a unique callback name
      const callbackName = 'jsonpCallback' + Date.now();
      
      // Create script element
      const script = document.createElement('script');
      
      // Define the callback function
      (window as any)[callbackName] = (data: any) => {
        // Clean up
        delete (window as any)[callbackName];
        document.body.removeChild(script);
        
        // Create a mock Response object
        const mockResponse = {
          ok: true,
          status: 200,
          json: async () => data,
          text: async () => JSON.stringify(data)
        } as Response;
        
        resolve(mockResponse);
      };
      
      // Handle errors
      script.onerror = () => {
        // Clean up
        delete (window as any)[callbackName];
        document.body.removeChild(script);
        reject(new Error('Failed to fetch from Google Apps Script'));
      };
      
      // Set script source - append the callback parameter
      script.src = `${jsonpUrl.replace('jsonp', callbackName)}`;
      
      // Add to document
      document.body.appendChild(script);
    });
  } else {
    // For POST requests, we can't use JSONP, so we'll try a normal fetch
    // Google Apps Script should be configured to accept CORS
    console.log('Using standard fetch for POST request:', url);
    return fetch(url, options);
  }
};

// Function to fetch products from Google Sheets via Google Apps Script
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const config = getGASConfig();
    
    if (!config || !config.fetchUrl) {
      console.log('No products fetch URL configured');
      return []; // Return empty array if no fetch URL is configured
    }
    
    console.log('Fetching products from:', config.fetchUrl);
    
    const response = await fetchWithGAS(config.fetchUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received product data:', data);
    
    if (!data.products || !Array.isArray(data.products)) {
      console.error('Invalid response format, expected products array:', data);
      throw new Error('Invalid response format');
    }
    
    // Transform the raw data into our Product type
    const products: Product[] = data.products.map((item: any, index: number) => {
      // Log each item to debug data structure
      console.log('Processing product item:', item);
      
      // Handle Japanese property names and convert to expected format
      const productName = item.名前 || item.name || `製品 ${index + 1}`;
      const productType = (item.タイプ || item.type || 'other') as ProductType;
      const description = item.説明 || item.description || '';
      const image = item.画像 || item.image || '/placeholder.svg';
      const colors = (item.色 || item.colors) ? String(item.色 || item.colors).split(',').map((c: string) => c.trim()).filter(Boolean) : [];
      const sizes = (item.サイズ || item.sizes) ? String(item.サイズ || item.sizes).split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      const sku = item.sku || '';
      const id = String(item.id || index);

      const variants: Variant[] = [];
      
      // Process colors and sizes into variants
      
      // If both colors and sizes exist, create variants for each combination
      if (colors.length > 0 && sizes.length > 0) {
        colors.forEach((color: string) => {
          sizes.forEach((size: string) => {
            variants.push({
              id: `${id}-${color}-${size}`,
              productId: id,
              color,
              size,
              sku: sku ? `${sku}-${color}-${size}` : `SKU-${index}-${color}-${size}`
            });
          });
        });
      } 
      // If only colors exist
      else if (colors.length > 0) {
        colors.forEach((color: string) => {
          variants.push({
            id: `${id}-${color}`,
            productId: id,
            color,
            sku: sku ? `${sku}-${color}` : `SKU-${index}-${color}`
          });
        });
      }
      // If only sizes exist
      else if (sizes.length > 0) {
        sizes.forEach((size: string) => {
          variants.push({
            id: `${id}-${size}`,
            productId: id,
            size,
            sku: sku ? `${sku}-${size}` : `SKU-${index}-${size}`
          });
        });
      }
      // If neither colors nor sizes exist, create a single variant
      else if (variants.length === 0) {
        variants.push({
          id: `${id}-default`,
          productId: id,
          sku: sku ? `${sku}` : `SKU-${index}`
        });
      }
      
      return {
  id,
  name: productName,
  type: productType,
  description,
  image,
  variants,
  color: item.色 || item.colors || "",
  size: item.サイズ || item.sizes || ""
};
    });
    
    console.log('Processed products:', products);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return empty array in case of error
  }
};
