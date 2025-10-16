import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ButtonSelectFriend = ({
  disabled = false,
  friend,
  backgroundColor,
  borderRadius,
  color,
  height = 70,
  fontColor,
}) => {
  const flattenedBackgroundColorStyle = StyleSheet.flatten([
    {
      backgroundColor: !disabled ? backgroundColor : "transparent",
      borderRadius,
 
    },
    styles.inner,
  ]);

  return (
    <View
      style={[
        {
          borderRadius,
          height,
          borderColor: fontColor,
        },
        styles.row,
      ]}
    >
      <View style={flattenedBackgroundColorStyle}>
        <Text
          numberOfLines={1}
          style={[
            styles.name,
            { color, fontSize: friend.name.length < 14 ? 15 : 12 },
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
    selfAlign: 'center',
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
 alignContent: 'center',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: 'center', 
  },
  name: {
    alignSelf: "center",
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    justifyContent: 'center',
  
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
