
import { CartItem } from '@/types/product';
import { CheckoutFormData } from '@/components/CheckoutForm';

// Format data for spreadsheet submission
export const formatForSpreadsheet = (
  formData: CheckoutFormData,
  cartItems: CartItem[]
) => {
  // Format the data as a CSV string (for download purposes)
  const header = 'Author,Email,Title,PostalCode,Address,Phone,Notes,Products\n';
  
  // Format the products list
  const productsString = cartItems.map(item => {
    const productInfo = `${item.product.name}${item.color ? ` (${item.color}` : ''}${item.size ? `/${item.size}` : item.color ? ')' : ''}`;
    const sku = item.variantId 
      ? item.product.variants?.find(v => v.id === item.variantId)?.sku || '' 
      : '';
      
    return `${productInfo} - ${item.quantity}点 [SKU: ${sku}]`;
  }).join('; ');
  
  // Escape any commas in the fields
  const escapedNotes = formData.notes ? `"${formData.notes.replace(/"/g, '""')}"` : '';
  const escapedProducts = `"${productsString.replace(/"/g, '""')}"`;
  
  const dataRow = [
    formData.authorName,
    formData.email,
    formData.mangaTitle,
    formData.postalCode,
    formData.address,
    formData.phoneNumber,
    escapedNotes,
    escapedProducts
  ].join(',');
  
  return header + dataRow;
};

interface GASConfig {
  webhookUrl: string;
}

// Submit data to Google Apps Script webhook
export const submitToSpreadsheet = async (
  formData: CheckoutFormData,
  cartItems: CartItem[]
): Promise<{ success: boolean; message: string; csvData?: string }> => {
  // Create CSV data for download (fallback option)
  const csvData = formatForSpreadsheet(formData, cartItems);
  
  try {
    console.log('Attempting to submit to Google Apps Script...');
    
    // Check if Google Apps Script webhook URL is configured in localStorage
    const configString = localStorage.getItem('googleSheetsConfig');
    if (!configString) {
      console.log('No Google Apps Script configuration found');
      return {
        success: true, // Still return success but with CSV data for download
        message: 'Google Apps Script設定が見つかりません。CSVをダウンロードできます。',
        csvData
      };
    }
    
    const config: GASConfig = JSON.parse(configString);
    if (!config.webhookUrl) {
      console.log('Incomplete Google Apps Script configuration');
      return {
        success: true,
        message: 'Google Apps Script設定が不完全です。CSVをダウンロードできます。',
        csvData
      };
    }
    
    // Format the products for submission
    const productsList = cartItems.map(item => {
      const productInfo = `${item.product.name}${item.color ? ` (${item.color}` : ''}${item.size ? `/${item.size}` : item.color ? ')' : ''}`;
      const sku = item.variantId 
        ? item.product.variants?.find(v => v.id === item.variantId)?.sku || '' 
        : '';
        
      return {
        name: item.product.name,
        variant: `${item.color || ''}${item.color && item.size ? '/' : ''}${item.size || ''}`,
        quantity: item.quantity,
        sku
      };
    });
    
    // Prepare data payload for the webhook
    const payload = {
      timestamp: new Date().toISOString(),
      products: productsList,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      authorName: formData.authorName || '指定された作者',
      email: formData.email || '',
      mangaTitle: formData.mangaTitle || '',
      postalCode: formData.postalCode || '',
      address: formData.address || '',
      phoneNumber: formData.phoneNumber || '',
      notes: formData.notes || ''
    };
    
    // Send data to Google Apps Script webhook
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('Successfully submitted to Google Apps Script');
    return {
      success: true,
      message: 'データがGoogle Sheetsに正常に送信されました',
      csvData // Still include CSV data as a fallback
    };
  } catch (error) {
    console.error('Error submitting to Google Apps Script:', error);
    return {
      success: true, // Still return success since we can fall back to CSV
      message: `Google Sheetsへの送信に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}。CSVをダウンロードできます。`,
      csvData
    };
  }
};

// Helper function to download the CSV
export const downloadCsv = (csvData: string, fileName: string = 'manga-samples.csv') => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Add function to save Google Apps Script configuration
export const saveGoogleSheetsConfig = (config: GASConfig): void => {
  localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
};

// Add function to get Google Apps Script configuration
export const getGoogleSheetsConfig = (): GASConfig | null => {
  const configString = localStorage.getItem('googleSheetsConfig');
  return configString ? JSON.parse(configString) : null;
};
