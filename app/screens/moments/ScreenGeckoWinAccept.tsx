import React, { useCallback, useEffect, useRef } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";

import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import GlassGeckoWinAccept from "../fidget/GlassGeckoWinAccept";
import manualGradientColors from "@/app/styles/StaticColors";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useDecideGeckoGameMatchWinPending from "@/src/hooks/GeckoCalls/useDecideGeckoGameMatchWinPending";
import useDecideGeckoGameWinPending from "@/src/hooks/GeckoCalls/useDecideGeckoGameWinPending";
import useGeckoGameMatchWinPending from "@/src/hooks/GeckoCalls/useGeckoGameMatchWinPending";
import useGeckoGameWinPending from "@/src/hooks/GeckoCalls/useGeckoGameWinPending";
import useConfirmBeforeLeave from "@/src/hooks/useConfirmScreenLeave";

type GeckoWinAcceptRouteParams = {
  pendingId?: number | null;
  oneDirectional?: boolean | null;
};

type GeckoWinAcceptRoute = RouteProp<
  { GeckoWinAccept: GeckoWinAcceptRouteParams },
  "GeckoWinAccept"
>;

// if pendingId is sent to this screen, uses the Gecko match flow
// if not, uses the one sided flow
const ScreenGeckoWinAccept = () => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { navigateBack } = useAppNavigations();

  const route = useRoute<GeckoWinAcceptRoute>();
  const pendingId = route.params?.pendingId ?? null;
  const hasPendingId = !!pendingId;

  const oneDirectional = route.params?.oneDirectional ?? false;

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

  const { decide, isLoading, isSuccess } = useDecideGeckoGameWinPending({userId: user?.id});

  const {
    decide: decideMatch,
    isLoading: isLoadingMatch,
    isSuccess: isSuccessMatch,
  } = useDecideGeckoGameMatchWinPending();

  // BOTH ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  useConfirmBeforeLeave(!!pendingId && !isSuccessMatch && !isSuccess);

  useEffect(() => {
    if (isSuccessMatch || isSuccess) navigateBack();
  }, [isSuccessMatch, isSuccess, navigateBack]);
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleAccept = useCallback(async () => {

   
    if (!user?.id) return;

     console.log('accept pressed!!')

    if (pendingId && !oneDirectional) {
      console.log('sending to match')
      await decideMatch({
        pendingId,
        decision: "accept",
      });
    }

    if (!pendingId && oneDirectional) {
      console.log('sending to one direction')
      await decide(
         "accept",
      );
    }


  }, [pendingId, oneDirectional, user?.id, decideMatch, decide]);

  const handleDecline = useCallback(async () => {
    if (!pendingId || !user?.id) return;

    await decideMatch({
      pendingId,
      decision: "decline",
    });
  }, [pendingId, user?.id, decideMatch, decide]);

  return (
    <>
      <SafeViewFriendStatic
        // friendColorLight={manualGradientColors.lightColor}
        // friendColorDark={manualGradientColors.darkColor}
                friendColorLight={lightDarkTheme.primaryBackground}
        friendColorDark={lightDarkTheme.primaryBackground}
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
        disabled={false}
      />
    </>
  );
};

export default ScreenGeckoWinAccept;
