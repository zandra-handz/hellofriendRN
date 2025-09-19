import React from "react";
import { View, StyleSheet } from "react-native";
import ContentAddFriend from "@/app/components/friends/ContentAddFriend";
import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors  from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
const ScreenAddFriend = () => {
  const { lightDarkTheme } = useLDTheme();
  const { themeAheadOfLoading } = useFriendStyle();
  const { selectedFriend } = useSelectedFriend();
  const { friendList } = useFriendList();
  const { user } = useUser();
  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useSolidOverlay={true}
      style={{ flex: 1 }}
    >
      <View style={[styles.container]}>
        <View style={styles.mainContainer}>
          <ContentAddFriend
            userId={user?.id}
            friendList={friendList}
            primaryColor={lightDarkTheme.primaryText}
            backgroundColor={lightDarkTheme.overlayBackground}
            fontStyle={AppFontStyles.welcomeText}
          />
        </View>
      </View>
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  mainContainer: {
    flex: 1,
    paddingBottom: 10,
  },
});

export default ScreenAddFriend;
