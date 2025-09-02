import React from "react";
import { View, StyleSheet } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useUser } from "@/src/context/UserContext";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext"; 
import { useLDTheme } from "@/src/context/LDThemeContext";
import ContentAddImage from "@/app/components/images/ContentAddImage";
import { manualGradientColors } from "@/src/hooks/StaticColors";
// nav
import { useRoute } from "@react-navigation/native";

const ScreenAddImage = () => {
  const route = useRoute();
  const imageUri = route.params?.imageUri ?? false;
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme(); 
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
      style={{ flex: 1 }}
    >
      <View style={[styles.container]}>
        <ContentAddImage
          userId={user?.id}
          friendId={selectedFriend?.id}
          friendName={selectedFriend?.name}
          primaryColor={lightDarkTheme.primaryText}
          themeAheadOfLoading={themeAheadOfLoading}
          imageUri={imageUri}
          backgroundColor={lightDarkTheme.primaryBackground}
        />
      </View>
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenAddImage;
