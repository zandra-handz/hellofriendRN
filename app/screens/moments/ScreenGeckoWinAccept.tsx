import React, { useEffect, useState } from "react";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import GlassGeckoWinAccept from "../fidget/GlassGeckoWinAccept";
import manualGradientColors from "@/app/styles/StaticColors";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useGeckoGameWinPending from "@/src/hooks/GeckoCalls/useGeckoGameWinPending";
import useDecideGeckoGameWinPending from "@/src/hooks/GeckoCalls/useDecideGeckoGameWinPending";

const ScreenGeckoWinAccept = () => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { navigateBack } = useAppNavigations();

  const { geckoGameWinPending } = useGeckoGameWinPending({ userId: user?.id });

  const { decide, decideGeckoGameWinPendingMutation } =
    useDecideGeckoGameWinPending({ userId: user?.id });

  const [triggerClose, setTriggerClose] = useState(0);

  useEffect(() => {
    if (decideGeckoGameWinPendingMutation.isSuccess) {
      setTriggerClose(Date.now());
      const t = setTimeout(() => navigateBack(), 220);
      return () => clearTimeout(t);
    }
  }, [decideGeckoGameWinPendingMutation.isSuccess, navigateBack]);

  const senderCapsule = geckoGameWinPending?.sender_capsule ?? null;

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
        borderColor={"transparent"}
        darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
        senderCapsule={senderCapsule}
        onAccept={() => decide("accept")}
        onDecline={() => decide("decline")}
        triggerClose={triggerClose}
        disabled={decideGeckoGameWinPendingMutation.isPending}
      />
    </>
  );
};

export default ScreenGeckoWinAccept;
