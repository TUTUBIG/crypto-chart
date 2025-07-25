# Crypto Chart Widget

A real-time candle chart widget for cryptocurrency data built with React, TypeScript, and lightweight-charts.

## Features

- **Real-time Data**: WebSocket connection for live trade updates
- **Historical Data**: Initial load of historical candle data
- **Minute Updates**: Automatic fetching of new candles every minute
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with dark mode support
- **TypeScript**: Full type safety throughout the application

## Data Flow

1. **Initial Load**: Fetches historical candles from API endpoint `/a`
2. **Minute Updates**: Fetches single minute candle every minute from API endpoint `/b`
3. **Real-time**: Subscribes to real-time trade data via WebSocket endpoint `/c`

## Data Structures

### Candle Data
```typescript
{
  OpenPrice: number,
  ClosePrice: number,
  HighPrice: number,
  LowPrice: number,
  VolumeIn: number,
  VolumeOut: number,
  Timestamp: number // seconds
}
```

### Real-time Trade Data
```typescript
{
  TradeTime: number,
  AmountIn: number,
  AmountOut: number,
  Price: number
}
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-chart
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_WS_BASE_URL=ws://localhost:8080
```

### API Endpoints

The widget expects the following API endpoints:

- `GET /a` - Fetch historical candles
- `GET /b` - Fetch single minute candle
- `WS /c` - WebSocket endpoint for real-time data

## Usage

### Basic Usage

```tsx
import CandleChartWidget from './components/CandleChartWidget';

function App() {
  return (
    <CandleChartWidget 
      symbol="BTC/USDT" 
      height={500} 
      width={1000} 
    />
  );
}
```

### Props

- `symbol` (string, optional): Trading pair symbol (default: "BTC/USDT")
- `height` (number, optional): Chart height in pixels (default: 400)
- `width` (number, optional): Chart width in pixels (default: 800)

## Project Structure

```
src/
├── components/
│   ├── CandleChartWidget.tsx    # Main chart component
│   └── CandleChartWidget.css    # Chart styles
├── services/
│   ├── api.ts                   # API service functions
│   └── websocket.ts             # WebSocket service
├── types/
│   └── data.ts                  # TypeScript interfaces
├── App.tsx                      # Main app component
├── App.css                      # App styles
├── main.tsx                     # Entry point
└── index.css                    # Global styles
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing

The widget includes error handling and connection status indicators:

- **Loading State**: Shows spinner while fetching initial data
- **Error Handling**: Displays error messages for API failures
- **Connection Status**: Shows WebSocket connection status
- **Last Update**: Displays timestamp of last data update

## Customization

### Styling

The widget uses CSS modules and can be customized by modifying:

- `src/components/CandleChartWidget.css` - Chart widget styles
- `src/App.css` - Application styles

### Chart Configuration

The chart is built using lightweight-charts. You can customize chart options in `CandleChartWidget.tsx`:

```tsx
const chart = createChart(chartContainerRef.current, {
  // Customize chart options here
  layout: {
    background: { color: '#ffffff' },
    textColor: '#333',
  },
  // ... more options
});
```

## API Integration

### Historical Data Endpoint (`/a`)

Expected response:
```json
{
  "success": true,
  "candles": [
    {
      "OpenPrice": 50000.0,
      "ClosePrice": 50100.0,
      "HighPrice": 50200.0,
      "LowPrice": 49900.0,
      "VolumeIn": 100.5,
      "VolumeOut": 100.0,
      "Timestamp": 1640995200
    }
  ]
}
```

### Single Candle Endpoint (`/b`)

Expected response:
```json
{
  "success": true,
  "candle": {
    "OpenPrice": 50000.0,
    "ClosePrice": 50100.0,
    "HighPrice": 50200.0,
    "LowPrice": 49900.0,
    "VolumeIn": 100.5,
    "VolumeOut": 100.0,
    "Timestamp": 1640995200
  }
}
```

### WebSocket Endpoint (`/c`)

Expected message format:
```json
{
  "type": "trade",
  "data": {
    "TradeTime": 1640995200,
    "AmountIn": 0.1,
    "AmountOut": 5000.0,
    "Price": 50000.0
  }
}
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - see LICENSE file for details. 