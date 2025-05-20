
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
    // JSON文字列をパースして、カラー名 -> 画像URLのマッピングを作成
    const colorImagesMap = JSON.parse(jsonString);
    return colorImagesMap;
  } catch (error) {
    console.error('カラー画像マッピングのJSON解析に失敗しました:', error);
    return {};
  }
}
