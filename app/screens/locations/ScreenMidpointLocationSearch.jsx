import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { useLinkBuilder, useRoute } from "@react-navigation/native";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import ContentFindMidpoint from "@/app/components/locations/ContentFindMidpoint";
import { useFriendStyle } from "@/src/context/FriendStyleContext"; 
import manualGradientColors  from "@/src/hooks/StaticColors";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
const ScreenMidpointLocationSearch = () => {
  const route = useRoute();
  const userAddress = route?.params?.userAddress ?? null;
  const friendAddress = route?.params?.friendAddress ?? null;

  const { user } = useUser(); 

  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme(); 
  const { themeAheadOfLoading } = useFriendStyle();

  // console.log(userAddress);
  // console.log(friendAddress);
  return (
    <SafeViewAndGradientBackground 
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
      friendId={selectedFriend?.id}
      backgroundOverlayHeight=""
      includeBackgroundOverlay={true}
      useSolidOverlay={true}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, padding: 10 }}>
        <Text
          style={[
            AppFontStyles.welcomeText,
            { color: lightDarkTheme.primaryText, fontSize: 22 },
          ]}
        >
          Search for midpoint locations
        </Text>
        {/* address will be 'No address selected', go by existence of id instead */}
        {userAddress &&
          userAddress?.id &&
          friendAddress &&
          friendAddress?.id && (
            <ContentFindMidpoint
            userId={user?.id}
              manualGradientColors={manualGradientColors}
              themeAheadOfLoading={themeAheadOfLoading}
              subWelcomeTextStyle={AppFontStyles.subWelcomeText}
              lightDarkTheme={lightDarkTheme}
              userAddress={userAddress}
              friendAddress={friendAddress}
            />
          )}
      </View>
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
});

export default ScreenMidpointLocationSearch;
