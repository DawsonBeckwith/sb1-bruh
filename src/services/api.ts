import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import pRetry from 'p-retry';
import PQueue from 'p-queue';
import { polygonClient } from '@polygon.io/client-js';
import { XAI_API_KEY, POLYGON_API_KEY } from '../config/keys';
import { validateCryptoSymbol } from '../utils/validators';
import { useSession } from '../hooks/useSession';
import { useUsageStore } from '../store/usageStore';

const API_TIMEOUT = 30000;
const MAX_RETRIES = 5;
const MIN_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 8000;
const CONCURRENCY_LIMIT = 3;

const queue = new PQueue({ concurrency: CONCURRENCY_LIMIT });

const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${XAI_API_KEY}`
    }
  });

  axiosRetry(instance, {
    retries: MAX_RETRIES,
    retryDelay: (retryCount) => {
      return Math.min(MIN_RETRY_DELAY * Math.pow(2, retryCount - 1), MAX_RETRY_DELAY);
    },
    retryCondition: (error) => {
      return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
             error.code === 'ECONNABORTED' ||
             (error.response?.status === 429) ||
             (error.response?.status ? error.response.status >= 500 : false);
    }
  });

  return instance;
};

const xaiApi = createApiInstance('https://api.xai-platform.com');
const polygonRestClient = polygonClient(POLYGON_API_KEY);

export const fetchPredictions = async (type: string, symbol?: string) => {
  return queue.add(async () => {
    const { userId, authKey } = useSession.getState();
    const { incrementUsage } = useUsageStore.getState();
    
    try {
      let data;
      
      if (type === 'vision' || type === 'prop') {
        console.log('Fetching XAI prediction:', { type, symbol });
        const response = await xaiApi.post('/predictions', {
          type,
          league: symbol
        }, {
          headers: {
            'Authorization': `Bearer ${XAI_API_KEY}`,
            'X-Auth-Key': authKey
          }
        });

        console.log('XAI response:', response.data);

        if (!response.data?.predictions) {
          throw new Error('Invalid prediction data received');
        }

        data = response.data;
      } else if (type === 'crypto') {
        if (symbol) {
          const validationError = validateCryptoSymbol(symbol);
          if (validationError) throw new Error(validationError);
        }
        
        const ticker = `X:${symbol || 'BTC-USD'}`;
        const result = await polygonRestClient.stocks.previousClose(ticker);
        
        if (!result.results?.[0]) {
          throw new Error('No crypto data available');
        }

        const quote = result.results[0];
        data = {
          symbol: ticker.replace('X:', ''),
          price: quote.c,
          change: ((quote.c - quote.o) / quote.o) * 100,
          volume: quote.v,
          timestamp: new Date().toISOString()
        };
      } else if (type === 'stock') {
        const ticker = symbol || 'SPY';
        const result = await polygonRestClient.stocks.previousClose(ticker);
        
        if (!result.results?.[0]) {
          throw new Error('No stock data available');
        }

        const quote = result.results[0];
        data = {
          symbol: ticker,
          price: quote.c,
          change: ((quote.c - quote.o) / quote.o) * 100,
          volume: quote.v,
          timestamp: new Date().toISOString()
        };
      }

      if (!data) {
        throw new Error('No data available');
      }

      if (userId) {
        incrementUsage(userId);
      }

      // Notify parent frame of successful prediction
      window.parent.postMessage({
        type: 'PREDICTION_UPDATE',
        prediction: data,
        deployUrl: window.location.origin
      }, '*');
      
      return data;

    } catch (error: any) {
      const errorMessage = error?.message || 'Service temporarily unavailable';
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }
  });
};