import { View, Text, Pressable } from "react-native";
import React, { useCallback } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "../appwide/spinner/LoadingPage";

type Props = {};


//similar to topbar but has its own spinner instead of centering based on parent component
const SwitchFriend = (props: Props) => {
  const { appFontStyles, themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend,  loadingNewFriend } = useSelectedFriend();
  const navigation = useNavigation();
  // const friendModalButtonHeight = 16;

  const handleNavigateToFriendSelect = () => {
    navigation.navigate("SelectFriend");
  };

  const RenderIcon = useCallback(
    () => (
      <Pressable
        onPress={handleNavigateToFriendSelect}
        style={{ flexDirection: "row" }}
      >
        <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}>
          {selectedFriend?.id ? `Switch` : `Pick friend`}
        </Text>
        <MaterialCommunityIcons
          name="account-switch-outline"
          size={20}
          color={themeStyles.primaryText.color}
          style={{ marginHorizontal: 10 }}
        />
      </Pressable>
    ),
    [appFontStyles, handleNavigateToFriendSelect, selectedFriend, themeStyles]
  );
  return (
    <View
      style={{
        height: "auto", 
        width: 'auto',
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* {loadingNewFriend && (
        <View style={{ width: "100%" }}>
          <LoadingPage
            loading={loadingNewFriend}
            spinnerType="flow"
            spinnerSize={30}
            color={themeAheadOfLoading.darkColor}
            includeLabel={false}
          />
        </View>
      )} */}
      {!loadingNewFriend && <RenderIcon />}
    </View>
  );
};

export default SwitchFriend;
