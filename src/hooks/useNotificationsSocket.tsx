import { useEffect, useRef, useCallback, useState } from "react";
  import * as SecureStore from "expo-secure-store";                                                                                                                                                                                                  
                                                                                                                                                                                                                                                       export function useNotificationsSocket() {                                                                                                                                                                                                         
    const [socketStatus, setSocketStatus] = useState<                                                                                                                                                                                                
      "connecting" | "connected" | "disconnected"
    >("connecting");

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onInviteRef = useRef<((data: any) => void) | null>(null);
    const onInviteAcceptedRef = useRef<((data: any) => void) | null>(null);

    const registerOnLiveSeshInvite = useCallback((cb: (data: any) => void) => {
      onInviteRef.current = cb;
    }, []);

    const registerOnLiveSeshInviteAccepted = useCallback(
      (cb: (data: any) => void) => {
        onInviteAcceptedRef.current = cb;
      },
      [],
    );

    const connect = useCallback(async () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }

      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) {
        setSocketStatus("disconnected");
        return;
      }

      setSocketStatus("connecting");

      const ws = new WebSocket(
        `wss://badrainbowz.com/ws/notifications/?token=${token}`,
      );

      ws.onopen = () => {
        console.log("[NOTIF WS] connected");
        setSocketStatus("connected");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(`[NOTIF WS] <<< ${message.action}`);
        if (message.action === "live_sesh_invite") {
          onInviteRef.current?.(message.data);
        } else if (message.action === "live_sesh_invite_accepted") {
          onInviteAcceptedRef.current?.(message.data);
        }
      };

      ws.onclose = (event) => {
        console.log(`[NOTIF WS] disconnected — code=${event.code}`);
        setSocketStatus("disconnected");
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();

      wsRef.current = ws;
    }, []);

    useEffect(() => {
      connect();
      return () => {
        if (wsRef.current) {
          wsRef.current.onclose = null;
          wsRef.current.close();
          wsRef.current = null;
        }
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      };
    }, [connect]);

    return {
      socketStatus,
      registerOnLiveSeshInvite,
      registerOnLiveSeshInviteAccepted,
    };
  }