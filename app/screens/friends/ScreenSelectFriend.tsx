import { View, Pressable, StyleSheet } from "react-native";
import React, { useMemo, useCallback } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import manualGradientColors from "@/app/styles/StaticColors";
// import { useFriendList } from "@/src/context/FriendListContext";
import FriendListUI from "@/app/components/alerts/FriendListUI";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

// import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useUser } from "@/src/context/UserContext";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
import { deselectFriendFunction } from "@/src/hooks/deselectFriendFunction";
import { useQueryClient } from "@tanstack/react-query";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import SvgIcon from "@/app/styles/SvgIcons";
// type Props = {
//   navigationDisabled: boolean;
// };

const ScreenSelectFriend = (
  {
    // navigationDisabled = false
  }
) => {
  const { lightDarkTheme } = useLDTheme();
  const { autoSelectFriend } = useAutoSelector();

  const { friendListAndUpcoming } = useFriendListAndUpcoming();
  const friendList = friendListAndUpcoming?.friends;
  const queryClient = useQueryClient();
  // const { settings } = useUserSettings();

  // const lockIns = useMemo(
  //   () => ({
  //     next: settings?.lock_in_next ?? null,
  //     customString: settings?.lock_in_custom_string ?? null,
  //   }),
  //   [settings]
  // );

  const { user } = useUser();

  const { getThemeAheadOfLoading, themeAheadOfLoading, resetTheme } =
    useFriendStyle();
  const { selectedFriend, selectFriend } = useSelectedFriend();
  const { updateSettings } = useUpdateSettings({ userId: user?.id });

  const toggleLockOnFriend = (id) => {
    if (id !== selectedFriend?.id) {
      handleSelectFriend(id);
    }
    updateSettings({ lock_in_custom_string: id });
  };

  const handleDeselect = useCallback(() => {
    deselectFriendFunction({
      userId: user?.id,
      queryClient: queryClient,
      updateSettings: updateSettings,
      friendId: selectedFriend?.id,
      autoSelectFriend: autoSelectFriend,
      selectFriend: selectFriend,
      resetTheme: resetTheme,
      getThemeAheadOfLoading: getThemeAheadOfLoading,
    });
  }, [
    user?.id,
    queryClient,
    autoSelectFriend,
    updateSettings,
    selectedFriend?.id,
    selectFriend,
    resetTheme,
    getThemeAheadOfLoading,
  ]);

  const locale = "en-US";
  const { navigateBack } = useAppNavigations();

  // usememo is not actually doing anything since dependency is a list...
  const alphabFriendList: object[] = useMemo(() => {
    if (!friendList || !(friendList?.length > 0)) {
      return [];
    } 
    const summaryOfSorted = friendList
      .slice()
      .sort((a, b) =>
        a.name.localeCompare(b.name, locale, { sensitivity: "case" })
      );

    if (!summaryOfSorted || !(summaryOfSorted.length > 0)) {
      return [];
    }

    return summaryOfSorted;
  }, [friendList]);
 

  const { handleSelectFriend } = useSelectFriend({
    friendList,
    resetTheme,
    getThemeAheadOfLoading,
    selectFriend,
    navigateOnSelect: navigateBack,
  });

  // const handleSelectFriend = (itemId: number) => {
  //   const selectedOption = friendList.find((friend) => friend.id === itemId);

  //   const selectedFriend = selectedOption || null;
  //   if (selectedOption) {
  //     selectFriend(selectedFriend);
  //     getThemeAheadOfLoading(selectedFriend);
  //   } else {
  //     selectFriend(null);
  //     resetTheme();
  //   }

  //   if (!navigationDisabled) {
  //     navigateBack();
  //   }
  // };

  const flattenedTopBarStyle = StyleSheet.flatten([
    {
      backgroundColor: lightDarkTheme.primaryBackground,
    },
    styles.topBar,
  ]);

  return (
    <SafeViewAndGradientBackground
      friendColorLight={manualGradientColors.lightColor}
      friendColorDark={manualGradientColors.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={false}
      style={styles.safeViewContainer}
    >
      <View style={flattenedTopBarStyle}>
        <Pressable
          hitSlop={30}
          onPress={navigateBack}
          onLongPress={handleDeselect}
          style={styles.topBarButton}
        >
          <SvgIcon
            name={"chevron_left"}
            size={20}
            color={lightDarkTheme.primaryText}
          />
        </Pressable>
        <SvgIcon
          name="account_switch_outline"
          size={26}
          color={lightDarkTheme.primaryText}
        />
      </View>
      <View style={styles.friendsListWrapper}>
        {alphabFriendList && (
          <FriendListUI
            autoSelectFriend={autoSelectFriend}
            handleDeselect={handleDeselect}
            themeAheadOfLoading={themeAheadOfLoading}
            friendList={friendList}
            lightDarkTheme={lightDarkTheme}
            data={alphabFriendList}
            friendId={selectedFriend ? selectedFriend?.id : null}
            onPress={handleSelectFriend}
            onLongPress={toggleLockOnFriend}
          />
        )}
      </View>
    </SafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  safeViewContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
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
