
/**
 * Parse comma-separated options string into an array
 */
export function parseProductOptions(optionsString?: string): string[] {
  if (!optionsString) return [];
  return optionsString.split(',').map(option => option.trim()).filter(Boolean);
}

/**
 * Parse JSON color to image mapping
 */
export function parseColorImages(jsonString?: string): Record<string, string> {
  if (!jsonString) return {};
  
  try {
    // 値がundefinedオブジェクトの場合は空オブジェクトを返す
    if (typeof jsonString === 'object') {
      console.error('color_imagesが文字列ではありません:', jsonString);
      return {};
    }
    
    // スペースが余分に入っている場合に対応するため、前後の空白を削除
    const trimmedJsonString = jsonString.trim();
    
    console.log('パース前のJSON文字列:', trimmedJsonString);
    
    // JSON文字列をパースして、カラー名 -> 画像URLのマッピングを作成
    const colorImagesMap = JSON.parse(trimmedJsonString);
    console.log('パース後のカラー画像マップ:', colorImagesMap);
    return colorImagesMap;
  } catch (error) {
    console.error('カラー画像マッピングのJSON解析に失敗しました:', error);
    console.error('問題のある文字列:', jsonString);
    
    // JSONパースに失敗した場合、手動でシンプルなJSON解析を試みる
    try {
      // 中カッコを削除し、エントリーを分割
      const content = jsonString.replace(/[{}]/g, '').trim();
      const entries = content.split(',');
      
      const result: Record<string, string> = {};
      
      entries.forEach(entry => {
        // キーと値に分割（最初のコロンで分割）
        const colonIndex = entry.indexOf(':');
        if (colonIndex !== -1) {
          let key = entry.substring(0, colonIndex).trim();
          let value = entry.substring(colonIndex + 1).trim();
          
          // 引用符を削除
          key = key.replace(/^["']|["']$/g, '');
          value = value.replace(/^["']|["']$/g, '');
          
          result[key] = value;
        }
      });
      
      console.log('手動解析したカラー画像マップ:', result);
      return result;
    } catch (fallbackError) {
      console.error('手動解析にも失敗しました:', fallbackError);
      return {};
    }
  }
}
