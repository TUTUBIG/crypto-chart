import { RealTimeTrade } from '../types/data';
import { deserializeRealTimeTradeDataFromBytes } from '../utils/binaryDeserializer';
import { API_CONFIG } from '../config/api';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private onTradeCallback: ((trade: RealTimeTrade) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private isConnecting = false;
  private connectionTimeout: number | null = null;

  constructor() {
    // Don't auto-connect, let the component control when to connect
  }

  // Public method to start connection
  public startConnection(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }
    
    // Delay connection to avoid race conditions
    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  private connect(): void {
    if (this.isConnecting) {
      console.log('WebSocket connection already in progress, skipping...');
      return;
    }

    try {
      this.isConnecting = true;
      console.log('Attempting to connect to WebSocket:', API_CONFIG.ENDPOINTS.WEBSOCKET);
      
      this.ws = new WebSocket(API_CONFIG.ENDPOINTS.WEBSOCKET);
      
      // Set connection timeout
      this.connectionTimeout = window.setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          console.log('WebSocket connection timeout, closing...');
          this.ws.close();
        }
      }, API_CONFIG.TIMEOUTS.WEBSOCKET_CONNECT);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        
        // Clear connection timeout
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        this.onConnectCallback?.();
      };
      this.ws.binaryType = 'arraybuffer';

      this.ws.onmessage = (event) => {
        try {
          // Handle binary data from WebSocket
          if (event.data instanceof ArrayBuffer) {
            this.handleBinaryMessage(event.data);
          } else if (event.data instanceof Blob) {
            // Convert Blob to ArrayBuffer
            event.data.arrayBuffer().then(buffer => {
              this.handleBinaryMessage(buffer);
            });
          } else {
            console.warn('Received non-binary data from WebSocket:', event.data);
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        
        // Clear connection timeout
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        this.onDisconnectCallback?.();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        
        // Clear connection timeout
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        this.onErrorCallback?.('WebSocket connection error');
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private handleBinaryMessage(data: ArrayBuffer): void {
    try {
      console.log('Received binary data:', {
        byteLength: data.byteLength,
        data: Array.from(new Uint8Array(data)).slice(0, 16) // Log first 16 bytes for debugging
      });
      
      // Deserialize binary RealTimeTrade data
      const trade = deserializeRealTimeTradeDataFromBytes(new Uint8Array(data));
      console.log('Received binary RealTimeTrade data:', trade);
      
      // Call the trade callback
      this.onTradeCallback?.(trade);
    } catch (error) {
      console.error('Error deserializing binary WebSocket data:', error);
      console.error('Data details:', {
        byteLength: data.byteLength,
        data: Array.from(new Uint8Array(data))
      });
      this.onErrorCallback?.('Failed to deserialize binary data');
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      // Add delay before reconnecting to avoid rapid reconnection attempts
      setTimeout(() => {
        if (!this.isConnecting) {
          this.connect();
        }
      }, this.reconnectDelay);
      
      // Exponential backoff
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
    } else {
      console.error('Max reconnection attempts reached');
      this.onErrorCallback?.('Failed to reconnect after maximum attempts');
    }
  }

  // Public methods for setting callbacks
  public onTrade(callback: (trade: RealTimeTrade) => void): void {
    this.onTradeCallback = callback;
  }



  public onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  public onConnect(callback: () => void): void {
    this.onConnectCallback = callback;
  }

  public onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  // Send message to WebSocket
  public send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  // Disconnect WebSocket
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Check if WebSocket is connected
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const wsService = new WebSocketService(); 