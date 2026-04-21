import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import notepack from "notepack.io";

type SocketStatus = "connecting" | "connected" | "disconnected";

type GeckoCoordsMessage = {
  from_user: number;
  friend_id?: number;
  position: [number, number];
};

type HostGeckoCoordsMessage = {
  from_user: number;
  friend_id?: number;
  position: [number, number];
  steps?: [number, number][];
  first_fingers?: [number, number][];
  held_moments?: number[] | Float32Array;
  held_moments_len?: number;
  moments?: number[][];
  moments_len?: number;
  timestamp?: number;
};

type GuestGeckoCoordsMessage = {
  from_user: number;
  position: [number, number];
  steps?: [number, number][];
  timestamp?: number;
};

type ScoreState = {
  user?: number;
  total_steps_all_time?: number;
  multiplier?: number;
  expires_at?: string | null;
  updated_on?: string | null;
  base_multiplier?: number;
  energy?: number;
  surplus_energy?: number;
  energy_updated_at?: string | null;
  revives_at?: string | null;
  recharge_per_second?: number;
  streak_recharge_per_second?: number;
  step_fatigue_per_step?: number;
  streak_fatigue_multiplier?: number;
  surplus_cap?: number;
  personality_type?: number;
  personality_type_label?: string;
  memory_type?: number;
  memory_type_label?: string;
  active_hours_type?: number;
  active_hours_type_label?: string;
  story_type?: number;
  story_type_label?: string;
  stamina?: number;
  max_active_hours?: number;
  max_duration_till_revival?: number;
  max_score_multiplier?: number;
  max_streak_length_seconds?: number;
  active_hours?: number[];
  gecko_created_on?: string | null;
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

type PeerGeckoPosition = {
  from_user: number;
  position: [number, number];
  received_at: number;
} | null;

type HostPeerGeckoPosition = {
  from_user: number;
  position: [number, number];
  steps?: [number, number][];
  first_fingers?: [number, number][];
  held_moments?: number[] | Float32Array;
  held_moments_len?: number;
  moments?: number[][];
  moments_len?: number;
  received_at: number;
} | null;

type GuestPeerGeckoPosition = {
  from_user: number;
  position: [number, number];
  steps?: [number, number][];
  received_at: number;
} | null;

type EnergyState = {
  energy: number;
  surplusEnergy: number;
};

type GeckoWebsocketContextValue = {
  socketStatus: SocketStatus;
  socketStatusSV: SharedValue<SocketStatus>;
  isFriendBound: boolean;
  pendingFriendId: number | null;
  boundFriendId: number | null;
  liveScoreState: ScoreState | null;
  scoreStateRef: React.MutableRefObject<ScoreState | null>;
  liveSeshPartnerId: number | null;
  energySV: SharedValue<EnergyState>;
  peerGeckoPositionSV: SharedValue<PeerGeckoPosition>;
  hostPeerGeckoPositionSV: SharedValue<HostPeerGeckoPosition>;
  guestPeerGeckoPositionSV: SharedValue<GuestPeerGeckoPosition>;
  hasReceivedInitialScoreStateRef: React.MutableRefObject<boolean>;
  initialBackendEnergyUpdatedAtRef: React.MutableRefObject<string | null>;
  latestBackendEnergyUpdatedAtRef: React.MutableRefObject<string | null>;
  wsRef: React.MutableRefObject<WebSocket | null>;
  connect: () => Promise<void>;
  disconnect: () => void;
  bindFriend: (friendId: number) => boolean;
  clearFriendBinding: () => boolean;
  flush: () => void;
  sendRaw: (payload: object, options?: { requireFriendBound?: boolean }) => boolean;
  getScoreState: () => boolean;
  getGeckoScreenPosition: () => boolean;
  joinLiveSesh: () => boolean;
  leaveLiveSesh: () => boolean;
  updateGeckoData: (payload: UpdateGeckoDataPayload) => boolean;
  sendGeckoPosition: (position: [number, number], force?: boolean) => boolean;
  sendHostGeckoPosition: (
    position: [number, number],
    steps?: [number, number][],
    first_fingers?: [number, number][],
    held_moments?: Float32Array | number[] | null,
    moments?: {
      id: number;
      coord: [number, number];
      stored_index: number;
    }[],
    force?: boolean,
  ) => boolean;
  sendGuestGeckoPosition: (
    position: [number, number],
    force?: boolean,
  ) => boolean;
  registerOnScoreState: (cb: (data: ScoreState) => void) => void;
  registerOnSync: (cb: () => void) => void;
  registerOnGeckoCoords: (cb: (data: GeckoCoordsMessage) => void) => void;
  registerOnHostGeckoCoords: (cb: (data: HostGeckoCoordsMessage) => void) => void;
  registerOnGuestGeckoCoords: (cb: (data: GuestGeckoCoordsMessage) => void) => void;
  registerOnJoinLiveSesh: (cb: (partnerId: number | null) => void) => void;
  registerOnLeaveLiveSesh: (cb: () => void) => void;
  registerOnLiveSeshCancelled: (cb: (data: any) => void) => void;
};

const GeckoWebsocketContext = createContext<GeckoWebsocketContextValue | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

export const GeckoWebsocketProvider = ({ children }: ProviderProps) => {
  const [socketStatus, setSocketStatus] = useState<SocketStatus>("connecting");
  const [liveScoreState, setLiveScoreState] = useState<ScoreState | null>(null);
  const [liveSeshPartnerId, setLiveSeshPartnerId] = useState<number | null>(null);
  const [isFriendBound, setIsFriendBound] = useState(false);
  const [boundFriendId, setBoundFriendId] = useState<number | null>(null);
  const [pendingFriendId, setPendingFriendId] = useState<number | null>(null);

  const socketStatusSV = useSharedValue<SocketStatus>("disconnected");

  const wsRef = useRef<WebSocket | null>(null);
  const scoreStateRef = useRef<ScoreState | null>(null);
  const pendingFriendIdRef = useRef<number | null>(null);
  const boundFriendIdRef = useRef<number | null>(null);
  const isFriendBoundRef = useRef(false);

  const onScoreStateRef = useRef<((data: ScoreState) => void) | null>(null);
  const onSyncRef = useRef<(() => void) | null>(null);
  const onGeckoCoordsRef = useRef<((data: GeckoCoordsMessage) => void) | null>(null);
  const onHostGeckoCoordsRef = useRef<((data: HostGeckoCoordsMessage) => void) | null>(null);
  const onGuestGeckoCoordsRef = useRef<((data: GuestGeckoCoordsMessage) => void) | null>(null);
  const onJoinLiveSeshRef = useRef<((partnerId: number | null) => void) | null>(null);
  const onLeaveLiveSeshRef = useRef<(() => void) | null>(null);
  const onLiveSeshCancelledRef = useRef<((data: any) => void) | null>(null);

  const peerGeckoPositionSV = useSharedValue<PeerGeckoPosition>(null);
  const hostPeerGeckoPositionSV = useSharedValue<HostPeerGeckoPosition>(null);
  const guestPeerGeckoPositionSV = useSharedValue<GuestPeerGeckoPosition>(null);

  const energySV = useSharedValue<EnergyState>({
    energy: 1.0,
    surplusEnergy: 0.0,
  });

  const pendingDataActionsRef = useRef<UpdateGeckoDataPayload[]>([]);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shouldReconnectRef = useRef(true);

  const hasReceivedInitialScoreStateRef = useRef(false);
  const initialBackendEnergyUpdatedAtRef = useRef<string | null>(null);
  const latestBackendEnergyUpdatedAtRef = useRef<string | null>(null);

  const lastSentGeckoPositionAtRef = useRef(0);
  const lastSentHostGeckoPositionAtRef = useRef(0);
  const lastSentGuestGeckoPositionAtRef = useRef(0);

  const stepsScratchRef = useRef<number[][]>([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
  const firstFingersScratchRef = useRef<number[][]>([
        [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
  const momentsScratchRef = useRef<number[][]>(
    Array.from({ length: 30 }, () => [0, 0, 0, 0]),
  );
  const heldScratchRef = useRef(new Float32Array(8));

  const FLUSH_INTERVAL_MS = 20000;
  const GECKO_POSITION_THROTTLE_MS = 50;

  const registerOnScoreState = useCallback((cb: (data: ScoreState) => void) => {
    onScoreStateRef.current = cb;
  }, []);

  const registerOnSync = useCallback((cb: () => void) => {
    onSyncRef.current = cb;
  }, []);

  const registerOnGeckoCoords = useCallback((cb: (data: GeckoCoordsMessage) => void) => {
    onGeckoCoordsRef.current = cb;
  }, []);

  const registerOnHostGeckoCoords = useCallback(
    (cb: (data: HostGeckoCoordsMessage) => void) => {
      onHostGeckoCoordsRef.current = cb;
    },
    [],
  );

  const registerOnGuestGeckoCoords = useCallback(
    (cb: (data: GuestGeckoCoordsMessage) => void) => {
      onGuestGeckoCoordsRef.current = cb;
    },
    [],
  );

  const registerOnJoinLiveSesh = useCallback(
    (cb: (partnerId: number | null) => void) => {
      onJoinLiveSeshRef.current = cb;
    },
    [],
  );

  const registerOnLeaveLiveSesh = useCallback((cb: () => void) => {
    onLeaveLiveSeshRef.current = cb;
  }, []);

  const registerOnLiveSeshCancelled = useCallback((cb: (data: any) => void) => {
    onLiveSeshCancelledRef.current = cb;
  }, []);

  const publishScoreState = useCallback(
    (data: ScoreState) => {
      scoreStateRef.current = data;
      setLiveScoreState(data);

      energySV.value = {
        energy: data?.energy ?? 1.0,
        surplusEnergy: data?.surplus_energy ?? 0.0,
      };

      onScoreStateRef.current?.(data);
    },
    [energySV],
  );

  const stopFlushInterval = useCallback(() => {
    if (flushIntervalRef.current) {
      clearInterval(flushIntervalRef.current);
      flushIntervalRef.current = null;
    }
  }, []);

  const sendSetFriend = useCallback((fid: number | null) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN || fid == null) {
      return false;
    }

    wsRef.current.send(
      JSON.stringify({
        action: "set_friend",
        data: { friend_id: fid },
      }),
    );
    return true;
  }, []);

  const sendRaw = useCallback(
    (payload: object, options?: { requireFriendBound?: boolean }) => {
      const requireFriendBound = options?.requireFriendBound ?? false;

      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return false;
      }

      if (requireFriendBound && !isFriendBoundRef.current) {
        return false;
      }

      wsRef.current.send(JSON.stringify(payload));
      return true;
    },
    [],
  );

  const flush = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "flush" }));
    }
  }, []);

  const startFlushInterval = useCallback(() => {
    stopFlushInterval();

    flushIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        onSyncRef.current?.();
        flush();
      }
    }, FLUSH_INTERVAL_MS);
  }, [flush, stopFlushInterval]);

  const getScoreState = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      return false;
    }
    wsRef.current.send(JSON.stringify({ action: "get_score_state" }));
    return true;
  }, []);

  const getGeckoScreenPosition = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      return false;
    }
    wsRef.current.send(JSON.stringify({ action: "get_gecko_screen_position" }));
    return true;
  }, []);

  const joinLiveSesh = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
 
      return false;
    }
    wsRef.current.send(JSON.stringify({ action: "join_live_sesh" }));
   
    return true;
  }, []);

  const leaveLiveSesh = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      return false;
    }
    wsRef.current.send(JSON.stringify({ action: "leave_live_sesh" }));
    return true;
  }, []);

  const flushPendingUpdateGeckoData = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN || !isFriendBoundRef.current) {
      return;
    }

    if (pendingDataActionsRef.current.length === 0) {
      return;
    }

    const queued = [...pendingDataActionsRef.current];
    pendingDataActionsRef.current = [];

    queued.forEach((payload) => {
      wsRef.current?.send(
        JSON.stringify({
          action: "update_gecko_data",
          data: payload,
        }),
      );
    });
  }, []);

  const bindFriend = useCallback(
    (friendId: number) => {
      if (
        boundFriendIdRef.current === friendId &&
        isFriendBoundRef.current
      ) {
        return true;
      }

      if (pendingFriendIdRef.current === friendId) {
        return wsRef.current?.readyState === WebSocket.OPEN;
      }

      pendingFriendIdRef.current = friendId;
      setPendingFriendId(friendId);
      isFriendBoundRef.current = false;
      boundFriendIdRef.current = null;
      setIsFriendBound(false);
      setBoundFriendId(null);

      peerGeckoPositionSV.value = null;
      hostPeerGeckoPositionSV.value = null;
      guestPeerGeckoPositionSV.value = null;

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return sendSetFriend(friendId);
      }

      return false;
    },
    [
      guestPeerGeckoPositionSV,
      hostPeerGeckoPositionSV,
      peerGeckoPositionSV,
      sendSetFriend,
    ],
  );

  const clearFriendBinding = useCallback(() => {
    pendingFriendIdRef.current = null;
    setPendingFriendId(null);
    isFriendBoundRef.current = false;
    boundFriendIdRef.current = null;
    setIsFriendBound(false);
    setBoundFriendId(null);

    pendingDataActionsRef.current = [];

    return true;
  }, []);

  const updateGeckoData = useCallback(
    (payload: UpdateGeckoDataPayload) => {
      const fid = boundFriendIdRef.current ?? pendingFriendIdRef.current;
      if (fid == null) {
        console.log("[WS] updateGeckoData skipped — no friend binding");
        return false;
      }

      const full: UpdateGeckoDataPayload & { friend_id: number } = {
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
            : (scoreStateRef.current?.multiplier ?? undefined),
        client_computed_at:
          payload.client_computed_at ?? new Date().toISOString(),
      };

      if (wsRef.current?.readyState === WebSocket.OPEN && isFriendBoundRef.current) {
        wsRef.current.send(
          JSON.stringify({ action: "update_gecko_data", data: full }),
        );
        return true;
      }

      pendingDataActionsRef.current.push(full);
      return false;
    },
    [energySV],
  );

  const sendGeckoPosition = useCallback(
    (position: [number, number], force = false) => {
      const now = Date.now();

      if (!isFriendBoundRef.current) {
        return false;
      }

      if (
        !force &&
        now - lastSentGeckoPositionAtRef.current < GECKO_POSITION_THROTTLE_MS
      ) {
        return false;
      }

      lastSentGeckoPositionAtRef.current = now;

      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return false;
      }

      wsRef.current.send(
        notepack.encode({
          action: "update_gecko_position",
          data: { position },
        }),
      );

      return true;
    },
    [],
  );

  const sendHostGeckoPosition = useCallback(
    (
      position: [number, number],
      steps: [number, number][] = [],
      first_fingers: [number, number][] = [],
      held_moments: Float32Array | number[] | null = null,
      moments: {
        id: number;
        coord: [number, number];
        stored_index: number;
      }[] = [],
      force = false,
    ) => {
      const now = Date.now();

      if (!isFriendBoundRef.current) {
   
        return false;
      }

      if (
        !force &&
        now - lastSentHostGeckoPositionAtRef.current <
          GECKO_POSITION_THROTTLE_MS
      ) {
        return false;
      }

      lastSentHostGeckoPositionAtRef.current = now;

      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return false;
      }

      const stepsScratch = stepsScratchRef.current;
      const stepsLen = Math.min(steps.length, stepsScratch.length);
      for (let i = 0; i < stepsLen; i++) {
        stepsScratch[i][0] = steps[i][0];
        stepsScratch[i][1] = steps[i][1];
      }

      const firstFingersScratch = firstFingersScratchRef.current;
      if (first_fingers) {
        firstFingersScratch[0] = first_fingers[0];
        firstFingersScratch[1] = first_fingers[1];
        firstFingersScratch[2] = first_fingers[2];
        firstFingersScratch[3] = first_fingers[3];
      }

      const momentsScratch = momentsScratchRef.current;
      const momentsLen = Math.min(moments.length, momentsScratch.length);
      for (let i = 0; i < momentsLen; i++) {
        const m = moments[i];
        momentsScratch[i][0] = m.id;
        momentsScratch[i][1] = m.coord[0];
        momentsScratch[i][2] = m.coord[1];
        momentsScratch[i][3] = m.stored_index;
      }

      const heldScratch = heldScratchRef.current;
      const heldLen = 8;
      if (held_moments) {
        const copiedHeldLen = Math.min(held_moments.length, heldScratch.length);
        for (let i = 0; i < copiedHeldLen; i++) {
          heldScratch[i] = held_moments[i];
        }
      }

//       console.log("[WS SEND host position]", {
//   position,
//   stepsLen,
//   momentsLen
// });

      wsRef.current.send(
        notepack.encode({
          action: "update_host_gecko_position",
          data: {
            position,
            steps: stepsScratch,
            steps_len: stepsLen,
            first_fingers: firstFingersScratch,
            held_moments: heldScratch,
            held_moments_len: heldLen,
            moments: momentsScratch,
            moments_len: momentsLen,
            timestamp: now,
          },
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
        now - lastSentGuestGeckoPositionAtRef.current <
          GECKO_POSITION_THROTTLE_MS
      ) {
        return false;
      }

      lastSentGuestGeckoPositionAtRef.current = now;

      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return false;
      }

      wsRef.current.send(
        notepack.encode({
          action: "update_guest_gecko_position",
          data: { position, timestamp: now },
        }),
      );

      return true;
    },
    [],
  );

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnectTimeout();
    stopFlushInterval();

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "flush" }));
      wsRef.current.send(JSON.stringify({ action: "leave_live_sesh" }));
    }

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    setSocketStatus("disconnected");
    socketStatusSV.value = "disconnected";
    isFriendBoundRef.current = false;
    boundFriendIdRef.current = null;
    setIsFriendBound(false);
    setBoundFriendId(null);
    setPendingFriendId(null);
    setLiveSeshPartnerId(null);
    pendingFriendIdRef.current = null;
  }, [clearReconnectTimeout, socketStatusSV, stopFlushInterval]);

  const connect = useCallback(async () => {
    console.log('starting connect..................................................')
    clearReconnectTimeout();

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      setSocketStatus("disconnected");
      socketStatusSV.value = "disconnected";
      return;
    }

    setSocketStatus("connecting");
    socketStatusSV.value = "connecting";
    isFriendBoundRef.current = false;
    boundFriendIdRef.current = null;
    setIsFriendBound(false);
    setBoundFriendId(null);

    const url = `wss://badrainbowz.com/ws/gecko-energy/?token=${token}`;
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {

      setSocketStatus("connected");
      socketStatusSV.value = "connected";
      startFlushInterval();

      const fid = pendingFriendIdRef.current;

      if (fid != null) {
        sendSetFriend(fid);
        console.log('sending friend')
      } else {
        getScoreState();
        getGeckoScreenPosition();
        console.log('join sessionnnn')
       // joinLiveSesh();
      }
    };

    ws.onmessage = (event) => {
      let message: any;

      try {
        if (event.data instanceof ArrayBuffer) {
          message = notepack.decode(new Uint8Array(event.data));
        } else {
          message = JSON.parse(event.data);
        }
      } catch (error) {
        console.log("[WS] failed to decode message", error);
        return;
      }

      if (message.action === "set_friend_ok") {
        const fid = message.data?.friend_id ?? null;
        console.log("[WS] set_friend_ok", fid);
        isFriendBoundRef.current = true;
        boundFriendIdRef.current = fid;
        setIsFriendBound(true);
        setBoundFriendId(fid);
        setPendingFriendId(fid);
        pendingFriendIdRef.current = fid;

        getScoreState();
        getGeckoScreenPosition();
        joinLiveSesh();
        flushPendingUpdateGeckoData();
        return;
      }

      if (message.action === "set_friend_failed") {
        console.log("[WS] set_friend_failed", message.data);
        isFriendBoundRef.current = false;
        boundFriendIdRef.current = null;
        setIsFriendBound(false);
        setBoundFriendId(null);
        return;
      }

      if (message.action === "score_state") {
        const backendEnergyUpdatedAt = message.data?.energy_updated_at ?? null;

        if (
          !hasReceivedInitialScoreStateRef.current &&
          backendEnergyUpdatedAt
        ) {
          hasReceivedInitialScoreStateRef.current = true;
          initialBackendEnergyUpdatedAtRef.current = backendEnergyUpdatedAt;
        }

        latestBackendEnergyUpdatedAtRef.current = backendEnergyUpdatedAt;
        publishScoreState(message.data);
        return;
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
        return;
      }

      if (message.action === "host_gecko_coords") {
        if (
          Array.isArray(message.data?.position) &&
          message.data.position.length === 2
        ) {
          hostPeerGeckoPositionSV.value = {
            from_user: message.data.from_user,
            position: message.data.position,
            steps: message.data.steps,
            first_fingers: message.data.first_fingers,
            held_moments: message.data.held_moments,
            held_moments_len: message.data.held_moments_len,
            moments: message.data.moments,
            moments_len: message.data.moments_len,
            received_at: performance.now(),
          };
          onHostGeckoCoordsRef.current?.(message.data);
        }
        return;
      }

      if (message.action === "guest_gecko_coords") {
        if (
          Array.isArray(message.data?.position) &&
          message.data.position.length === 2
        ) {
          guestPeerGeckoPositionSV.value = {
            from_user: message.data.from_user,
            position: message.data.position,
            steps: message.data.steps,
            received_at: performance.now(),
          };
          onGuestGeckoCoordsRef.current?.(message.data);
        }
        return;
      }

      if (message.action === "join_live_sesh_ok") {
        const partnerId = message.data?.partner_id ?? null;
        setLiveSeshPartnerId(partnerId);
        onJoinLiveSeshRef.current?.(partnerId);
        return;
      }

      if (message.action === "join_live_sesh_failed") {
        setLiveSeshPartnerId(null);
        onJoinLiveSeshRef.current?.(null);
        return;
      }

      if (message.action === "leave_live_sesh_ok") {
        setLiveSeshPartnerId(null);
        onLeaveLiveSeshRef.current?.();
        return;
      }

      if (message.action === "live_sesh_cancelled") {
        onLiveSeshCancelledRef.current?.(message.data ?? {});
        return;
      }
    };

    ws.onclose = (event) => {
      setSocketStatus("disconnected");
      socketStatusSV.value = "disconnected";
      stopFlushInterval();
      isFriendBoundRef.current = false;
      boundFriendIdRef.current = null;
      setIsFriendBound(false);
      setBoundFriendId(null);

      if (shouldReconnectRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      }

      console.log(
        `[WS] disconnected — code=${event.code} reason=${event.reason}`,
      );
    };

    ws.onerror = (error) => {
      console.log("[WS] error", error);
      ws.close();
    };

    wsRef.current = ws;
  }, [
    clearReconnectTimeout,
    flushPendingUpdateGeckoData,
    getGeckoScreenPosition,
    getScoreState,
    joinLiveSesh,
    publishScoreState,
    sendSetFriend,
    socketStatusSV,
    startFlushInterval,
    stopFlushInterval,
  ]);

  // useEffect(() => {
  //   shouldReconnectRef.current = true;
  //   connect();

  //   return () => {
  //     disconnect();
  //   };
  // }, [connect, disconnect]);

  useEffect(() => {
    if (isFriendBound) {
      flushPendingUpdateGeckoData();
    }
  }, [flushPendingUpdateGeckoData, isFriendBound]);

  const value = useMemo<GeckoWebsocketContextValue>(
    () => ({
      socketStatus,
      socketStatusSV,
      isFriendBound,
      pendingFriendId,
      boundFriendId,
      liveScoreState,
      scoreStateRef,
      liveSeshPartnerId,
      energySV,
      peerGeckoPositionSV,
      hostPeerGeckoPositionSV,
      guestPeerGeckoPositionSV,
      hasReceivedInitialScoreStateRef,
      initialBackendEnergyUpdatedAtRef,
      latestBackendEnergyUpdatedAtRef,
      wsRef,
      connect,
      disconnect,
      bindFriend,
      clearFriendBinding,
      flush,
      sendRaw,
      getScoreState,
      getGeckoScreenPosition,
      joinLiveSesh,
      leaveLiveSesh,
      updateGeckoData,
      sendGeckoPosition,
      sendHostGeckoPosition,
      sendGuestGeckoPosition,
      registerOnScoreState,
      registerOnSync,
      registerOnGeckoCoords,
      registerOnHostGeckoCoords,
      registerOnGuestGeckoCoords,
      registerOnJoinLiveSesh,
      registerOnLeaveLiveSesh,
      registerOnLiveSeshCancelled,
    }),
    [
      bindFriend,
      boundFriendId,
      clearFriendBinding,
      connect,
      disconnect,
      energySV,
      flush,
      getGeckoScreenPosition,
      getScoreState,
      guestPeerGeckoPositionSV,
      hostPeerGeckoPositionSV,
      isFriendBound,
      joinLiveSesh,
      leaveLiveSesh,
      liveScoreState,
      liveSeshPartnerId,
      peerGeckoPositionSV,
      pendingFriendId,
      registerOnGeckoCoords,
      registerOnGuestGeckoCoords,
      registerOnHostGeckoCoords,
      registerOnJoinLiveSesh,
      registerOnLeaveLiveSesh,
      registerOnLiveSeshCancelled,
      registerOnScoreState,
      registerOnSync,
      sendGeckoPosition,
      sendGuestGeckoPosition,
      sendHostGeckoPosition,
      sendRaw,
      socketStatus,
      socketStatusSV,
      updateGeckoData,
    ],
  );

  return (
    <GeckoWebsocketContext.Provider value={value}>
      {children}
    </GeckoWebsocketContext.Provider>
  );
};

export const useGeckoWebsocket = () => {
  const ctx = useContext(GeckoWebsocketContext);
  if (!ctx) {
    throw new Error("useGeckoWebsocket must be used inside GeckoWebsocketProvider");
  }
  return ctx;
};