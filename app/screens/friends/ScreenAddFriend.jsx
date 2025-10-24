import React from "react";
import { View, StyleSheet } from "react-native";
import ContentAddFriend from "@/app/components/friends/ContentAddFriend";
import { useUser } from "@/src/context/UserContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import manualGradientColors  from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
const ScreenAddFriend = () => {
  const { lightDarkTheme } = useLDTheme(); 
  const { selectedFriend } = useSelectedFriend();
 

    const { friendListAndUpcoming} = useFriendListAndUpcoming();
  const friendList = friendListAndUpcoming?.friends;
  const { user } = useUser();
  return (
    <SafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
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
