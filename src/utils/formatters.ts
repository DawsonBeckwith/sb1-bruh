import { isValidNumber } from './validators';

interface MarketData {
  ticker: string;
  price: number;
  date?: string;
  strike?: number;
  type?: string;
}

interface CryptoData {
  symbol: string;
  c: number;
  o: number;
  h: number;
  l: number;
  v: number;
}

export function formatOptionsData(data: MarketData): string {
  if (!isValidNumber(data.price) || !data.date || !isValidNumber(data.strike)) {
    return '';
  }

  const price = data.price.toFixed(2);
  const strike = data.strike.toFixed(1);
  
  return `${data.ticker} ${data.date} ${strike}${data.type} @${price}`;
}

export function formatCryptoChange(current: number, open: number): string {
  if (!isValidNumber(current) || !isValidNumber(open)) {
    return '+0.0%';
  }

  const change = ((current - open) / open) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

export function calculateEdge(volatility: number, volume: number): number {
  if (!isValidNumber(volatility) || !isValidNumber(volume)) {
    return 0;
  }

  const baseEdge = Math.abs(volatility) * 1.2;
  const volumeMultiplier = Math.min(volume / 10000, 1.5);
  
  return Math.min(baseEdge * volumeMultiplier, 8.5);
}