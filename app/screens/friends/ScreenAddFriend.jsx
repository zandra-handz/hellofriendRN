import React from "react";
import { View, StyleSheet } from "react-native";
import ContentAddFriend from "@/app/components/friends/ContentAddFriend";
// import { useUser } from "@/src/context/UserContext";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext"; 
import { AppFontStyles } from "@/app/styles/AppFonts";

import { SafeAreaView } from "react-native-safe-area-context";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
const ScreenAddFriend = () => {
  const { lightDarkTheme } = useLDTheme(); 
  // const { selectedFriend } = useSelectedFriend();
 
  const { user } = useUser();
    const { friendListAndUpcoming} = useFriendListAndUpcoming({userId: user?.id});
  const friendList = friendListAndUpcoming?.friends;

  return (
    <SafeAreaView
      style={[
        styles.safeAreaStyle,
        { backgroundColor: lightDarkTheme.primaryBackground },
      ]}
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
    </SafeAreaView>
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
    safeAreaStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default ScreenAddFriend;
