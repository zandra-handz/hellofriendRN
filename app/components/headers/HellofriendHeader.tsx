import React from "react";
import { View, Text } from "react-native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import ButtonInfo from "../buttons/users/ButtonInfo";
import ButtonFriendProfileCircle from "../buttons/friends/ButtonFriendProfileCircle";
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";

//icon size for friend settings button is 28

const HellofriendHeader = () => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const { selectedFriend, friendLoaded } = useSelectedFriend();
 
 
  return (
    <View style={[appContainerStyles.homeHeaderContainer]}>
      <View style={{ flex: 1, alignItems: "flex-start", top: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ButtonFriendProfileCircle />
        </View>
      </View>

      <View
        style={{
          flex: 1,
      
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {selectedFriend && friendLoaded && (
          <View style={{ justifyContent: "center", paddingBottom: 14 }}>
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <GeckoSolidSvg
                width={50}
                height={50}
                color={themeStyles.genericText.color}
              />
            </View>
          </View>
        )}
        {(!selectedFriend || !friendLoaded) && (
          <Text style={[appFontStyles.homeHeaderText, themeStyles.primaryText]}>HF</Text>
        )}
      </View>

      <View style={{ flex: 1, alignItems: "flex-end", top: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ButtonInfo iconSize={28} />
        </View>
      </View>
    </View>
  );
}; 

export default HellofriendHeader;
