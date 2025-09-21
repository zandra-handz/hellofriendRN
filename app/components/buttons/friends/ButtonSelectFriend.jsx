import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";  
 
const ButtonSelectFriend = ({
  friendId,
  disabled=false,
  friend,
  backgroundColor,
  borderRadius,
  color,
  height = 70,
  themeAheadOfLoading,
  themeTextColor,
  backgroundOverlayColor,
}) => {  
 
  const [textColor, setTextColor] = useState(themeTextColor);

  useEffect(() => {
    if (friendId && themeAheadOfLoading) {
      if (friend.id === friendId) { 
        setTextColor(themeAheadOfLoading.fontColor);
      } 
    }
  }, [friendId, themeAheadOfLoading]);

 

  return (
    <View
      style={[
        styles.row,
        {
          borderRadius: borderRadius,
          height: height,
          overflow: "hidden",
          // backgroundColor: backgroundColor,
          borderColor: textColor,
          padding: 3,
             justifyContent: "center",
        },
      ]}
    > 
      <View
        style={{
          backgroundColor: !disabled ?  backgroundColor : 'transparent',
          borderRadius: borderRadius, width: 'auto', paddingHorizontal: 14, height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
          
        }}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.name,
            { 
              color: color,
              fontSize: friend.name.length < 14 ? 15 : 12,
            },
          ]}
        >
          {friend.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
 
    // padding: 0, 
    width: "100%",

    textAlign: "center",

    borderWidth: 0,
  },
  name: {
    alignSelf: "center",
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
  },
  iconContainer: {
    paddingBottom: 6,
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  button: {
    color: "blue",
  },
});

export default ButtonSelectFriend;
