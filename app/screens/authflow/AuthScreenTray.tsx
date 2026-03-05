import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons"; 
import manualGradientColors from "@/app/styles/StaticColors";

type Props = {
  onBackPress: () => void;
  onRightPress?: () => void;
  rightLabel?: string;
  onHomePress: () => void;
};

const ICON_SIZE = 24;

const AuthScreenTray = ({
  onBackPress,
  onRightPress,
  rightLabel,
  onHomePress,
  iconColor,
}: Props) => {



  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", width: 100 }}>
        <Pressable onPress={onHomePress} style={styles.pressableOne}>
          <SvgIcon
            name={"chevron_left"}
            size={ICON_SIZE}
            color={iconColor}
          />
        </Pressable>
        <Pressable onPress={onBackPress} style={styles.pressableTwo}>
          <SvgIcon
            name={"plus"}
            size={ICON_SIZE}
            color={iconColor}
          />
        </Pressable>
      </View>
      <View style={{ height: "100%", justifyContent: "center" }}>
        {rightLabel && (
          <Text
            style={[styles.buttonText, {color: iconColor}]}
            onPress={onRightPress}
          
            accessible={true}
            accessibilityLabel="Toggle button"
            accessibilityHint="Press to toggle between sign in and create account"
          >
            {rightLabel}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    alignItems: "center",
  },
  pressableOne: {
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 20,
    marginRight: 6, 
  },
  pressableTwo: {
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 20, 
  },
  buttonText: {
    color: "black",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
});

export default AuthScreenTray;