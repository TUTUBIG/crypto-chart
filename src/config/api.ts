// API Configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://crypto-pump.bigtutu.workers.dev',
  
  // API Endpoints
  ENDPOINTS: {
    // Historical candle data
    HISTORY_CANDLES: '/candle-chart',
    
    // Single candle data
    SINGLE_CANDLE: '/single-candle',
    
    // WebSocket endpoint for real-time data
    WEBSOCKET: import.meta.env.VITE_WEBSOCKET_URL || 'wss://crypto-pump.bigtutu.workers.dev/ws',
  },
  
  // Request timeouts (in milliseconds)
  TIMEOUTS: {
    HTTP_REQUEST: 10000, // 10 seconds
    WEBSOCKET_CONNECT: 5000, // 5 seconds
  },
  
  // Chart configuration
  CHART: {
    MAX_CANDLES: 1000, // Maximum number of candles to keep in memory
    UPDATE_INTERVAL: 60000, // 1 minute in milliseconds
    VOLUME_HEIGHT_PERCENTAGE: 10, // 10% of chart height for volume
  },
  
  // WebSocket configuration
  WEBSOCKET: {
    RECONNECT_DELAY: 1000, // 1 second
    MAX_RECONNECT_ATTEMPTS: 5,
    HEARTBEAT_INTERVAL: 30000, // 30 seconds
  },
} as const;

// Environment-specific configurations
export const ENV_CONFIG = {
  // Development environment
  development: {
    DEBUG: true,
    LOG_LEVEL: 'debug',
  },
  
  // Production environment
  production: {
    DEBUG: false,
    LOG_LEVEL: 'error',
  },
} as const;

// Get current environment
export const getCurrentEnv = (): keyof typeof ENV_CONFIG => {
  return import.meta.env.MODE as keyof typeof ENV_CONFIG || 'development';
};

// Get environment-specific config
export const getEnvConfig = () => {
  const env = getCurrentEnv();
  return ENV_CONFIG[env] || ENV_CONFIG.development;
}; 