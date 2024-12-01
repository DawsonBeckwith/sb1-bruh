export interface OddsResponse {
  id: string;
  sport_key: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    markets: {
      key: string;
      outcomes: {
        name: string;
        price: number;
        point?: number;
      }[];
    }[];
  }[];
}

export interface XAIResponse {
  predictions: {
    id: string;
    confidence: number;
    edge: number;
  }[];
  edges: {
    [key: string]: number;
  };
}

export interface PredictionError {
  message: string;
  code?: string;
  status?: number;
}