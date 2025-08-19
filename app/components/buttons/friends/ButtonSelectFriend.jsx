import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
// import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext";

//may need to configure friendlist theme color before using as a button
const ButtonSelectFriend = ({
  disabled=false,
  friend,
  backgroundColor,
  borderRadius,
  color,
  height = 70,
}) => {
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();
  const { themeStyles } = useGlobalStyle();
 
  const [textColor, setTextColor] = useState(themeStyles.genericText.color);

  useEffect(() => {
    if (selectedFriend && themeAheadOfLoading) {
      if (friend.id === selectedFriend.id) { 
        setTextColor(themeAheadOfLoading.fontColor);
      } 
    }
  }, [selectedFriend]);

  //to restore gradient: [1] - [0]
  // const renderProfileIcon = () => {
  //   return (
  //     <View
  //       style={{
  //         overflow: "hidden",
  //         height: 40,
  //         width: 40,
  //         position: "absolute",
  //         borderRadius: 20,
  //         padding: 10,
  //         right: 0,
  //         backgroundColor: backgroundColor,
  //       }}
  //     >
  //       {/* <View
  //         style={{
  //           position: "absolute",
  //           opacity: 0.9,
  //           position: "absolute",
  //           top: -20,
  //           right: -10,
  //           transform: [{ rotate: "200deg" }],
  //           zIndex: 50000,
  //           elevation: 50000,
  //         }}
  //       >
  //         <GeckoSolidSvg
  //           width={50}
  //           height={50}
  //           color={color}
  //           style={{ opacity: 1 }}
  //         />
  //       </View> */}
  //     </View>
  //   );
  // };

  return (
    <View
      style={[
        styles.row,
        {
          borderRadius: borderRadius,
          height: height,
          overflow: "hidden",
          backgroundColor: backgroundColor,
          borderColor: textColor,
          padding: 3,
             justifyContent: "center",
        },
      ]}
    >
      {/* {renderProfileIcon()} */}
      <View
        style={{
          backgroundColor: !disabled ? themeStyles.overlayBackgroundColor.backgroundColor : 'transparent',
          borderRadius: 999, width: 'auto', paddingHorizontal: 14, height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
          
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
