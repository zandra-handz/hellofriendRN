import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native"; 
import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";

//may need to configure friendlist theme color before using as a button
const ButtonSelectFriend = ({ friend, backgroundColor, color, height=70 }) => {
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
       <View style={{overflow: 'hidden', height: 40, width: 40, position: 'absolute', borderRadius: 20, padding: 10, right: 0, backgroundColor: backgroundColor}}>
            
        
        <View style={{  position: 'absolute', opacity: .9, position: 'absolute', top: -20, right: -10, transform: [ {rotate: '200deg'}]}}>
            
      <GeckoSolidSvg
        width={50}
        height={50} 
        color={color}
        style={{opacity: 1}}
      />
      
        </View>
        
      </View>
    );
  };
 

  return (
    <View
      style={[
        styles.row,
        { height: height, overflow: 'hidden', backgroundColor: backgroundColor, borderColor: textColor },
      ]}
    >
      {renderProfileIcon()}

      <Text numberOfLines={1} style={[styles.name, { color: color, fontSize: friend.name.length < 14 ? 15 : 12 }]}>
        {friend.name}
      </Text>

 
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 20,
    width: "100%",

    textAlign: "center",

    borderWidth: 0,
    borderRadius: 10,
  },
  name: {
    alignSelf: "center",
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    fontWeight: 'bold',
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
