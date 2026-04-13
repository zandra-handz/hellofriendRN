
import { useEffect, useRef, useCallback, useState } from "react";
  import { useSharedValue } from "react-native-reanimated";
  import * as SecureStore from "expo-secure-store";                                                                                                                                                                                                  
                                                                                                                                                                                                                                                       type GeckoCoordsMessage = {                                                                                                                                                                                                                        
    from_user: number;                                                                                                                                                                                                                               
    position: [number, number];
  };

  type UpdateGeckoDataPayload = {
    event_type?: string;
    steps?: number;
    distance?: number;
    started_on?: string;
    ended_on?: string;
    points_earned?: object[];
    score_state?: {
      multiplier?: number;
      expiration_length?: number;
    };
    client_energy?: number;
    client_surplus_energy?: number;
    client_multiplier?: number;
    client_computed_at?: string;
    client_fatigue?: number;
    client_recharge?: number;
  };

  export function useGeckoEnergySocket(friendId: number | null) {
    const [socketStatus, setSocketStatus] = useState<
      "connecting" | "connected" | "disconnected"
    >("connecting");

    const [liveScoreState, setLiveScoreState] = useState<any>(null);
    const [liveSeshPartnerId, setLiveSeshPartnerId] = useState<number | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const scoreStateRef = useRef<any>(null);
    const friendIdRef = useRef(friendId);
    const onScoreStateRef = useRef<((data: any) => void) | null>(null);
    const onSyncRef = useRef<(() => void) | null>(null);
    const onGeckoCoordsRef = useRef<((data: GeckoCoordsMessage) => void) | null>(
      null,
    );
    const onHostGeckoCoordsRef = useRef<
      ((data: GeckoCoordsMessage) => void) | null
    >(null);
    const onGuestGeckoCoordsRef = useRef<
      ((data: GeckoCoordsMessage) => void) | null
    >(null);
    const onJoinLiveSeshRef = useRef<((partnerId: number | null) => void) | null>(
      null,
    );
    const onLeaveLiveSeshRef = useRef<(() => void) | null>(null);

    const peerGeckoPositionSV = useSharedValue<{
      from_user: number;
      position: [number, number];
      received_at: number;
    } | null>(null);

    const hostPeerGeckoPositionSV = useSharedValue<{
      from_user: number;
      position: [number, number];
      received_at: number;
    } | null>(null);

    const guestPeerGeckoPositionSV = useSharedValue<{
      from_user: number;
      position: [number, number];
      received_at: number;
    } | null>(null);

    const energySV = useSharedValue({
      energy: 1.0,
      surplusEnergy: 0.0,
    });

    const pendingActionsRef = useRef<object[]>([]);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hasReceivedInitialScoreStateRef = useRef(false);
    const initialBackendEnergyUpdatedAtRef = useRef<string | null>(null);
    const latestBackendEnergyUpdatedAtRef = useRef<string | null>(null);

    const lastSentGeckoPositionAtRef = useRef(0);
    const lastSentHostGeckoPositionAtRef = useRef(0);
    const lastSentGuestGeckoPositionAtRef = useRef(0);

    const FLUSH_INTERVAL_MS = 10000;
    const GECKO_POSITION_THROTTLE_MS = 50;

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

    const registerOnGeckoCoords = useCallback((cb: (data: GeckoCoordsMessage) => void) => {
      onGeckoCoordsRef.current = cb;
    }, []);

    const registerOnHostGeckoCoords = useCallback(
      (cb: (data: GeckoCoordsMessage) => void) => {
        onHostGeckoCoordsRef.current = cb;
      },
      [],
    );

    const registerOnGuestGeckoCoords = useCallback(
      (cb: (data: GeckoCoordsMessage) => void) => {
        onGuestGeckoCoordsRef.current = cb;
      },
      [],
    );

    const registerOnJoinLiveSesh = useCallback((cb: (partnerId: number | null) => void) => {
      onJoinLiveSeshRef.current = cb;
    }, []);

    const registerOnLeaveLiveSesh = useCallback((cb: () => void) => {
      onLeaveLiveSeshRef.current = cb;
    }, []);

    const publishScoreState = useCallback((data: any) => {
      scoreStateRef.current = data;
      setLiveScoreState(data);

      energySV.value = {
        energy: data?.energy ?? 1.0,
        surplusEnergy: data?.surplus_energy ?? 0.0,
      };

      onScoreStateRef.current?.(data);
    }, []);

    const stopFlushInterval = useCallback(() => {
      if (flushIntervalRef.current) {
        clearInterval(flushIntervalRef.current);
        flushIntervalRef.current = null;
      }
    }, []);

    const sendRaw = useCallback((payload: object) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
        return true;
      }
      return false;
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

    const getScoreState = useCallback(() => {
      console.log("[WS] >>> get_score_state");
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: "get_score_state" }));
      } else {
        console.log("[WS] get_score_state skipped — socket not open");
      }
    }, []);

    const getGeckoScreenPosition = useCallback(() => {
      console.log("[WS] >>> get_gecko_screen_position");
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ action: "get_gecko_screen_position" }),
        );
      } else {
        console.log("[WS] get_gecko_screen_position skipped — socket not open");
      }
    }, []);

    const joinLiveSesh = useCallback(() => {
      console.log("[WS] >>> join_live_sesh");
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: "join_live_sesh" }));
        return true;
      }
      console.log("[WS] join_live_sesh skipped — socket not open");
      return false;
    }, []);

    const leaveLiveSesh = useCallback(() => {
      console.log("[WS] >>> leave_live_sesh");
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: "leave_live_sesh" }));
        return true;
      }
      console.log("[WS] leave_live_sesh skipped — socket not open");
      return false;
    }, []);

    const updateGeckoData = useCallback((payload: UpdateGeckoDataPayload) => {
      const fid = friendIdRef.current;
      if (fid == null) {
        console.log("[WS] updateGeckoData skipped — no friendId");
        return false;
      }

      const full = {
        ...payload,
        friend_id: fid,
        client_energy:
          typeof payload.client_energy === "number"
            ? payload.client_energy
            : energySV.value.energy,
        client_surplus_energy:
          typeof payload.client_surplus_energy === "number"
            ? payload.client_surplus_energy
            : energySV.value.surplusEnergy,
        client_multiplier:
          typeof payload.client_multiplier === "number"
            ? payload.client_multiplier
            : scoreStateRef.current?.multiplier ?? null,
        client_computed_at: payload.client_computed_at ?? new Date().toISOString(),
      };

      console.log(
        `[WS] >>> update_gecko_data friend=${fid} steps=${payload.steps ?? 0} dist=${payload.distance ?? 0} pts=${payload.points_earned?.length ?? 0} streak=${payload.score_state?.multiplier ?? "-"}`
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
    }, []);

    const sendGeckoPosition = useCallback((position: [number, number], force = false) => {
      const now = Date.now();

      if (!force && now - lastSentGeckoPositionAtRef.current < GECKO_POSITION_THROTTLE_MS) {
        return false;
      }

      lastSentGeckoPositionAtRef.current = now;

      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return false;
      }

      wsRef.current.send(
        JSON.stringify({
          action: "update_gecko_position",
          data: { position },
        }),
      );

      return true;
    }, []);

    const sendHostGeckoPosition = useCallback(
      (position: [number, number], force = false) => { 
        const now = Date.now();

        if (
          !force &&
          now - lastSentHostGeckoPositionAtRef.current < GECKO_POSITION_THROTTLE_MS
        ) {
          return false;
        }

        lastSentHostGeckoPositionAtRef.current = now;

        if (wsRef.current?.readyState !== WebSocket.OPEN) {
          return false;
        }

        wsRef.current.send(
          JSON.stringify({
            action: "update_host_gecko_position",
            data: { position },
          }),
        );

        return true;
      },
      [],
    );

    const sendGuestGeckoPosition = useCallback(
      (position: [number, number], force = false) => {
        const now = Date.now();

        if (
          !force &&
          now - lastSentGuestGeckoPositionAtRef.current < GECKO_POSITION_THROTTLE_MS
        ) {
          return false;
        }

        lastSentGuestGeckoPositionAtRef.current = now;

        if (wsRef.current?.readyState !== WebSocket.OPEN) {
          return false;
        }

        wsRef.current.send(
          JSON.stringify({
            action: "update_guest_gecko_position",
            data: { position },
          }),
        );

        return true;
      },
      [],
    );

    const connect = useCallback(async () => {
      console.log("[WS] connect() called");

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

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

      // if selectedFriend {ScreenGecko) pass that in the param, otherwise (ScreenSecretGecko) don't
      // backend: host can only connect if their friend id matches what's on the session
      // this way guest doesn't see notes that aren't meant for them
      const fid = friendIdRef.current;                                                                                                                                                                                                                                                                                        const url = fid != null                                                                                                                                                                                                                                                                                                   ? `wss://badrainbowz.com/ws/gecko-energy/?token=${token}&friend_id=${fid}`                                                                                                                                                                                                                                          
        : `wss://badrainbowz.com/ws/gecko-energy/?token=${token}`;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
      const ws = new WebSocket(url);        
      ws.onopen = () => {
        console.log("[WS] connected");
        setSocketStatus("connected");
        startFlushInterval();

        getScoreState();
        getGeckoScreenPosition();
        joinLiveSesh();

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

        if (
          message.action !== "gecko_coords" &&
          message.action !== "host_gecko_coords" &&
          message.action !== "guest_gecko_coords"
        ) {
          console.log(
            `[WS] <<< ${message.action}`,
            JSON.stringify(message.data).slice(0, 200),
          );
        }

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

        if (message.action === "gecko_coords") {
          if (
            Array.isArray(message.data?.position) &&
            message.data.position.length === 2
          ) {
            peerGeckoPositionSV.value = {
              from_user: message.data.from_user,
              position: message.data.position,
              received_at: performance.now(),
            };
            onGeckoCoordsRef.current?.(message.data);
          }
        }

        if (message.action === "host_gecko_coords") {
          if (
            Array.isArray(message.data?.position) &&
            message.data.position.length === 2
          ) {
            hostPeerGeckoPositionSV.value = {
              from_user: message.data.from_user,
              position: message.data.position,
              received_at: performance.now(),
            };
            onHostGeckoCoordsRef.current?.(message.data);
          }
        }

        if (message.action === "guest_gecko_coords") {
          if (
            Array.isArray(message.data?.position) &&
            message.data.position.length === 2
          ) {
            guestPeerGeckoPositionSV.value = {
              from_user: message.data.from_user,
              position: message.data.position,
              received_at: performance.now(),
            };
            onGuestGeckoCoordsRef.current?.(message.data);
          }
        }

        if (message.action === "join_live_sesh_ok") {
          const partnerId = message.data?.partner_id ?? null;
          setLiveSeshPartnerId(partnerId);
          onJoinLiveSeshRef.current?.(partnerId);
        }

        if (message.action === "join_live_sesh_failed") {
          setLiveSeshPartnerId(null);
          onJoinLiveSeshRef.current?.(null);
        }

        if (message.action === "leave_live_sesh_ok") {
          setLiveSeshPartnerId(null);
          onLeaveLiveSeshRef.current?.();
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
    }, [
      getScoreState,
      getGeckoScreenPosition,
      joinLiveSesh,
      publishScoreState,
      startFlushInterval,
      stopFlushInterval,
    ]);

    useEffect(() => {
      console.log("[WS] hook mounted");
      connect();

      return () => {
        console.log("[WS] hook unmounting — flushing and cleaning up");

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ action: "flush" }));
          wsRef.current.send(JSON.stringify({ action: "leave_live_sesh" }));
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

    return {
      socketStatus,
      scoreStateRef,
      liveScoreState,
      liveSeshPartnerId,
      energySV,
      getScoreState,
      getGeckoScreenPosition,
      joinLiveSesh,
      leaveLiveSesh,
      updateGeckoData,
      sendGeckoPosition,
      sendHostGeckoPosition,
      sendGuestGeckoPosition,
      flush,
      registerOnScoreState,
      registerOnSync,
      registerOnGeckoCoords,
      registerOnHostGeckoCoords,
      registerOnGuestGeckoCoords,
      registerOnJoinLiveSesh,
      registerOnLeaveLiveSesh,
      peerGeckoPositionSV,
      hostPeerGeckoPositionSV,
      guestPeerGeckoPositionSV,
      hasReceivedInitialScoreStateRef,
      initialBackendEnergyUpdatedAtRef,
      latestBackendEnergyUpdatedAtRef,
      wsRef,
      sendRaw,
    };
  }