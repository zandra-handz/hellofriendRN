import { View, Pressable } from "react-native";
import React, { useMemo } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import manualGradientColors from "@/src/hooks/StaticColors";
import { useFriendList } from "@/src/context/FriendListContext";
import FriendListUI from "@/app/components/alerts/FriendListUI";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
type Props = {
  navigationDisabled: boolean;
};

const ScreenSelectFriend = ({ navigationDisabled = false }: Props) => {
  const { lightDarkTheme } = useLDTheme();
  const { friendList } = useFriendList();
  const { getThemeAheadOfLoading, themeAheadOfLoading, resetTheme } =
    useFriendStyle();
  const navigation = useNavigation();
  const { selectedFriend, selectFriend, deselectFriend } = useSelectedFriend();

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

  const handleSelectFriend = (itemId: number) => {
    const selectedOption = friendList.find((friend) => friend.id === itemId);

    const selectedFriend = selectedOption || null;
    if (selectedOption) {
      selectFriend(selectedFriend);
      getThemeAheadOfLoading(selectedFriend);
    } else {
      selectFriend(null);
      resetTheme();
    }

    if (!navigationDisabled) {
      navigation.goBack();
    }
  };

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
            onPress={navigateBack}
            onLongPress={deselectFriend}
            style={{
              position: "absolute",
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
              themeAheadOfLoading={themeAheadOfLoading}
              friendList={friendList}
              lightDarkTheme={lightDarkTheme}
              data={alphabFriendList}
              friendId={selectedFriend ? selectedFriend?.id : null}
              onPress={handleSelectFriend}
            />
          )}
        </View>
      </View>
    </SafeViewAndGradientBackground>
  );
};

export default ScreenSelectFriend;
