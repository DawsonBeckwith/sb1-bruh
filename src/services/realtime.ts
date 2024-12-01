import { io } from 'socket.io-client';
import TinyEmitter from 'tiny-emitter';
import { XAI_API_KEY } from '../config/keys';

class RealtimeService {
  private socket: any;
  private emitter: TinyEmitter;
  private connected: boolean;
  private reconnectTimer: number | null;
  private messageQueue: any[];
  private processingQueue: boolean;

  constructor() {
    this.emitter = new TinyEmitter();
    this.connected = false;
    this.reconnectTimer = null;
    this.messageQueue = [];
    this.processingQueue = false;
    this.initSocket();
  }

  private initSocket() {
    try {
      this.socket = io('wss://api.xai-platform.com', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: { token: XAI_API_KEY }
      });

      this.setupSocketEvents();
    } catch (error) {
      console.error('Socket initialization error:', error);
      this.scheduleReconnect();
    }
  }

  private setupSocketEvents() {
    this.socket.on('connect', () => {
      this.connected = true;
      this.emitter.emit('connected');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      this.scheduleReconnect();
      this.emitter.emit('disconnected');
    });

    this.socket.on('prediction', (data: any) => this.queueMessage(data));
    this.socket.on('update', (data: any) => this.queueMessage(data));
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

  private sanitizeMessage(message: any): any {
    try {
      return {
        type: String(message.type || ''),
        predictions: Array.isArray(message.predictions) ? 
          message.predictions.map((p: any) => ({
            id: String(p.id || ''),
            prediction: String(p.prediction || ''),
            odds: p.odds || null,
            book: p.book || null,
            edge: Number(p.edge) || null,
            timestamp: Date.now()
          })) : [],
        timestamp: Date.now()
      };
    } catch {
      return null;
    }
  }

  private broadcast(message: any) {
    this.emitter.emit('message', message);
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = window.setTimeout(() => {
      if (!this.connected) {
        this.initSocket();
      }
    }, 1000);
  }

  subscribe(channel: string, callback: (data: any) => void): () => void {
    const handler = (data: any) => {
      if (data.channel === channel) {
        callback(data);
      }
    };

    this.emitter.on('message', handler);
    
    if (this.connected) {
      this.socket.emit('subscribe', { channel });
    }

    return () => {
      this.emitter.off('message', handler);
      if (this.connected) {
        this.socket.emit('unsubscribe', { channel });
      }
    };
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
    
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
    }
    
    this.messageQueue = [];
    this.connected = false;
    this.processingQueue = false;
  }
}

export const realtimeService = new RealtimeService();