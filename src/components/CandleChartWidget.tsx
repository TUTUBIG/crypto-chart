import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { Candle, RealTimeTrade } from '../types/data';
import { fetchHistoryCandles, fetchSingleCandle, convertTimestampToMs } from '../services/api';
import { wsService } from '../services/websocket';
import { API_CONFIG } from '../config/api';
import './CandleChartWidget.css';

interface CandleChartWidgetProps {
  symbol?: string;
  height?: number;
  width?: number;
}

const CandleChartWidget: React.FC<CandleChartWidgetProps> = ({
  symbol = 'BTC/USDT',
  height = 400,
  width = 800
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Initialize chart
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    // Clean up existing chart
    if (chartRef.current) {
      chartRef.current.remove();
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Handle chart resize
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // Convert candle data to chart format
  const convertCandleToChartData = useCallback((candle: Candle): CandlestickData => ({
    time: convertTimestampToMs(candle.Timestamp) as any,
    open: candle.OpenPrice,
    high: candle.HighPrice,
    low: candle.LowPrice,
    close: candle.ClosePrice,
  }), []);

  // Update chart with new data
  const updateChart = useCallback((newCandles: Candle[]) => {
    if (!candlestickSeriesRef.current) return;

    const chartData = newCandles.map(convertCandleToChartData);
    candlestickSeriesRef.current.setData(chartData);
  }, [convertCandleToChartData]);

  // Fetch historical data
  const fetchHistoricalData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const historicalCandles = await fetchHistoryCandles();
      setCandles(historicalCandles);
      updateChart(historicalCandles);
      
      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch historical data';
      setError(errorMessage);
      console.error('Error fetching historical data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [updateChart]);

  // Fetch single candle (called every minute)
  const fetchLatestCandle = useCallback(async () => {
    try {
      const newCandle = await fetchSingleCandle();
      
      // Handle null response (nil data from API)
      if (!newCandle) {
        console.log('No new candle data received from API');
        return;
      }
      
      setCandles(prevCandles => {
        // Check if we already have a candle for this timestamp
        const existingIndex = prevCandles.findIndex(
          candle => candle.Timestamp === newCandle.Timestamp
        );
        
        let updatedCandles;
        if (existingIndex >= 0) {
          // Update existing candle
          updatedCandles = [...prevCandles];
          updatedCandles[existingIndex] = newCandle;
        } else {
          // Add new candle
          updatedCandles = [...prevCandles, newCandle];
        }
        
        // Sort by timestamp and keep only recent candles
        updatedCandles.sort((a, b) => a.Timestamp - b.Timestamp);
        if (updatedCandles.length > API_CONFIG.CHART.MAX_CANDLES) {
          updatedCandles = updatedCandles.slice(-API_CONFIG.CHART.MAX_CANDLES);
        }
        
        return updatedCandles;
      });
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching latest candle:', err);
    }
  }, []);

  // Handle real-time trade data from WebSocket
  const handleRealTimeTrade = useCallback((trade: RealTimeTrade) => {
    console.log('Real-time trade received:', trade);
    setLastUpdate(new Date());
    
    // For now, we'll just log the trade data
    // In a real implementation, you might want to update the current candle
    // or create a new one based on the trade data
  }, []);

  // Setup WebSocket connection
  const setupWebSocket = useCallback(() => {
    wsService.onTrade(handleRealTimeTrade);
    wsService.onError((error) => {
      console.error('WebSocket error:', error);
      setError(`WebSocket error: ${error}`);
    });
    wsService.onConnect(() => {
      setConnectionStatus('connected');
      setError(null);
    });
    wsService.onDisconnect(() => {
      setConnectionStatus('disconnected');
    });
    
    // Start WebSocket connection after a delay
    setTimeout(() => {
      wsService.startConnection();
    }, 2000); // Wait 2 seconds before connecting
  }, [handleRealTimeTrade]);

  // Initialize component
  useEffect(() => {
    const cleanup = initializeChart();
    setupWebSocket();
    fetchHistoricalData();

    // Set up interval to fetch new candles every minute
    const intervalId = setInterval(fetchLatestCandle, API_CONFIG.CHART.UPDATE_INTERVAL);

    return () => {
      cleanup?.();
      clearInterval(intervalId);
      wsService.disconnect();
    };
  }, [initializeChart, setupWebSocket, fetchHistoricalData, fetchLatestCandle]);

  // Update chart when candles change
  useEffect(() => {
    if (candles.length > 0) {
      updateChart(candles);
    }
  }, [candles, updateChart]);

  return (
    <div className="candle-chart-widget">
      <div className="chart-header">
        <h3>{symbol}</h3>
        <div className="status-indicators">
          <span className={`connection-status ${connectionStatus}`}>
            {connectionStatus}
          </span>
          {lastUpdate && (
            <span className="last-update">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
      
      <div 
        ref={chartContainerRef} 
        className="chart-container"
        style={{ height: `${height}px`, width: `${width}px` }}
      />
    </div>
  );
};

export default CandleChartWidget; 