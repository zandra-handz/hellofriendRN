import React from "react";
import { View, Text, StyleSheet } from "react-native";

import SafeViewFriendStatic from "@/app/components/appwide/format/SafeViewFriendStatic";
import { useLinkBuilder, useRoute } from "@react-navigation/native";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import ContentFindMidpoint from "@/app/components/locations/ContentFindMidpoint";
 
import manualGradientColors  from "@/app/styles/StaticColors";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { AppFontStyles } from "@/app/styles/AppFonts";
const ScreenMidpointLocationSearch = () => {
  const route = useRoute();
  const userAddress = route?.params?.userAddress ?? null;
  const friendAddress = route?.params?.friendAddress ?? null;

  const { user } = useUser(); 

  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();  

  // console.log(userAddress);
  // console.log(friendAddress);
  return (
    <SafeViewFriendStatic
      friendColorLight={selectedFriend.lightColor}
      friendColorDark={selectedFriend.darkColor}
      useOverlay={true}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      style={[
        {
          flex: 1,
          padding: 10,
        },
      ]}
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
  
              subWelcomeTextStyle={AppFontStyles.subWelcomeText}
              lightDarkTheme={lightDarkTheme}
              userAddress={userAddress}
              friendAddress={friendAddress}
            />
          )}
      </View>
    </SafeViewFriendStatic>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
});

export default ScreenMidpointLocationSearch;
