import { View, Text, Pressable, StyleSheet } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import Animated, {SlideInUp } from 'react-native-reanimated';
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { manualGradientColors } from "@/src/hooks/StaticColors";

type Props = {
  onBackPress: () => void;
  onRightPress: () => void;
  rightLabel: string;
};

const AuthScreenTopTray = ({
  onBackPress,
  onRightPress,
  rightLabel,
}: Props) => {
  return (
    <Animated.View entering={SlideInUp} style={styles.container}>
      <Pressable
        onPress={onBackPress}
        style={{
          height: 32,
          width: 32,
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "column",
          backgroundColor: manualGradientColors.homeDarkColor,
          borderRadius: 20,
        }}
      >
        <MaterialCommunityIcons
          name={"arrow-left"}
          size={16}
          color={manualGradientColors.lightColor}
        />
      </Pressable>
      <View
        style={{
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Text
          style={styles.buttonText}
          onPress={onRightPress}
          accessible={true}
          accessibilityLabel="Toggle button"
          accessibilityHint="Press to toggle between sign in and create account"
        >
          {rightLabel}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    selfAlign: "center",
  },
});

export default AuthScreenTopTray;
