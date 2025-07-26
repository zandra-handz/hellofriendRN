import { View, Text } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import FriendListUI from "@/app/components/alerts/FriendListUI";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  navigationDisabled: boolean;
};

const ScreenSelectFriend = ({ navigationDisabled = false }: Props) => {
  const { themeStyles } = useGlobalStyle();
  const { friendList, getThemeAheadOfLoading } = useFriendList();
  const navigation = useNavigation();
  const { selectedFriend, selectFriend } = useSelectedFriend();
  // const [alphabFriendList, setAlphabFriendList] = useState<object[]>([]); //back end friend model orders friends by next_meet date
  
  const locale = "en-US";

  // useEffect(() => {
  //   if (friendList && friendList.length > 0) {
  //     //!! IN PLACE. added slice() to make a shallow copy
  //     // const summaryOfSorted = friendList.sort((a,b) => a.name.localeCompare(b.name, locale, {sensitivity: 'case'}))

  //     //case shouldn't be necessary, set to base to ignore case
  //     const summaryOfSorted = friendList
  //       .slice()
  //       .sort((a, b) =>
  //         a.name.localeCompare(b.name, locale, { sensitivity: "case" })
  //       );
  //     if (summaryOfSorted) {
  //       setAlphabFriendList(summaryOfSorted);
  //     }
  //     // console.log(
  //     //   `finished friend sort: `,
  //     //   summaryOfSorted.map((friend) => friend.name)
  //     // );
  //   }
  // }, [friendList]);

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

    selectFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend);

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
        {/* {selectedFriend && (
          <View
            style={{
              width: "100%",
              backgroundColor: themeStyles.primaryBackground.backgroundColor,
              height: "auto",
              flexShrink: 1,

              borderRadius: 10,
              justifyContent: "center",
              padding: 20,
              paddingVertical: 20,
            }}
          >
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.welcomeText,
                { fontSize: 26 },
              ]}
            >
              Selected: {selectedFriend.name}
            </Text>
          </View>
        )} */}
        <View style={{ width: "100%", flex: 1 }}>
          {alphabFriendList && alphabFriendList.length > 0 && (
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
