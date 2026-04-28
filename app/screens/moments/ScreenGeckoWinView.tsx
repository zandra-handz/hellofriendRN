import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";

import { useLDTheme } from "@/src/context/LDThemeContext";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import GlassGeckoWinView from "../fidget/GlassGeckoWinView";
import manualGradientColors from "@/app/styles/StaticColors";
import useAppNavigations from "@/src/hooks/useAppNavigations";

type GeckoWinViewParams = {
  capsule?: string;
  geckoGameTypeLabel?: string;
  opponent?: string;
  createdOn?: string;
};

type GeckoWinViewRoute = RouteProp<
  { GeckoWinView: GeckoWinViewParams },
  "GeckoWinView"
>;

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ScreenGeckoWinView = () => {
  const { lightDarkTheme } = useLDTheme();
  const { navigateBack } = useAppNavigations();

  const route = useRoute<GeckoWinViewRoute>();
  const { capsule, geckoGameTypeLabel, opponent, createdOn } =
    route.params ?? {};

  const subParts = [
    opponent ? `from ${opponent}` : "",
    formatDate(createdOn),
  ].filter(Boolean);
  const subLabel = subParts.join(" · ");

  return (
    <>
      <SafeViewFriendStatic
        friendColorLight={manualGradientColors.lightColor}
        friendColorDark={manualGradientColors.darkColor}
        useOverlay={false}
        backgroundOverlayColor={lightDarkTheme.primaryBackground}
        style={[{ flex: 1, padding: 10 }]}
      />

      <GlassGeckoWinView
        color={lightDarkTheme.primaryText}
        backgroundColor={lightDarkTheme.darkerOverlayBackground}
        borderColor="transparent"
        darkerOverlayColor={lightDarkTheme.darkerOverlayBackground}
        headerLabel={geckoGameTypeLabel}
        subLabel={subLabel}
        capsule={capsule}
        onBack={navigateBack}
      />
    </>
  );
};

export default ScreenGeckoWinView;
