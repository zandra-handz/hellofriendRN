import React, { useCallback, useEffect, useRef } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";

import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import GlassGeckoWinAccept from "../fidget/GlassGeckoWinAccept";
import manualGradientColors from "@/app/styles/StaticColors";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useDecideGeckoGameMatchWinPending from "@/src/hooks/GeckoCalls/useDecideGeckoGameMatchWinPending";
import useGeckoGameMatchWinPending from "@/src/hooks/GeckoCalls/useGeckoGameMatchWinPending";
import useGeckoGameWinPending from "@/src/hooks/GeckoCalls/useGeckoGameWinPending";
import useConfirmBeforeLeave from "@/src/hooks/useConfirmScreenLeave";

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
const hasPendingId = !!pendingId;

const { geckoGameMatchWinPending } = useGeckoGameMatchWinPending({
  pendingId,
});

const { geckoGameWinPending } = useGeckoGameWinPending({
  userId: user?.id,
  disable: hasPendingId,
});

const activePending = hasPendingId
  ? geckoGameMatchWinPending
  : geckoGameWinPending;

const senderCapsule = activePending?.sender_capsule ?? null;
 

  const { decide, isLoading, isSuccess } =
    useDecideGeckoGameMatchWinPending();  


    useConfirmBeforeLeave(!!pendingId && !isSuccess);

  useEffect(() => {
    if (isSuccess) 
 
 
      navigateBack();
   
  }, [isSuccess, navigateBack]);

  const handleAccept = useCallback(async () => {
    if (!pendingId || !user?.id) return;

    await decide({
      pendingId,
      decision: "accept",
    });
  }, [pendingId, user?.id, decide]);

  const handleDecline = useCallback(async () => {
    if (!pendingId || !user?.id) return;

    await decide({
      pendingId,
      decision: "decline",
    });
  }, [pendingId, user?.id, decide]);

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
        onAccept={handleAccept}
        onDecline={handleDecline}
        onBack={navigateBack}
        disabled={!pendingId || isLoading}
      />
    </>
  );
};

export default ScreenGeckoWinAccept;