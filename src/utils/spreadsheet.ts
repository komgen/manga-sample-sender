
import { CartItem } from '@/types/product';
import { CheckoutFormData } from '@/components/CheckoutForm';

// In a real implementation, this would connect to Google Sheets API
// For now, we'll just format the data and simulate the submission

export const formatForSpreadsheet = (
  formData: CheckoutFormData,
  cartItems: CartItem[]
) => {
  // Format the data as a CSV string
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

export const submitToSpreadsheet = async (
  formData: CheckoutFormData,
  cartItems: CartItem[]
): Promise<{ success: boolean; message: string; csvData?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const csvData = formatForSpreadsheet(formData, cartItems);
    
    // In a real implementation, this would call an API to send data to Google Sheets
    // For now, we'll just return the formatted data
    console.log('Submitting to spreadsheet:', csvData);
    
    return {
      success: true,
      message: 'データが正常に送信されました',
      csvData
    };
  } catch (error) {
    console.error('Error submitting to spreadsheet:', error);
    return {
      success: false,
      message: 'データの送信中にエラーが発生しました'
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
