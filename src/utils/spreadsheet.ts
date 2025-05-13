
import { CartItem } from '@/types/product';
import { CheckoutFormData } from '@/components/CheckoutForm';
import { fetchWithGAS } from '@/utils/fetchUtils';

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
  fetchUrl?: string;
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
    
    console.log('Sending payload to Google Apps Script:', payload);
    console.log('Webhook URL:', config.webhookUrl);
    
    // Use the fetchWithGAS function from fetchUtils.ts
    const webhookUrl = config.webhookUrl;
    const submitMethod = 'POST';
    
    // For POST requests to Google Apps Script, we need to handle CORS differently
    // Create a form and submit it directly to avoid CORS issues
    const form = document.createElement('form');
    form.method = submitMethod;
    form.action = webhookUrl;
    form.target = '_blank'; // This will open in a new tab, but we'll close it immediately
    
    // Create a hidden iframe to target the form submission
    const iframe = document.createElement('iframe');
    iframe.name = 'submit-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    form.target = 'submit-iframe';
    
    // Add the data as a hidden field
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'payload';
    hiddenField.value = JSON.stringify(payload);
    form.appendChild(hiddenField);
    
    // Add the form to the body and submit it
    document.body.appendChild(form);
    
    // Create a promise that resolves when the iframe loads
    const submissionPromise = new Promise<{ success: boolean; message: string }>((resolve) => {
      iframe.onload = () => {
        try {
          // Attempt to get the response from the iframe
          const iframeContent = iframe.contentDocument || iframe.contentWindow?.document;
          let result: any = { success: true, message: 'データがGoogle Sheetsに正常に送信されました' };
          
          if (iframeContent) {
            // Try to parse any JSON in the response
            try {
              const responseText = iframeContent.body.innerText;
              if (responseText) {
                result = JSON.parse(responseText);
              }
            } catch (e) {
              console.log('Could not parse iframe response, using default success');
            }
          }
          
          // Clean up
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          
          resolve(result);
        } catch (error) {
          // If we can't access the iframe content due to CORS, assume success
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          
          resolve({ 
            success: true, 
            message: 'データがGoogle Sheetsに送信されましたが、応答を確認できませんでした。' 
          });
        }
      };
      
      iframe.onerror = () => {
        // Clean up on error
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        
        resolve({ 
          success: false, 
          message: 'Google Sheetsへの送信中にエラーが発生しました。CSVをダウンロードできます。' 
        });
      };
    });
    
    // Submit the form
    form.submit();
    
    // Wait for the submission to complete
    const result = await submissionPromise;
    
    console.log('Google Apps Script submission result:', result);
    
    return {
      success: result.success,
      message: result.message,
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
