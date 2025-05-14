
/**
 * Parse comma-separated options string into an array
 */
export function parseProductOptions(optionsString?: string): string[] {
  if (!optionsString) return [];
  return optionsString.split(',').map(option => option.trim()).filter(Boolean);
}
