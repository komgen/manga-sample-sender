
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
    // スペースが余分に入っている場合に対応するため、前後の空白を削除
    const trimmedJsonString = jsonString.trim();
    
    // カンマの前後にスペースが余分にある可能性を考慮
    // JSON.parseはこのような細かな形式のズレに敏感なため、事前に整形
    console.log('パース前のJSON文字列:', trimmedJsonString);
    
    // JSON文字列をパースして、カラー名 -> 画像URLのマッピングを作成
    const colorImagesMap = JSON.parse(trimmedJsonString);
    console.log('パース後のカラー画像マップ:', colorImagesMap);
    return colorImagesMap;
  } catch (error) {
    console.error('カラー画像マッピングのJSON解析に失敗しました:', error);
    console.error('問題のある文字列:', jsonString);
    return {};
  }
}
