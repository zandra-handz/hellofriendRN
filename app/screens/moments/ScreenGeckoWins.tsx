import { View, Text } from "react-native";
import React from "react";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors from "@/app/styles/StaticColors";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useGeckoGameWins from "@/src/hooks/GeckoCalls/useGeckoGameWins";
import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";

type Props = {};

const ScreenGeckoWins = (props: Props) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { geckoGameWins } = useGeckoGameWins({ userId: user?.id });
  return (
    <SafeViewFriendStatic
      friendColorLight={manualGradientColors.lightColor}
      friendColorDark={manualGradientColors.darkColor}
      useOverlay={false}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={[{ flex: 1, padding: 10 }]}
    >
      <View>
        <Text>ScreenGeckoWins</Text>
      </View>
    </SafeViewFriendStatic>
  );
};

export default ScreenGeckoWins;
