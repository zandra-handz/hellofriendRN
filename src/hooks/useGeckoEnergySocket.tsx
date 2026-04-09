// // hooks/useGeckoEnergySocket.ts  
// import { useEffect, useRef, useCallback, useState } from 'react';
//   import { showFlashMessage } from "../utils/ShowFlashMessage";                                                                                                         
//   import * as SecureStore from 'expo-secure-store';                                                                                                                                                                                                                                                                                                       function computeLocalEnergy(                                                                                                                                              
//     baseEnergy: number,                                                                                                                                                         ratePerSecond: number,
//     elapsedMs: number,                                                                                                                                                      
//     max: number,  
//   ): number {
//     const delta = ratePerSecond * (elapsedMs / 1000);
//     return Math.max(0, Math.min(max, baseEnergy + delta));
//   }

//   export function useGeckoEnergySocket() {
//     const [socketStatus, setSocketStatus] = useState<
//       'connecting' | 'connected' | 'disconnected'
//     >('connecting');

//     const wsRef = useRef<WebSocket | null>(null);
//     const scoreStateRef = useRef<any>(null);
//     const onScoreStateRef = useRef<((data: any) => void) | null>(null);
//     const onSyncRef = useRef<(() => void) | null>(null);
//     const pendingActionsRef = useRef<object[]>([]);
//     const localTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//     const gameTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
//     const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//     // How often the front end recomputes energy locally while connected (ms)
//     const GAME_TICK_MS = 100;
//     // How often to sync with the server (ms)
//     const SERVER_SYNC_MS = 5000;

//     const registerOnScoreState = useCallback((cb: (data: any) => void) => {
//       onScoreStateRef.current = cb;
//     }, []);

//     const registerOnSync = useCallback((cb: () => void) => {
//       onSyncRef.current = cb;
//     }, []);

//     const stopLocalTick = useCallback(() => {
//       if (localTimerRef.current) {
//         clearInterval(localTimerRef.current);
//         localTimerRef.current = null;
//       }
//     }, []);

//     const stopGameTick = useCallback(() => {
//       if (gameTickRef.current) {
//         clearInterval(gameTickRef.current);
//         gameTickRef.current = null;
//       }
//     }, []);

//     // Runs while connected: recomputes energy locally at GAME_TICK_MS
//     // and syncs with server at SERVER_SYNC_MS
//     const startGameTick = useCallback(() => {
//       stopGameTick();
//       const state = scoreStateRef.current;
//       if (!state) return;

//       let baseEnergy = state.energy;
//       let rate = state.recharge_per_second;
//       let baseTime = Date.now();
//       let lastSyncTime = Date.now();

//       gameTickRef.current = setInterval(() => {
//         const now = Date.now();
//         const elapsed = now - baseTime;
//         const estimated = computeLocalEnergy(baseEnergy, rate, elapsed, 1.0);
//         onScoreStateRef.current?.({ ...scoreStateRef.current, energy: estimated });

//         // Periodic server sync + front-end save
//         if (now - lastSyncTime >= SERVER_SYNC_MS) {
//           lastSyncTime = now;
//           onSyncRef.current?.();
//           if (wsRef.current?.readyState === WebSocket.OPEN) {
//             wsRef.current.send(JSON.stringify({ action: 'get_score_state' }));
//           }
//         }
//       }, GAME_TICK_MS);
//     }, []);

//     const startLocalTick = useCallback(() => {
//       stopLocalTick();
//       const state = scoreStateRef.current;
//       if (!state) return;

//       const baseEnergy = state.energy;
//       const rate = state.recharge_per_second;
//       const baseTime = Date.now();

//       localTimerRef.current = setInterval(() => {
//         const elapsed = Date.now() - baseTime;
//         const estimated = computeLocalEnergy(baseEnergy, rate, elapsed, 1.0);
//         onScoreStateRef.current?.({ ...scoreStateRef.current, energy: estimated });
//       }, 100);
//     }, []);

//     const connect = useCallback(async () => {
//       console.log('[useGeckoEnergySocket] connect() called');
//       if (wsRef.current) {
//         wsRef.current.onclose = null;
//         wsRef.current.close();
//         wsRef.current = null;
//       }
//       const token = await SecureStore.getItemAsync('accessToken');
//       if (!token) {
//         console.log('No access token, skipping WebSocqhket connection');
//         setSocketStatus('disconnected');
//         return;
//       }

//       setSocketStatus('connecting');

//       const ws = new WebSocket(
//         `wss://badrainbowz.com/ws/gecko-energy/?token=${token}`
//       );

//       ws.onopen = () => {
//         console.log('WebSocket connected!');
//         setSocketStatus('connected');
//         stopLocalTick(); // stop offline tick, game tick starts when first score_state arrives

//         // Request initial score state
//         ws.send(JSON.stringify({ action: 'get_score_state' }));

//         // Flush any queued actions
//         pendingActionsRef.current.forEach((fields) => {
//           ws.send(
//             JSON.stringify({ action: 'update_score_state', data: fields })
//           );
//         });
//         pendingActionsRef.current = [];
//       };

//       ws.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         console.log('[useGeckoEnergySocket] message received', message.action, message.data);

//         if (message.action === 'score_state') {
//           // DEBUG flash
//           // showFlashMessage(`WS RECV energy=${message.data.energy?.toFixed(4)} t=${message.data.energy_updated_at}`, false, 2000);
         
         
//           scoreStateRef.current = message.data;
//           onScoreStateRef.current?.(message.data);
//           // Restart game tick with fresh server data so local estimation stays in sync
//           startGameTick();
//         }
//       };

//       ws.onclose = () => {
//         console.log('WebSocket disconnected');
//         setSocketStatus('disconnected');
//         stopGameTick();
//         startLocalTick();

//         // Reconnect after 3 seconds
//         reconnectTimeoutRef.current = setTimeout(() => {
//           connect();
//         }, 3000);
//       };

//       ws.onerror = () => {
//         ws.close();
//       };

//       wsRef.current = ws;
//     }, []);

//     useEffect(() => {
//       console.log('[useGeckoEnergySocket] mount effect fired');
//       connect();

//       return () => {
//         if (wsRef.current) {
//           wsRef.current.onclose = null;
//           wsRef.current.close();
//           wsRef.current = null;
//         }
//         stopLocalTick();
//         stopGameTick();
//         if (reconnectTimeoutRef.current) {
//           clearTimeout(reconnectTimeoutRef.current);
//         }
//       };
//     }, []);

//     const getScoreState = useCallback(() => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         wsRef.current.send(JSON.stringify({ action: 'get_score_state' }));
//       }
//     }, []);

//     const updateScoreState = useCallback((fields: object) => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         console.log('updating socket `````````````````````````')
//         // DEBUG flash
//         showFlashMessage(`WS SEND ${JSON.stringify(fields).slice(0, 80)}`, false, 2000);
//         wsRef.current.send(
//           JSON.stringify({ action: 'update_score_state', data: fields })
//         );
//       } else {
//         pendingActionsRef.current.push(fields);
//       }
//     }, []);

//     return {
//       socketStatus,
//       scoreStateRef,
//       getScoreState,
//       updateScoreState,
//       registerOnScoreState,
//       registerOnSync,
//     };
//   }


import { useEffect, useRef, useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";

function computeLocalEnergy(
  baseEnergy: number,
  ratePerSecond: number,
  elapsedMs: number,
  max: number,
): number {
  const delta = ratePerSecond * (elapsedMs / 1000);
  return Math.max(0, Math.min(max, baseEnergy + delta));
}

export function useGeckoEnergySocket() {
  const [socketStatus, setSocketStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  // NEW: reactive state for anything that actually needs rerenders
  const [liveScoreState, setLiveScoreState] = useState<any>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const scoreStateRef = useRef<any>(null);
  const onScoreStateRef = useRef<((data: any) => void) | null>(null);
  const onSyncRef = useRef<(() => void) | null>(null);
  const pendingActionsRef = useRef<object[]>([]);
  const localTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const GAME_TICK_MS = 100;
  const SERVER_SYNC_MS = 5000;

  const registerOnScoreState = useCallback((cb: (data: any) => void) => {
    onScoreStateRef.current = cb;
  }, []);

  const registerOnSync = useCallback((cb: () => void) => {
    onSyncRef.current = cb;
  }, []);

  const stopLocalTick = useCallback(() => {
    if (localTimerRef.current) {
      clearInterval(localTimerRef.current);
      localTimerRef.current = null;
    }
  }, []);

  const stopGameTick = useCallback(() => {
    if (gameTickRef.current) {
      clearInterval(gameTickRef.current);
      gameTickRef.current = null;
    }
  }, []);

  const publishScoreState = useCallback((data: any) => {
    scoreStateRef.current = data;
    setLiveScoreState(data);
    onScoreStateRef.current?.(data);
  }, []);

  const startGameTick = useCallback(() => {
    stopGameTick();

    const state = scoreStateRef.current;
    if (!state) return;

    let baseEnergy = state.energy ?? 0;
    let rate = state.recharge_per_second ?? 0;
    let baseTime = Date.now();
    let lastSyncTime = Date.now();

    gameTickRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - baseTime;

      const latest = scoreStateRef.current ?? {};
      const estimated = computeLocalEnergy(baseEnergy, rate, elapsed, 1.0);

      publishScoreState({
        ...latest,
        energy: estimated,
      });

      if (now - lastSyncTime >= SERVER_SYNC_MS) {
        lastSyncTime = now;
        onSyncRef.current?.();

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ action: "get_score_state" }));
        }
      }
    }, GAME_TICK_MS);
  }, [publishScoreState, stopGameTick]);

  const startLocalTick = useCallback(() => {
    stopLocalTick();

    const state = scoreStateRef.current;
    if (!state) return;

    const baseEnergy = state.energy ?? 0;
    const rate = state.recharge_per_second ?? 0;
    const baseTime = Date.now();

    localTimerRef.current = setInterval(() => {
      const latest = scoreStateRef.current ?? {};
      const elapsed = Date.now() - baseTime;
      const estimated = computeLocalEnergy(baseEnergy, rate, elapsed, 1.0);

      publishScoreState({
        ...latest,
        energy: estimated,
      });
    }, GAME_TICK_MS);
  }, [publishScoreState, stopLocalTick]);

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
      `wss://badrainbowz.com/ws/gecko-energy/?token=${token}`,
    );

    ws.onopen = () => {
      setSocketStatus("connected");
      stopLocalTick();

      ws.send(JSON.stringify({ action: "get_score_state" }));

      pendingActionsRef.current.forEach((fields) => {
        ws.send(JSON.stringify({ action: "update_score_state", data: fields }));
      });
      pendingActionsRef.current = [];
    };

let lastEnergy = null;

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.action === "score_state") {
    const energy = message.data?.energy;

    if (energy !== lastEnergy) {
      console.log(
        `[WS] energy=${energy?.toFixed(6)} Δ=${lastEnergy != null ? (energy - lastEnergy).toFixed(6) : "init"}`
      );
      lastEnergy = energy;
    }

    publishScoreState(message.data);
    startGameTick();
  }
};

    ws.onclose = () => {
      setSocketStatus("disconnected");
      stopGameTick();
      startLocalTick();

      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, [publishScoreState, startGameTick, startLocalTick, stopGameTick, stopLocalTick]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }

      stopLocalTick();
      stopGameTick();

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect, stopGameTick, stopLocalTick]);

  const getScoreState = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "get_score_state" }));
    }
  }, []);

  const updateScoreState = useCallback((fields: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: "update_score_state", data: fields }),
      );
      return true;
    } else {
      pendingActionsRef.current.push(fields);
      return false;
    }
  }, []);

  return {
    socketStatus,
    scoreStateRef,
    liveScoreState,
    getScoreState,
    updateScoreState,
    registerOnScoreState,
    registerOnSync,
  };
}