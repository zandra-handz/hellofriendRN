import { View } from "react-native";
import React, { useMemo } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import FriendListUI from "@/app/components/alerts/FriendListUI";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFriendStyle } from "@/src/context/FriendStyleContext";

type Props = {
  navigationDisabled: boolean;
};

const ScreenSelectFriend = ({ navigationDisabled = false }: Props) => {
  const { themeStyles } = useGlobalStyle();
  const { friendList } = useFriendList();
  const { getThemeAheadOfLoading, resetTheme } = useFriendStyle();
  const navigation = useNavigation();
  const { selectedFriend, selectFriend } = useSelectedFriend();

  const locale = "en-US";

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
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <View
          style={[
            themeStyles.primaryBackground,
            {
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              marginVertical: 10,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="account-switch-outline"
            size={26}
            color={themeStyles.primaryText.color}
          />
        </View>
        <View style={{ width: "100%", flex: 1 }}>
          {alphabFriendList && (
            <FriendListUI
              data={alphabFriendList}
              selectedFriendId={selectedFriend ? selectedFriend?.id : null}
              onPress={handleSelectFriend}
            />
          )}
        </View>
      </View>
    </SafeViewAndGradientBackground>
  );
};

export default ScreenSelectFriend;
