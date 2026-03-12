// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type NetworkStatus = {
  isConnected: boolean | null;      // has a network interface
  isInternetReachable: boolean | null; // actually reaching the internet
  isOnline: boolean | null;         // both true — the one you usually want
  connectionType: string | null;    // 'wifi' | 'cellular' | 'none' | etc
};

const INITIAL_STATE: NetworkStatus = {
  isConnected: null,
  isInternetReachable: null,
  isOnline: null,
  connectionType: null,
};

const parseState = (state: NetInfoState): NetworkStatus => ({
  isConnected: state.isConnected,
  isInternetReachable: state.isInternetReachable ?? null,
  isOnline: !!(state.isConnected && state.isInternetReachable),
  connectionType: state.type ?? null,
});

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>(INITIAL_STATE);

  useEffect(() => {
    // fetch immediately rather than waiting for first change event
    NetInfo.fetch().then(state => setStatus(parseState(state)));

    const unsubscribe = NetInfo.addEventListener(state => {
      setStatus(parseState(state));
    });

    return () => unsubscribe();
  }, []);

  return status;
};