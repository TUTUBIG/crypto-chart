# Configuration Guide

This document explains how to configure the crypto chart application.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8787
VITE_WEBSOCKET_URL=ws://localhost:8787/ws

# Optional: Override default settings
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

## Configuration Structure

The application uses a centralized configuration system located in `src/config/api.ts`:

### API Configuration (`API_CONFIG`)

```typescript
{
  BASE_URL: string,           // Base URL for HTTP requests
  ENDPOINTS: {
    HISTORY_CANDLES: string,  // Historical candle data endpoint
    SINGLE_CANDLE: string,    // Single candle data endpoint
    WEBSOCKET: string,        // WebSocket endpoint for real-time data
  },
  TIMEOUTS: {
    HTTP_REQUEST: number,     // HTTP request timeout (ms)
    WEBSOCKET_CONNECT: number, // WebSocket connection timeout (ms)
  },
  CHART: {
    MAX_CANDLES: number,      // Maximum candles to keep in memory
    UPDATE_INTERVAL: number,  // Chart update interval (ms)
    VOLUME_HEIGHT_PERCENTAGE: number, // Volume chart height percentage
  },
  WEBSOCKET: {
    RECONNECT_DELAY: number,  // Reconnection delay (ms)
    MAX_RECONNECT_ATTEMPTS: number, // Maximum reconnection attempts
    HEARTBEAT_INTERVAL: number, // Heartbeat interval (ms)
  }
}
```

### Environment-Specific Configuration (`ENV_CONFIG`)

```typescript
{
  development: {
    DEBUG: boolean,
    LOG_LEVEL: string,
  },
  production: {
    DEBUG: boolean,
    LOG_LEVEL: string,
  }
}
```

## Default Values

### API Endpoints
- **Base URL**: `http://localhost:8787`
- **Historical Candles**: `/candle-chart`
- **Single Candle**: `/single-candle`
- **WebSocket**: `ws://localhost:8787/ws`

### Timeouts
- **HTTP Request**: 10 seconds
- **WebSocket Connect**: 5 seconds

### Chart Settings
- **Max Candles**: 1000
- **Update Interval**: 60 seconds (1 minute)
- **Volume Height**: 10% of chart

### WebSocket Settings
- **Reconnect Delay**: 1 second
- **Max Reconnect Attempts**: 5
- **Heartbeat Interval**: 30 seconds

## Usage Examples

### Accessing Configuration

```typescript
import { API_CONFIG, getEnvConfig } from '../config/api';

// Use API endpoints
const historyUrl = API_CONFIG.ENDPOINTS.HISTORY_CANDLES;

// Use chart settings
const maxCandles = API_CONFIG.CHART.MAX_CANDLES;

// Get environment-specific config
const envConfig = getEnvConfig();
const isDebug = envConfig.DEBUG;
```

### Environment Detection

```typescript
import { getCurrentEnv } from '../config/api';

const env = getCurrentEnv(); // 'development' | 'production'
```

## Customization

### Adding New Configuration

1. **Add to `API_CONFIG`**:
   ```typescript
   export const API_CONFIG = {
     // ... existing config
     NEW_SECTION: {
       NEW_VALUE: 'default',
     },
   } as const;
   ```

2. **Add to `ENV_CONFIG`**:
   ```typescript
   export const ENV_CONFIG = {
     development: {
       // ... existing config
       NEW_PROPERTY: true,
     },
     production: {
       // ... existing config
       NEW_PROPERTY: false,
     },
   } as const;
   ```

### Environment Variables

Add new environment variables to the configuration:

```typescript
// In API_CONFIG
BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787',
NEW_VALUE: import.meta.env.VITE_NEW_VALUE || 'default',
```

Then add to your `.env` file:
```env
VITE_NEW_VALUE=your_value
```

## Best Practices

1. **Centralized Configuration**: All settings are managed in `src/config/api.ts`
2. **Environment Variables**: Use `VITE_` prefix for client-side variables
3. **Type Safety**: Use `as const` for immutable configuration objects
4. **Default Values**: Always provide sensible defaults
5. **Documentation**: Update this file when adding new configuration options 