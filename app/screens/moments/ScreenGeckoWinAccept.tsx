import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";

import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import GlassGeckoWinAccept from "../fidget/GlassGeckoWinAccept";
import manualGradientColors from "@/app/styles/StaticColors";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useDecideGeckoGameMatchWinPending from "@/src/hooks/GeckoCalls/useDecideGeckoGameMatchWinPending";
 import useGeckoGameMatchWinPending from "@/src/hooks/GeckoCalls/useGeckoGameMatchWinPending";
type GeckoWinAcceptRouteParams = {
  pendingId?: number | null;
};

type GeckoWinAcceptRoute = RouteProp<
  { GeckoWinAccept: GeckoWinAcceptRouteParams },
  "GeckoWinAccept"
>;

const ScreenGeckoWinAccept = () => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { navigateBack } = useAppNavigations();

  const route = useRoute<GeckoWinAcceptRoute>();
  const pendingId = route.params?.pendingId ?? null;

  const { geckoGameMatchWinPending } = useGeckoGameMatchWinPending({
    pendingId,
  });

  const senderCapsule = geckoGameMatchWinPending?.sender_capsule ?? null;

  const {
    decideGeckoGameMatchWinPendingAsync,
    decideGeckoGameMatchWinPendingIsPending,
    decideGeckoGameMatchWinPendingIsSuccess,
  } = useDecideGeckoGameMatchWinPending();

  const [triggerClose, setTriggerClose] = useState(0);

  useEffect(() => {
    if (decideGeckoGameMatchWinPendingIsSuccess) {
      setTriggerClose(Date.now());

      const t = setTimeout(() => {
        navigateBack();
      }, 220);

      return () => clearTimeout(t);
    }
  }, [decideGeckoGameMatchWinPendingIsSuccess, navigateBack]);

  const decide = async (decision: "accept" | "decline") => {
    if (!pendingId || !user?.id) return;

    await decideGeckoGameMatchWinPendingAsync({
      pendingId,
      decision,
    });
  };

  return (
    <>
      <SafeViewFriendStatic
        friendColorLight={manualGradientColors.lightColor}
        friendColorDark={manualGradientColors.darkColor}
        useOverlay={false}
        backgroundOverlayColor={lightDarkTheme.primaryBackground}
        style={[{ flex: 1, padding: 10 }]}
      />

      <GlassGeckoWinAccept
        color={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerOverlayBackground}
        borderColor="transparent"
        darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
        senderCapsule={senderCapsule}
        onAccept={() => decide("accept")}
        onDecline={() => decide("decline")}
        triggerClose={triggerClose}
        disabled={!pendingId || decideGeckoGameMatchWinPendingIsPending}
      />
    </>
  );
};

export default ScreenGeckoWinAccept;