// Candle data structure
export interface Candle {
  OpenPrice: number;
  ClosePrice: number;
  HighPrice: number;
  LowPrice: number;
  VolumeIn: number;
  VolumeOut: number;
  Timestamp: number; // seconds
}

// Real-time trade data structure
export interface RealTimeTrade {
  TradeTime: number;
  AmountIn: number;
  AmountOut: number;
  Price: number;
}

// API response types
export interface HistoryCandlesResponse {
  candles: Candle[];
  success: boolean;
  message?: string;
}

export interface SingleCandleResponse {
  candle: Candle;
  success: boolean;
  message?: string;
}

// WebSocket message types
export interface WebSocketTradeMessage {
  type: 'trade';
  data: RealTimeTrade;
}

export interface WebSocketErrorMessage {
  type: 'error';
  message: string;
}

export type WebSocketMessage = WebSocketTradeMessage | WebSocketErrorMessage; 