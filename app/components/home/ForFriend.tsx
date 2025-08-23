import { View, Text  } from "react-native";
import React, { useCallback } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
import { MaterialCommunityIcons } from "@expo/vector-icons";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
 
import { useFriendDash } from "@/src/context/FriendDashContext";
type Props = {
  fontSize: number;
};


//similar to topbar but has its own spinner instead of centering based on parent component
const ForFriend = ({fontSize=13}: Props) => {
  const { appFontStyles, themeStyles } = useGlobalStyle();
 
  const { selectedFriend  } = useSelectedFriend();
 const { loadingDash } = useFriendDash();
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
      {!loadingDash && selectedFriend && <RenderIcon />}
    </View>
  );
};

export default ForFriend;
