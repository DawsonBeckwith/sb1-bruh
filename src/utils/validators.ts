export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && 
         !isNaN(value) && 
         isFinite(value);
}

export function isValidPrice(price: number): boolean {
  return isValidNumber(price) && 
         price >= 0;
}

export function isValidVolume(volume: number): boolean {
  return isValidNumber(volume) && 
         volume >= 0;
}

export function isValidDate(date: string): boolean {
  const parsed = new Date(date);
  const now = new Date();
  return parsed >= now;
}

export function validateCryptoSymbol(symbol: string): string | null {
  if (!symbol) {
    return 'Please enter a crypto symbol';
  }

  const trimmed = symbol.trim().toUpperCase();
  
  if (!trimmed.includes('-')) {
    return 'Please use format like BTC-USD';
  }

  const [base, quote] = trimmed.split('-');
  
  if (!base || !quote) {
    return 'Invalid crypto pair format';
  }

  if (base.length < 2 || base.length > 10) {
    return 'Invalid base currency';
  }

  if (quote.length < 2 || quote.length > 10) {
    return 'Invalid quote currency';
  }

  if (!/^[A-Z0-9]+$/.test(base) || !/^[A-Z0-9]+$/.test(quote)) {
    return 'Crypto symbols can only contain letters and numbers';
  }

  return null;
}