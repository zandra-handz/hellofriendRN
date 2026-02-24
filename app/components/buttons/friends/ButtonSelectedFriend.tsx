import React from "react";
import { View, Text, StyleSheet, Pressable} from "react-native";
import { AppFontStyles } from "@/app/styles/AppFonts";

const ButtonSelectedFriend = ({
  friend,
  backgroundColor,
  borderRadius,
  color,
  style,
  height = 70,
  fontColor, 
  onLongPress,
}) => {
  return (
    <View style={[style, styles.container]}>
   
    <Pressable
    onLongPress={onLongPress}
      style={[
        {
          borderRadius,
          height,
          borderColor: fontColor,
          backgroundColor: backgroundColor,
        },
        styles.row,
      ]}
    >
      <View
        style={[
          {
            borderRadius,
          },
          styles.inner,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.name,

            { color, fontSize: friend.name.length < 14 ? 17 : 16 },
            AppFontStyles.subWelcomeText,
          ]}
        >
          {friend.name}
        </Text>
      </View>
    </Pressable>
         
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
            width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50000, 
    height: 50,

    },
  row: {
    flex: 1,
    flexDirection: "row",
    selfAlign: "center",
    justifyContent: "center",

    textAlign: "center",
    borderWidth: 0,
    overflow: "hidden",
    padding: 3,
    justifyContent: "center",
  },
  inner: {
    width: "auto",
    paddingHorizontal: 14,
    alignContent: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  name: {
    alignSelf: "center",
    // fontFamily: "Poppins-Regular",
    // fontWeight: "bold",
    justifyContent: "center",
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

export default ButtonSelectedFriend;
