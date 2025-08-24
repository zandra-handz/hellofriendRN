import { View, Text } from "react-native";
import React from "react";
import Demo from "@/app/components/headers/SkiaDemo";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

type Props = {};

const ScreenFidget = (props: Props) => {
  const { themeAheadOfLoading } = useFriendStyle();
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={themeStyles.primaryBackground.backgroundColor}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight={120}
      style={{ flex: 1 }}
    >
      <View
        style={{
        //  backgroundColor: "pink",
          width: "100%",
          flex: 1,
          alignItems: "center",
        }}
      >
        <View style={{ width: 300,  height: "100%" }}>
          <Demo text={""} />
        </View>
      </View>
    </SafeViewAndGradientBackground>
  );
};

export default ScreenFidget;
