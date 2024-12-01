import { useEffect, useCallback, useRef } from 'react';
import { wsService } from '../services/websocket';

export function useWebSocket(event: string, callback: (data: any) => void) {
  const callbackRef = useRef(callback);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleMessage = useCallback((data: any) => {
    if (callbackRef.current) {
      callbackRef.current(data);
    }
  }, []);

  useEffect(() => {
    const setupSubscription = () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      unsubscribeRef.current = wsService.subscribe(event, handleMessage);
    };

    wsService.on('connected', setupSubscription);
    wsService.on('maxReconnectAttemptsReached', () => {
      console.error('WebSocket max reconnection attempts reached');
    });

    setupSubscription();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      wsService.removeListener('connected', setupSubscription);
      wsService.removeListener('maxReconnectAttemptsReached', () => {});
    };
  }, [event, handleMessage]);
}