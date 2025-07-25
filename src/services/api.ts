import axios from 'axios';
import { Candle } from '../types/data';
import { deserializeCandleDataFromBytes } from '../utils/binaryDeserializer';
import { API_CONFIG } from '../config/api';

// API client instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUTS.HTTP_REQUEST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch historical candles from real endpoint
export const fetchHistoryCandles = async (): Promise<Candle[]> => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.HISTORY_CANDLES, {
      responseType: 'arraybuffer'
    });
    
    // Check if response data is empty or nil
    if (!response.data || response.data.byteLength === 0) {
      console.log('API returned nil/empty data for historical candles');
      return []; // Return empty array instead of throwing error
    }
    
    // Deserialize binary data
    const candles = deserializeCandleDataFromBytes(new Uint8Array(response.data));
    console.log("Historical candles received:", candles.length,candles);
    return candles;
  } catch (error) {
    console.error('Error fetching historical candles:', error);
    return []; // Return empty array on error
  }
};

// Fetch single minute candle from real endpoint
export const fetchSingleCandle = async (): Promise<Candle | null> => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.SINGLE_CANDLE, {
      responseType: 'arraybuffer'
    });
    
    // Check if response data is empty or nil
    if (!response.data || response.data.byteLength === 0) {
      console.log('API returned nil/empty data for single candle');
      return null; // Return null instead of throwing error
    }
    
    // Deserialize binary data (single candle)
    const candles = deserializeCandleDataFromBytes(new Uint8Array(response.data));
    console.log("Single candle received:", candles.length);

    if (candles.length === 0) {
      console.log('No candle data in response');
      return null;
    }
    
    return candles[0]; // Return the first (and only) candle
  } catch (error) {
    console.error('Error fetching single candle:', error);
    return null; // Return null on error
  }
};

// Helper function to convert timestamp to milliseconds for chart library
export const convertTimestampToMs = (timestamp: number): number => {
  return timestamp * 1000; // Convert seconds to milliseconds
};

// Helper function to convert milliseconds back to seconds
export const convertMsToTimestamp = (ms: number): number => {
  return Math.floor(ms / 1000);
}; 