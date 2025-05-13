
// Helper function to handle CORS with Google Apps Script
export const fetchWithGAS = async (url: string, options: RequestInit = {}): Promise<Response> => {
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
