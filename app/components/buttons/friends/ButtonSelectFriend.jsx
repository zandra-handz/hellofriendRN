import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native"; 
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";

//may need to configure friendlist theme color before using as a button
const ButtonSelectFriend = ({ friend }) => {
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
 
  const [rowColor, setRowColor] = useState(
    themeStyles.genericTextBackgroundShadeTwo.backgroundColor || "transparent"
  );
  const [lightColor, setLightColor] = useState(friend.lightColor || "gray");
  const [darkColor, setDarkColor] = useState(friend.darkColor || "gray");
  const [textColor, setTextColor] = useState(themeStyles.genericText.color);

 

  useEffect(() => {
    if (selectedFriend && themeAheadOfLoading) {
      if (friend.id === selectedFriend.id) {
        setRowColor(themeAheadOfLoading.darkColor);
        setLightColor(themeAheadOfLoading.fontColor);
        setDarkColor(themeAheadOfLoading.fontColor);
        setTextColor(themeAheadOfLoading.fontColor);
      } else {
        setRowColor(
          themeStyles.genericTextBackgroundShadeTwo.backgroundColor ||
            "transparent"
        );
      }
    }
  }, [selectedFriend]);

  //to restore gradient: [1] - [0]
  const renderProfileIcon = () => {
    return ( 
        <View style={{overflow: 'hidden', opacity: .9, position: 'absolute', top: -100, left: -20, transform: [ {rotate: '200deg'}]}}>
            
      <GeckoSolidSvg
        width={100}
        height={100} 
        color={darkColor}
      />
      
        </View>
    );
  };
 

  return (
    <View
      style={[
        styles.row,
        { overflow: 'hidden', backgroundColor: rowColor, borderColor: textColor },
      ]}
    >
      <View style={styles.iconContainer}>{renderProfileIcon()}</View>

      <Text numberOfLines={1} style={[styles.name, { color: textColor }]}>
        {friend.name}
      </Text>

 
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
    width: "100%",
    height: 90,
    textAlign: "center",

    borderWidth: 0,
    borderRadius: 10,
  },
  name: {
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  iconContainer: {
    paddingBottom: 6,
    width: "100%",
    alignItems: "center",
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  button: {
    color: "blue",
  },
});

export default ButtonSelectFriend;
