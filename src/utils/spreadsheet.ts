
import { CartItem } from '@/types/product';
import { CheckoutFormData } from '@/components/CheckoutForm';
import { GoogleSpreadsheet } from 'google-spreadsheet';

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

interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  sheetId: number | string;
}

// Submit data to Google Sheets
export const submitToSpreadsheet = async (
  formData: CheckoutFormData,
  cartItems: CartItem[]
): Promise<{ success: boolean; message: string; csvData?: string }> => {
  // Create CSV data for download (fallback option)
  const csvData = formatForSpreadsheet(formData, cartItems);
  
  try {
    console.log('Attempting to submit to Google Sheets...');
    
    // Check if Google Sheets credentials are configured in localStorage
    const configString = localStorage.getItem('googleSheetsConfig');
    if (!configString) {
      console.log('No Google Sheets configuration found');
      return {
        success: true, // Still return success but with CSV data for download
        message: 'Google Sheets設定が見つかりません。CSVをダウンロードできます。',
        csvData
      };
    }
    
    const config: GoogleSheetsConfig = JSON.parse(configString);
    if (!config.apiKey || !config.spreadsheetId || !config.sheetId) {
      console.log('Incomplete Google Sheets configuration');
      return {
        success: true,
        message: 'Google Sheets設定が不完全です。CSVをダウンロードできます。',
        csvData
      };
    }
    
    // Initialize Google Sheets document with API key
    const doc = new GoogleSpreadsheet(config.spreadsheetId);
    await doc.useApiKey(config.apiKey);
    await doc.loadInfo(); // Load document properties
    
    // Get the specified sheet
    const sheet = typeof config.sheetId === 'number' 
      ? doc.sheetsByIndex[config.sheetId]
      : doc.sheetsById[config.sheetId];
      
    if (!sheet) {
      throw new Error('指定されたシートが見つかりませんでした');
    }
    
    // Format the products for sheet insertion
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
    
    // Add row to the sheet
    await sheet.addRow({
      timestamp: new Date().toISOString(),
      products: JSON.stringify(productsList),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      // The form data fields are included but empty as per requirements
      authorName: formData.authorName || '指定された作者',
      email: formData.email || '',
      mangaTitle: formData.mangaTitle || '',
      notes: formData.notes || ''
    });
    
    console.log('Successfully submitted to Google Sheets');
    return {
      success: true,
      message: 'データがGoogle Sheetsに正常に送信されました',
      csvData // Still include CSV data as a fallback
    };
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
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

// Add function to save Google Sheets configuration
export const saveGoogleSheetsConfig = (config: GoogleSheetsConfig): void => {
  localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
};

// Add function to get Google Sheets configuration
export const getGoogleSheetsConfig = (): GoogleSheetsConfig | null => {
  const configString = localStorage.getItem('googleSheetsConfig');
  return configString ? JSON.parse(configString) : null;
};

