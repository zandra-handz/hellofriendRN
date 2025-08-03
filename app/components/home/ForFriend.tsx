import { View, Text, Pressable } from "react-native";
import React, { useCallback } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 

type Props = {
  fontSize: number;
};


//similar to topbar but has its own spinner instead of centering based on parent component
const ForFriend = ({fontSize=13}: Props) => {
  const { appFontStyles, themeStyles } = useGlobalStyle();
 
  const { selectedFriend,  loadingNewFriend } = useSelectedFriend();
  const navigation = useNavigation();
  // const friendModalButtonHeight = 16;

  const handleNavigateToFriendSelect = () => {
    navigation.navigate("SelectFriend");
  };

  const RenderIcon = useCallback(
    () => (
      <View
        style={{ flexDirection: "row" }}
      >
        <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText, { fontSize: fontSize}]}>
          {selectedFriend?.id ? selectedFriend.name : ``}
        </Text>
        <MaterialCommunityIcons
          name="heart"
          size={18}
          color={themeStyles.primaryText.color}
          style={{ marginLeft: 8 }}
        />
      </View>
    ),
    [appFontStyles, selectedFriend, themeStyles]
  );
  return (
    <View
      style={{
        height: "auto", 
        width: 'auto',
      
       // backgroundColor: 'teal',
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    > 
      {!loadingNewFriend && selectedFriend && <RenderIcon />}
    </View>
  );
};

export default ForFriend;
