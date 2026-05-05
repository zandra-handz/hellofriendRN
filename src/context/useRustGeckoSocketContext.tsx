import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useUser from "../hooks/useUser";

type RustMessage = {
  action: string;
  data?: any;
};

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
  held_moments?: number[];
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

type RustGeckoSocketContextValue = {
  isConnected: boolean;
  lastMessage: RustMessage | null;

  connect: () => void;
  disconnect: () => void;
  send: (message: RustMessage) => boolean;

  setFriend: (
    friendId: number,
    friendLightColor?: string | null,
    friendDarkColor?: string | null
  ) => boolean;

  joinLiveSesh: () => boolean;
  leaveLiveSesh: () => boolean;
  requestPeerPresence: () => boolean;

  updateGeckoPosition: (position: [number, number]) => boolean;

  sendHostGeckoPosition: (
    position: [number, number],
    steps?: [number, number][],
    first_fingers?: [number, number][],
    held_moments?: number[],
    moments?: number[][]
  ) => boolean;

  sendGuestGeckoPosition: (
    position: [number, number],
    steps?: [number, number][]
  ) => boolean;

  sendCapsuleProgress: (capsuleId: string, newProgress: number) => boolean;

  registerOnGeckoCoords: (cb: (data: GeckoCoordsMessage) => void) => () => void;
  registerOnHostGeckoCoords: (
    cb: (data: HostGeckoCoordsMessage) => void
  ) => () => void;
  registerOnGuestGeckoCoords: (
    cb: (data: GuestGeckoCoordsMessage) => void
  ) => () => void;
  registerOnPeerPresence: (cb: (data: any) => void) => () => void;
};

const RustGeckoSocketContext =
  createContext<RustGeckoSocketContextValue | null>(null);

const RUST_WS_URL = "wss://badrainbowz.com/ws/gecko-rust-test/";

type Props = {
  children: React.ReactNode;
};

export const RustGeckoSocketProvider = ({ children }: Props) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useUser();

  const onGeckoCoordsRef = useRef<(data: GeckoCoordsMessage) => void>(() => {});
  const onHostGeckoCoordsRef = useRef<(data: HostGeckoCoordsMessage) => void>(
    () => {}
  );
  const onGuestGeckoCoordsRef = useRef<(data: GuestGeckoCoordsMessage) => void>(
    () => {}
  );
  const onPeerPresenceRef = useRef<(data: any) => void>(() => {});

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<RustMessage | null>(null);

  const disconnect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "leave_live_sesh" }));
    }

    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const handleMessage = useCallback((parsed: RustMessage) => {
    console.log("[Rust WS] message:", parsed);

    if (parsed.action === "gecko_coords") {
      onGeckoCoordsRef.current(parsed.data);
      return;
    }

    if (parsed.action === "host_gecko_coords") {
      onHostGeckoCoordsRef.current(parsed.data);
      return;
    }

    if (parsed.action === "guest_gecko_coords") {
      onGuestGeckoCoordsRef.current(parsed.data);
      return;
    }

    if (parsed.action === "peer_presence") {
      onPeerPresenceRef.current(parsed.data);
      return;
    }

    setLastMessage(parsed);
  }, []);

  const connect = useCallback(() => {
    if (!user?.id) {
      console.log("[Rust WS] missing userId");
      return;
    }

    const existing = wsRef.current;
    if (
      existing &&
      (existing.readyState === WebSocket.OPEN ||
        existing.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const ws = new WebSocket(`${RUST_WS_URL}?user_id=${user.id}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[Rust WS] connected");
      setIsConnected(true);

      ws.send(JSON.stringify({ action: "join_live_sesh" }));
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        handleMessage(parsed);
      } catch {
        console.log("[Rust WS] raw message:", event.data);
      }
    };

    ws.onerror = (event) => {
      console.log("[Rust WS] error:", event);
    };

    ws.onclose = (event) => {
      console.log("[Rust WS] closed:", event.code, event.reason);
      setIsConnected(false);

      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    };
  }, [handleMessage, user?.id]);

  const send = useCallback((message: RustMessage) => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log("[Rust WS] not open, cannot send:", message);
      return false;
    }

    ws.send(JSON.stringify(message));
    return true;
  }, []);

  const setFriend = useCallback(
    (
      friendId: number,
      friendLightColor?: string | null,
      friendDarkColor?: string | null
    ) => {
      return send({
        action: "set_friend",
        data: {
          friend_id: friendId,
          friend_light_color: friendLightColor ?? null,
          friend_dark_color: friendDarkColor ?? null,
        },
      });
    },
    [send]
  );

  const joinLiveSesh = useCallback(() => {
    return send({ action: "join_live_sesh" });
  }, [send]);

  const leaveLiveSesh = useCallback(() => {
    return send({ action: "leave_live_sesh" });
  }, [send]);

  const requestPeerPresence = useCallback(() => {
    return send({ action: "request_peer_presence" });
  }, [send]);

  const updateGeckoPosition = useCallback(
    (position: [number, number]) => {
      return send({
        action: "update_gecko_position",
        data: { position },
      });
    },
    [send]
  );

  const sendHostGeckoPosition = useCallback(
    (
      position: [number, number],
      steps: [number, number][] = [],
      first_fingers: [number, number][] = [],
      held_moments: number[] = [],
      moments: number[][] = []
    ) => {
      return send({
        action: "update_host_gecko_position",
        data: {
          position,
          steps,
          steps_len: steps.length,
          first_fingers,
          held_moments,
          held_moments_len: held_moments.length,
          moments,
          moments_len: moments.length,
          timestamp: Date.now(),
        },
      });
    },
    [send]
  );

  const sendGuestGeckoPosition = useCallback(
    (position: [number, number], steps: [number, number][] = []) => {
      return send({
        action: "update_guest_gecko_position",
        data: {
          position,
          steps,
          timestamp: Date.now(),
        },
      });
    },
    [send]
  );

  const sendCapsuleProgress = useCallback(
    (capsuleId: string, newProgress: number) => {
      return send({
        action: "update_capsule_progress",
        data: {
          capsule_id: capsuleId,
          new_progress: newProgress,
          timestamp: Date.now(),
        },
      });
    },
    [send]
  );

  const registerOnGeckoCoords = useCallback(
    (cb: (data: GeckoCoordsMessage) => void) => {
      onGeckoCoordsRef.current = cb;
      return () => {
        if (onGeckoCoordsRef.current === cb) {
          onGeckoCoordsRef.current = () => {};
        }
      };
    },
    []
  );

  const registerOnHostGeckoCoords = useCallback(
    (cb: (data: HostGeckoCoordsMessage) => void) => {
      onHostGeckoCoordsRef.current = cb;
      return () => {
        if (onHostGeckoCoordsRef.current === cb) {
          onHostGeckoCoordsRef.current = () => {};
        }
      };
    },
    []
  );

  const registerOnGuestGeckoCoords = useCallback(
    (cb: (data: GuestGeckoCoordsMessage) => void) => {
      onGuestGeckoCoordsRef.current = cb;
      return () => {
        if (onGuestGeckoCoordsRef.current === cb) {
          onGuestGeckoCoordsRef.current = () => {};
        }
      };
    },
    []
  );

  const registerOnPeerPresence = useCallback((cb: (data: any) => void) => {
    onPeerPresenceRef.current = cb;
    return () => {
      if (onPeerPresenceRef.current === cb) {
        onPeerPresenceRef.current = () => {};
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const value = useMemo(
    () => ({
      isConnected,
      lastMessage,

      connect,
      disconnect,
      send,

      setFriend,
      joinLiveSesh,
      leaveLiveSesh,
      requestPeerPresence,

      updateGeckoPosition,
      sendHostGeckoPosition,
      sendGuestGeckoPosition,
      sendCapsuleProgress,

      registerOnGeckoCoords,
      registerOnHostGeckoCoords,
      registerOnGuestGeckoCoords,
      registerOnPeerPresence,
    }),
    [
      isConnected,
      lastMessage,
      connect,
      disconnect,
      send,
      setFriend,
      joinLiveSesh,
      leaveLiveSesh,
      requestPeerPresence,
      updateGeckoPosition,
      sendHostGeckoPosition,
      sendGuestGeckoPosition,
      sendCapsuleProgress,
      registerOnGeckoCoords,
      registerOnHostGeckoCoords,
      registerOnGuestGeckoCoords,
      registerOnPeerPresence,
    ]
  );

  return (
    <RustGeckoSocketContext.Provider value={value}>
      {children}
    </RustGeckoSocketContext.Provider>
  );
};

export const useRustGeckoSocket = () => {
  const context = useContext(RustGeckoSocketContext);

  if (!context) {
    throw new Error(
      "useRustGeckoSocket must be used inside RustGeckoSocketProvider"
    );
  }

  return context;
};