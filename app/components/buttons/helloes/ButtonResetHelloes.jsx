import React from "react";
import { Alert, StyleSheet, Pressable } from "react-native";
 import { useRemixUpcomingHelloes } from "@/src/hooks/useRemixUpcomingHelloes";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

const ButtonResetHelloes = ({ userId, iconSize = 15, manualGradientColors }) => {
  const { handleRemixAllNextHelloes } =
    useRemixUpcomingHelloes({userId}); // MOVE TO CONTEXT

 
  const handleOnPress = () => {
    Alert.alert(
      "Warning!",
      "Reset all suggested hello dates? (You can run this reset three times a day.)",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Reset", onPress: () => handleRemixAllNextHelloes() },
      ]
    );
  };
console.log('user id!', userId); 
  return (
    <Pressable
      onPress={handleOnPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: manualGradientColors.lightColor },
        pressed && styles.pressedStyle,
      ]}
    >
      <MaterialCommunityIcons
        name={"refresh"}
        size={iconSize}
        color={manualGradientColors.homeDarkColor}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: "auto",
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: ".5%",
    paddingVertical: ".5%",
    alignItems: "center",
  },
  pressedStyle: {},
  on: {
    backgroundColor: "#4cd137",
  },
  off: {
    backgroundColor: "#dcdde1",
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
  },
});

export default ButtonResetHelloes;
