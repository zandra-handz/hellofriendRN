// src/handlers/NetworkStatusHandler.tsx
import { useEffect } from "react";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

const NetworkStatusHandler = () => {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isOnline === null) return;

    if (isOnline) {
      showFlashMessage("Online", false);
    } else {
      showFlashMessage("No internet connection", false);
    }
  }, [isOnline]);

  return null;
};

export default NetworkStatusHandler;