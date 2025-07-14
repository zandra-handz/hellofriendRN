import { View, FlatList, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
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
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { friendList, getThemeAheadOfLoading, themeAheadOfLoading } =
    useFriendList();
  const navigation = useNavigation();
  const { selectedFriend, setFriend, loadingNewFriend } = useSelectedFriend();
  const [filteredFriendList, setFilteredFriendList] = useState(
    friendList || []
  );

  useEffect(() => {
    if (selectedFriend && friendList && friendList.length > 0) {
      setFilteredFriendList(
        friendList.filter((friend) => friend.id !== selectedFriend.id)
      );
    }
  }, [selectedFriend, friendList]);

  const handleSelectFriend = (itemId) => {
    const selectedOption = friendList.find((friend) => friend.id === itemId);

    const selectedFriend = selectedOption || null;
    
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend);

    if (!navigationDisabled) {
      navigation.goBack();
    }
  };

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        {selectedFriend && (
          <View
            style={{
              width: "100%",
              backgroundColor: themeStyles.primaryBackground.backgroundColor,
              height: "auto",
              flexShrink: 1,

              borderRadius: 10,
              justifyContent: "center",
              padding: 20,
              paddingVertical: 40,
            }}
          >
            <Text
              style={[themeStyles.primaryText, appFontStyles.welcomeText, {}]}
            >
              Selected: {selectedFriend.name}
            </Text>
          </View>
        )}
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
          {/* <Text
              style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: appFontStyles.welcomeText.fontSize - 10}]}
            >
              friends
            </Text> */}
        </View>
        <View style={{ width: "100%", flex: 1 }}>
          {/* {filteredFriendList &&  ( */}
            <FriendListUI
              data={filteredFriendList}
              onPress={handleSelectFriend}
            />
          {/* )} */}
        </View>
      </View>
    </SafeViewAndGradientBackground>
  );
};

export default ScreenSelectFriend;
