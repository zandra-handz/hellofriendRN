import React from "react";
import { View, StyleSheet } from "react-native";
import ContentAddFriend from "@/app/components/friends/ContentAddFriend";
 import { useLDTheme } from "@/src/context/LDThemeContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
const ScreenAddFriend = () => {
  const { lightDarkTheme } = useLDTheme();
  const {   manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendStyle();
  const { selectedFriend } = useSelectedFriend();
  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      backgroundTransparentOverlayColor={
        lightDarkTheme.overlayBackground
      }
      style={{ flex: 1 }}
    >
      <View style={[styles.container ]}>
        {/* <GlobalAppHeader title={"Add new friend"} /> */}
        <View style={styles.mainContainer}>
          <ContentAddFriend />
        </View>
      </View>
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingBottom: 10,
  },
});

export default ScreenAddFriend;
