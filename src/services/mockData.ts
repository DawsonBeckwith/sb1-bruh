// Mock predictions for testing
export const generateMockPredictions = (type: string, symbol?: string) => {
  const timestamp = new Date().toISOString();
  
  if (type === 'vision') {
    return {
      predictions: [
        {
          prediction: 'KC -3.5',
          odds: '-110',
          book: 'FD',
          edge: 5.8
        },
        {
          prediction: 'SF ML',
          odds: '-125',
          book: 'DK',
          edge: 6.2
        }
      ]
    };
  }

  if (type === 'prop') {
    return {
      predictions: [
        {
          prediction: 'P.Mahomes passing yards o274.5',
          odds: '-110',
          book: 'MGM',
          edge: 5.5
        },
        {
          prediction: 'C.McCaffrey rush+rec yards o124.5',
          odds: '-115',
          book: 'FD',
          edge: 6.1
        }
      ]
    };
  }

  if (type === 'crypto') {
    return {
      symbol: symbol || 'BTC-USD',
      price: 63750.25 + (Math.random() * 1000 - 500),
      change: 2.35 + (Math.random() * 2 - 1),
      edge: 5.8,
      timestamp
    };
  }

  // Stock predictions
  return {
    symbol: symbol || 'SPY',
    price: 510.75 + (Math.random() * 2 - 1),
    change: 0.75 + (Math.random() * 1 - 0.5),
    edge: 4.2,
    timestamp
  };
};