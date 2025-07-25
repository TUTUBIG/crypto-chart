import React from 'react';
import CandleChartWidget from './components/CandleChartWidget';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Crypto Chart Widget</h1>
        <p>A real-time candle chart widget with live data from API server</p>
      </header>
      
      <main className="app-main">
        <div className="chart-layout">
          <section className="chart-section">
            <h2>📈 BTC/USDT Live Chart</h2>
            <p className="widget-description">
              Real-time candlestick chart with volume indicators and live price updates from API server.
            </p>
            <CandleChartWidget 
              symbol="BTC/USDT" 
              height={700} 
              width={800} 
            />
          </section>
          
          <section className="trades-section">
            <h3>📊 Recent Trades</h3>
            <p className="trades-description">
              Live trade feed showing real-time price movements and volume.
            </p>
            <div className="trades-container">
              <div className="trade-item-header">
                <span>Price</span>
                <span>Amount</span>
                <span>Time</span>
              </div>
              <div className="trades-list" id="trades-list">
                <div className="no-trades">
                  <p>Waiting for real-time trades...</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <section className="info-section">
          <h3>🎯 Features</h3>
          <ul>
            <li><strong>📊 Candle Chart:</strong> Real-time candlestick visualization with volume indicators</li>
            <li><strong>💰 Price Display:</strong> Current price with change percentage and direction</li>
            <li><strong>⚡ Live Updates:</strong> New candles every minute from API server</li>
            <li><strong>📱 Responsive Design:</strong> Works on desktop and mobile devices</li>
            <li><strong>🔗 Connection Status:</strong> Real-time connection indicator</li>
            <li><strong>📈 Recent Trades:</strong> Live trade feed with price and volume</li>
          </ul>
          
          <h3>🔄 Data Flow</h3>
          <ul>
            <li><strong>Initial Load:</strong> Fetches historical candles from API endpoint <code>/candle-chart</code></li>
            <li><strong>Minute Updates:</strong> Fetches single minute candle every minute from API endpoint <code>/single-chart</code></li>
            <li><strong>Real-time:</strong> Subscribes to real-time trade data via WebSocket endpoint <code>/real-time</code></li>
          </ul>
          
          <h3>📋 Data Structure</h3>
          <div className="data-structure">
            <h4>Candle Data:</h4>
            <pre>
{`{
  OpenPrice: number,
  ClosePrice: number,
  HighPrice: number,
  LowPrice: number,
  VolumeIn: number,
  VolumeOut: number,
  Timestamp: number // seconds
}`}
            </pre>
            
            <h4>Real-time Trade Data:</h4>
            <pre>
{`{
  TradeTime: number,
  AmountIn: number,
  AmountOut: number,
  Price: number
}`}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App; 