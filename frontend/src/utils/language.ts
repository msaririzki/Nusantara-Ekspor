export function getLanguageCodeFromCountry(country: string): string {
  const map: Record<string, string> = {
    'Indonesia': 'id',
    'United States': 'en',
    'United Kingdom': 'en',
    'Australia': 'en',
    'Singapore': 'en',
    'China': 'zh',
    'Japan': 'ja',
    'South Korea': 'ko',
    'Germany': 'de',
    'France': 'fr',
    'Saudi Arabia': 'ar',
  };
  return map[country] || 'en';
}
