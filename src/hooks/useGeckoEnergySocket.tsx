// import { useEffect, useRef, useCallback, useState } from "react";
// import * as SecureStore from "expo-secure-store";

// export function useGeckoEnergySocket(friendId: number | null) {
//   const [socketStatus, setSocketStatus] = useState<
//     "connecting" | "connected" | "disconnected"
//   >("connecting");

//   const [liveScoreState, setLiveScoreState] = useState<any>(null);

//   const wsRef = useRef<WebSocket | null>(null);
//   const scoreStateRef = useRef<any>(null);
//   const friendIdRef = useRef(friendId);
//   const onScoreStateRef = useRef<((data: any) => void) | null>(null);
//   const onSyncRef = useRef<(() => void) | null>(null);
//   const pendingActionsRef = useRef<object[]>([]);
//   const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
//     null,
//   );

//   const FLUSH_INTERVAL_MS = 10000;
//   const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   useEffect(() => {
//     friendIdRef.current = friendId;
//   }, [friendId]);

//   const registerOnScoreState = useCallback((cb: (data: any) => void) => {
//     onScoreStateRef.current = cb;
//   }, []);

//   const registerOnSync = useCallback((cb: () => void) => {
//     onSyncRef.current = cb;
//   }, []);

//   const publishScoreState = useCallback((data: any) => {
//     scoreStateRef.current = data;
//     setLiveScoreState(data);
//     onScoreStateRef.current?.(data);
//   }, []);

//   const stopFlushInterval = useCallback(() => {
//     if (flushIntervalRef.current) {
//       clearInterval(flushIntervalRef.current);
//       flushIntervalRef.current = null;
//     }
//   }, []);

//   const flush = useCallback(() => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       console.log("[WS] >>> flush");
//       wsRef.current.send(JSON.stringify({ action: "flush" }));
//     } else {
//       console.log("[WS] flush skipped — socket not open");
//     }
//   }, []);

//   const startFlushInterval = useCallback(() => {
//     stopFlushInterval();

//     flushIntervalRef.current = setInterval(() => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         console.log("[WS] periodic flush triggered");
//         onSyncRef.current?.();
//         flush();
//       }
//     }, FLUSH_INTERVAL_MS);
//   }, [flush, stopFlushInterval]);

//   const connect = useCallback(async () => {
//     console.log("[WS] connect() called");

//     if (wsRef.current) {
//       wsRef.current.onclose = null;
//       wsRef.current.close();
//       wsRef.current = null;
//     }

//     const token = await SecureStore.getItemAsync("accessToken");
//     if (!token) {
//       console.log("[WS] no access token — skipping connection");
//       setSocketStatus("disconnected");
//       return;
//     }

//     setSocketStatus("connecting");
//     console.log("[WS] connecting...");

//     const ws = new WebSocket(
//       `wss://badrainbowz.com/ws/gecko-energy/?token=${token}`,
//     );

//     ws.onopen = () => {
//       console.log("[WS] connected");
//       setSocketStatus("connected");
//       startFlushInterval();

//       if (pendingActionsRef.current.length > 0) {
//         console.log(
//           `[WS] flushing ${pendingActionsRef.current.length} queued actions`,
//         );
//         pendingActionsRef.current.forEach((payload) => {
//           ws.send(
//             JSON.stringify({ action: "update_gecko_data", data: payload }),
//           );
//         });
//         pendingActionsRef.current = [];
//       }
//     };

//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       console.log(
//         `[WS] <<< ${message.action}`,
//         JSON.stringify(message.data).slice(0, 200),
//       );

//       // if (message.action === "score_state") {
//       //   publishScoreState(message.data);
//       // }



// if (message.action === "score_state") {
//   const backendEnergy = message.data?.energy;
//   const frontendEnergy = scoreStateRef.current?.energy;

//   console.log(
//     "[WS ENERGY COMPARE]",
//     JSON.stringify({
//       frontend_energy_before_publish: frontendEnergy,
//       backend_energy: backendEnergy,
//       delta:
//         typeof frontendEnergy === "number" && typeof backendEnergy === "number"
//           ? backendEnergy - frontendEnergy
//           : null,
//       backend_updated_at: message.data?.energy_updated_at,
//       multiplier: message.data?.multiplier,
//       expires_at: message.data?.expires_at,
//     }),
//   );

//   console.log(
//   "[WS BACKEND WINDOW]",
//   JSON.stringify({
//     backend_energy: message.data?.energy,
//     backend_energy_updated_at: message.data?.energy_updated_at,
//     backend_multiplier: message.data?.multiplier,
//     backend_expires_at: message.data?.expires_at,
//     received_at_iso: new Date().toISOString(),
//     received_at_ms: Date.now(),
//   }),
// );

//   publishScoreState(message.data);
// }

//       if (message.action === "flush_ack") {
//         console.log(`[WS] flush ack: ${message.data?.status}`);
//       }
//     };

//     ws.onclose = (event) => {
//       console.log(`[WS] disconnected — code=${event.code} reason=${event.reason}`);
//       setSocketStatus("disconnected");
//       stopFlushInterval();

//       reconnectTimeoutRef.current = setTimeout(() => {
//         console.log("[WS] attempting reconnect...");
//         connect();
//       }, 3000);
//     };

//     ws.onerror = (error) => {
//       console.log("[WS] error", error);
//       ws.close();
//     };

//     wsRef.current = ws;
//   }, [publishScoreState, startFlushInterval, stopFlushInterval]);

//   useEffect(() => {
//     console.log("[WS] hook mounted");
//     connect();

//     return () => {
//       console.log("[WS] hook unmounting — flushing and cleaning up");

//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         wsRef.current.send(JSON.stringify({ action: "flush" }));
//       }

//       if (wsRef.current) {
//         wsRef.current.onclose = null;
//         wsRef.current.close();
//         wsRef.current = null;
//       }

//       stopFlushInterval();

//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, [connect, stopFlushInterval]);

//   const getScoreState = useCallback(() => {
//     console.log("[WS] >>> get_score_state");
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ action: "get_score_state" }));
//     } else {
//       console.log("[WS] get_score_state skipped — socket not open");
//     }
//   }, []);

//   const updateGeckoData = useCallback(
//     (payload: {
//       steps?: number;
//       distance?: number;
//       started_on?: string;
//       ended_on?: string;
//       points_earned?: object[];
//       score_state?: {
//         multiplier?: number;
//         expiration_length?: number;
//       };
//     }) => {
//       const fid = friendIdRef.current;
//       if (fid == null) {
//         console.log("[WS] updateGeckoData skipped — no friendId");
//         return false;
//       }

//       const full = { ...payload, friend_id: fid };

//       console.log(
//         `[WS] >>> update_gecko_data friend=${fid} steps=${payload.steps ?? 0} dist=${payload.distance ?? 0} pts=${payload.points_earned?.length ?? 0} streak=${payload.score_state?.multiplier ?? "-"}`,
//       );

//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         wsRef.current.send(
//           JSON.stringify({ action: "update_gecko_data", data: full }),
//         );
//         return true;
//       } else {
//         console.log("[WS] queued (socket not open)");
//         pendingActionsRef.current.push(full);
//         return false;
//       }
//     },
//     [],
//   );

//   return {
//     socketStatus,
//     scoreStateRef,
//     liveScoreState,
//     getScoreState,
//     updateGeckoData,
//     flush,
//     registerOnScoreState,
//     registerOnSync,
//   };
// }


import { useEffect, useRef, useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";

export function useGeckoEnergySocket(friendId: number | null) {
  const [socketStatus, setSocketStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  const [liveScoreState, setLiveScoreState] = useState<any>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const scoreStateRef = useRef<any>(null);
  const friendIdRef = useRef(friendId);
  const onScoreStateRef = useRef<((data: any) => void) | null>(null);
  const onSyncRef = useRef<(() => void) | null>(null);
  const pendingActionsRef = useRef<object[]>([]);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const hasReceivedInitialScoreStateRef = useRef(false);
  const initialBackendEnergyUpdatedAtRef = useRef<string | null>(null);
  const latestBackendEnergyUpdatedAtRef = useRef<string | null>(null);

  const FLUSH_INTERVAL_MS = 10000;
  const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    friendIdRef.current = friendId;
  }, [friendId]);

  const registerOnScoreState = useCallback((cb: (data: any) => void) => {
    onScoreStateRef.current = cb;
  }, []);

  const registerOnSync = useCallback((cb: () => void) => {
    onSyncRef.current = cb;
  }, []);

  const publishScoreState = useCallback((data: any) => {
    scoreStateRef.current = data;
    setLiveScoreState(data);
    onScoreStateRef.current?.(data);
  }, []);

  const stopFlushInterval = useCallback(() => {
    if (flushIntervalRef.current) {
      clearInterval(flushIntervalRef.current);
      flushIntervalRef.current = null;
    }
  }, []);

  const flush = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("[WS] >>> flush");
      wsRef.current.send(JSON.stringify({ action: "flush" }));
    } else {
      console.log("[WS] flush skipped — socket not open");
    }
  }, []);

  const startFlushInterval = useCallback(() => {
    stopFlushInterval();

    flushIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log("[WS] periodic flush triggered");
        onSyncRef.current?.();
        flush();
      }
    }, FLUSH_INTERVAL_MS);
  }, [flush, stopFlushInterval]);

  const connect = useCallback(async () => {
    console.log("[WS] connect() called");

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      console.log("[WS] no access token — skipping connection");
      setSocketStatus("disconnected");
      return;
    }

    setSocketStatus("connecting");
    console.log("[WS] connecting...");

    const ws = new WebSocket(
      `wss://badrainbowz.com/ws/gecko-energy/?token=${token}`,
    );

    ws.onopen = () => {
      console.log("[WS] connected");
      setSocketStatus("connected");
      startFlushInterval();

      if (pendingActionsRef.current.length > 0) {
        console.log(
          `[WS] flushing ${pendingActionsRef.current.length} queued actions`,
        );
        pendingActionsRef.current.forEach((payload) => {
          ws.send(
            JSON.stringify({ action: "update_gecko_data", data: payload }),
          );
        });
        pendingActionsRef.current = [];
      }
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(
        `[WS] <<< ${message.action}`,
        JSON.stringify(message.data).slice(0, 200),
      );

      if (message.action === "score_state") {
        const backendEnergy = message.data?.energy;
        const frontendEnergy = scoreStateRef.current?.energy;
        const backendEnergyUpdatedAt = message.data?.energy_updated_at ?? null;

        if (
          !hasReceivedInitialScoreStateRef.current &&
          backendEnergyUpdatedAt
        ) {
          hasReceivedInitialScoreStateRef.current = true;
          initialBackendEnergyUpdatedAtRef.current = backendEnergyUpdatedAt;

          console.log(
            "[WS INITIAL BACKEND WINDOW]",
            JSON.stringify({
              initial_backend_energy_updated_at:
                initialBackendEnergyUpdatedAtRef.current,
            }),
          );
        }

        latestBackendEnergyUpdatedAtRef.current = backendEnergyUpdatedAt;

        console.log(
          "[WS ENERGY COMPARE]",
          JSON.stringify({
            frontend_energy_before_publish: frontendEnergy,
            backend_energy: backendEnergy,
            delta:
              typeof frontendEnergy === "number" &&
              typeof backendEnergy === "number"
                ? backendEnergy - frontendEnergy
                : null,
            backend_updated_at: backendEnergyUpdatedAt,
            multiplier: message.data?.multiplier,
            expires_at: message.data?.expires_at,
          }),
        );

        console.log(
          "[WS BACKEND WINDOW]",
          JSON.stringify({
            backend_energy: backendEnergy,
            backend_energy_updated_at: backendEnergyUpdatedAt,
            backend_multiplier: message.data?.multiplier,
            backend_expires_at: message.data?.expires_at,
            received_at_iso: new Date().toISOString(),
            received_at_ms: Date.now(),
          }),
        );

        publishScoreState(message.data);
      }

      if (message.action === "flush_ack") {
        console.log(`[WS] flush ack: ${message.data?.status}`);
      }
    };

    ws.onclose = (event) => {
      console.log(
        `[WS] disconnected — code=${event.code} reason=${event.reason}`,
      );
      setSocketStatus("disconnected");
      stopFlushInterval();

      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("[WS] attempting reconnect...");
        connect();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.log("[WS] error", error);
      ws.close();
    };

    wsRef.current = ws;
  }, [publishScoreState, startFlushInterval, stopFlushInterval]);

  useEffect(() => {
    console.log("[WS] hook mounted");
    connect();

    return () => {
      console.log("[WS] hook unmounting — flushing and cleaning up");

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: "flush" }));
      }

      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }

      stopFlushInterval();

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect, stopFlushInterval]);

  const getScoreState = useCallback(() => {
    console.log("[WS] >>> get_score_state");
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "get_score_state" }));
    } else {
      console.log("[WS] get_score_state skipped — socket not open");
    }
  }, []);

  const updateGeckoData = useCallback(
    (payload: {
      steps?: number;
      distance?: number;
      started_on?: string;
      ended_on?: string;
      points_earned?: object[];
      score_state?: {
        multiplier?: number;
        expiration_length?: number;
      };
    }) => {
      const fid = friendIdRef.current;
      if (fid == null) {
        console.log("[WS] updateGeckoData skipped — no friendId");
        return false;
      }

      const full = { ...payload, friend_id: fid };

      console.log(
        `[WS] >>> update_gecko_data friend=${fid} steps=${payload.steps ?? 0} dist=${payload.distance ?? 0} pts=${payload.points_earned?.length ?? 0} streak=${payload.score_state?.multiplier ?? "-"}`,
      );

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ action: "update_gecko_data", data: full }),
        );
        return true;
      } else {
        console.log("[WS] queued (socket not open)");
        pendingActionsRef.current.push(full);
        return false;
      }
    },
    [],
  );

  return {
    socketStatus,
    scoreStateRef,
    liveScoreState,
    getScoreState,
    updateGeckoData,
    flush,
    registerOnScoreState,
    registerOnSync,
    hasReceivedInitialScoreStateRef,
    initialBackendEnergyUpdatedAtRef,
    latestBackendEnergyUpdatedAtRef,
  };
}