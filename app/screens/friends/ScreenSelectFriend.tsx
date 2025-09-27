import { View, Pressable } from "react-native";
import React, { useMemo, useCallback } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import manualGradientColors from "@/src/hooks/StaticColors";
// import { useFriendList } from "@/src/context/FriendListContext";
import FriendListUI from "@/app/components/alerts/FriendListUI";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useUserSettings } from "@/src/context/UserSettingsContext";
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
  const { settings } = useUserSettings();

  const lockIns = useMemo(
    () => ({
      next: settings?.lock_in_next ?? null,
      customString: settings?.lock_in_custom_string ?? null,
    }),
    [settings]
  );

  const { user } = useUser();

  const { getThemeAheadOfLoading, themeAheadOfLoading, resetTheme } =
    useFriendStyle();
  const { selectedFriend, selectFriend } = useSelectedFriend();
  const { updateSettings } = useUpdateSettings({ userId: user?.id });

  const toggleLockOnFriend = (id) => {
    console.log("id");
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
  const empty = [];

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

  return (
    <SafeViewAndGradientBackground
      friendColorLight={manualGradientColors.lightColor}
      friendColorDark={manualGradientColors.darkColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={false}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <View
          style={[
            {
              backgroundColor: lightDarkTheme.primaryBackground,
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              marginVertical: 10,
            },
          ]}
        >
          <Pressable
            hitSlop={30}
            onPress={navigateBack}
            onLongPress={handleDeselect}
            style={{
              position: "absolute",
              // backgroundColor: "pink",

              left: 0,
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: 60,
            }}
          >
            <MaterialIcons
              name={"keyboard-arrow-left"} // this is the same icon as the escort bars
              size={20}
              color={lightDarkTheme.primaryText}
            />
          </Pressable>
          <MaterialCommunityIcons
            name="account-switch-outline"
            size={26}
            color={lightDarkTheme.primaryText}
          />
        </View>
        <View style={{ width: "100%", flex: 1 }}>
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
      </View>
    </SafeViewAndGradientBackground>
  );
};

export default ScreenSelectFriend;
