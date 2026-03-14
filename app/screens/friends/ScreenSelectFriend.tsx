import { View, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import FriendListUI from "@/app/components/alerts/FriendListUI";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useUser from "@/src/hooks/useUser";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import manualGradientColors from "@/app/styles/StaticColors";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming"; 
import { AppFontStyles } from "@/app/styles/AppFonts";
 
 
const ScreenSelectFriend = ({}) => {
  const { user } = useUser();
  const route = useRoute();
  const useNavigateBack = route?.params?.useNavigateBack ?? false;
  const { lightDarkTheme } = useLDTheme();

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;
  const backgroundOverlayColor = lightDarkTheme.overlayBackground;
 
  const welcomeTextStyle = AppFontStyles.welcomeText;

  const { friendListAndUpcoming } = useFriendListAndUpcoming({
    userId: user?.id,
  });
  const friendList = friendListAndUpcoming?.friends;

  const { selectedFriend } = useSelectedFriend();
  const { updateSettings } = useUpdateSettings({ userId: user?.id });
 
  const toggleLockOnFriend = (id) => {
    updateSettings({ pinned_friend: id });
  };
 

  const { navigateBack, navigateToFriendHome, navigateToAddFriend } =
    useAppNavigations();
 
  const handleNavAfterSelect = useCallback(
    (friendId, friendName, friendNextDate) => {
      if (!useNavigateBack && friendId) {
        navigateToFriendHome(friendId, null, friendName, friendNextDate, Date.now());
      } else {
        navigateBack();
      }
    },
    [useNavigateBack],
  );

  const { handleSelectFriend } = useSelectFriend({
    userId: user?.id,
    friendList: friendList,
  });

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          paddingHorizontal: 10,
        }}
      >
        <TextHeader
          label={`Friends`}
          color={textColor}
          fontStyle={welcomeTextStyle}
          showNext={true}
          nextEnabled={friendList?.length < 20 ? true : false}
          onNext={navigateToAddFriend}
          nextIconName={`plus`}
          nextDisabledIconName={`plus`}
          nextColor={manualGradientColors.homeDarkColor}
          nextBackgroundColor={manualGradientColors.lightColor}
          nextDisabledColor={backgroundColor}
          nextDisabledBackgroundColor={'transparent'}
        />

        <View style={styles.friendsListWrapper}>
          <FriendListUI
            userId={user?.id} 
            friendList={friendList}
            backgroundColor={backgroundColor}
            backgroundOverlayColor={backgroundOverlayColor}
            itemColor={textColor}
            friendColorLight={selectedFriend?.lightColor}
            data={friendList}
            friendId={selectedFriend ? selectedFriend?.id : null}
            onPress={handleSelectFriend}
            handleNavAfterSelect={handleNavAfterSelect}
            onLongPress={toggleLockOnFriend}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeViewContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  animatedCircleContainer: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 999,
    width: 0,
    height: 0,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    marginVertical: 10,
  },
  topBarButton: {
    position: "absolute",
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 60,
  },
  friendsListWrapper: {
    width: "100%",
    flex: 1,
  },
});

export default ScreenSelectFriend;