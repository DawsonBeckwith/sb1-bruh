import TinyEmitter from 'tiny-emitter';
import { POLYGON_API_KEY } from '../config/keys';

class WebSocketService {
  private ws: WebSocket | null = null;
  private emitter: TinyEmitter;
  private subscribers: Map<string, Set<(data: any) => void>>;
  private connected: boolean;
  private reconnectTimer: number | null;
  private messageQueue: any[];
  private processingQueue: boolean;
  private reconnectAttempts: number;
  private maxReconnectAttempts: number;

  constructor() {
    this.emitter = new TinyEmitter();
    this.subscribers = new Map();
    this.connected = false;
    this.reconnectTimer = null;
    this.messageQueue = [];
    this.processingQueue = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.initWebSocket();
  }

  private initWebSocket() {
    try {
      if (this.ws) {
        this.ws.close();
      }

      this.ws = new WebSocket('wss://socket.polygon.io/stocks');

      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        this.authenticate();
        this.emitter.emit('connected');
      };

      this.ws.onclose = () => {
        this.connected = false;
        this.scheduleReconnect();
        this.emitter.emit('disconnected');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
        this.scheduleReconnect();
        this.emitter.emit('error', error);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && !data.error) {
            this.queueMessage(data);
          } else if (data.error) {
            console.error('WebSocket message error:', data.error);
            this.emitter.emit('error', new Error(data.error));
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
          this.emitter.emit('error', error);
        }
      };
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      this.scheduleReconnect();
      this.emitter.emit('error', error);
    }
  }

  private authenticate() {
    if (this.connected && this.ws) {
      this.ws.send(JSON.stringify({
        action: 'auth',
        params: POLYGON_API_KEY
      }));
    }
  }

  private queueMessage(message: any) {
    const sanitized = this.sanitizeMessage(message);
    if (sanitized) {
      this.messageQueue.push(sanitized);
      if (!this.processingQueue) {
        this.processQueue();
      }
    }
  }

  private sanitizeMessage(message: any): any {
    try {
      return {
        type: String(message.type || ''),
        symbol: String(message.symbol || ''),
        price: Number(message.price) || 0,
        volume: Number(message.volume) || 0,
        timestamp: Date.now()
      };
    } catch {
      return null;
    }
  }

  private async processQueue() {
    if (this.processingQueue || this.messageQueue.length === 0) return;
    
    this.processingQueue = true;
    
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.broadcast(message);
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    this.processingQueue = false;
  }

  private broadcast(message: any) {
    this.subscribers.forEach((subscribers, channel) => {
      if (message.symbol && message.symbol.includes(channel)) {
        subscribers.forEach(callback => {
          try {
            callback(message);
          } catch (error) {
            console.error('Subscriber callback error:', error);
          }
        });
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emitter.emit('maxReconnectAttemptsReached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    this.reconnectTimer = window.setTimeout(() => {
      if (!this.connected) {
        this.reconnectAttempts++;
        this.initWebSocket();
      }
    }, delay);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.emitter.on(event, callback);
  }

  removeListener(event: string, callback: (...args: any[]) => void) {
    this.emitter.off(event, callback);
  }

  subscribe(channel: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }

    const subscribers = this.subscribers.get(channel)!;
    subscribers.add(callback);

    if (this.connected && this.ws) {
      this.ws.send(JSON.stringify({
        action: 'subscribe',
        params: channel
      }));
    }

    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(channel);
        if (this.connected && this.ws) {
          this.ws.send(JSON.stringify({
            action: 'unsubscribe',
            params: channel
          }));
        }
      }
    };
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
    
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
    }
    
    this.subscribers.clear();
    this.messageQueue = [];
    this.connected = false;
    this.processingQueue = false;
    this.reconnectAttempts = 0;
  }
}

export const wsService = new WebSocketService();