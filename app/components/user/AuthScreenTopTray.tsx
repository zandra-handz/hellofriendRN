import { View, Text, Pressable, StyleSheet } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { manualGradientColors } from "@/src/hooks/StaticColors";
import useAppNavigations from "@/src/hooks/useAppNavigations";

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

const { navigateToWelcome } = useAppNavigations();
  const LEFT_BUTTONS_SPACER = 6;

  return (
    <Animated.View
      entering={SlideInUp}
      exiting={SlideOutUp}
      style={styles.container}
    >
      <View style={{flexDirection: 'row'}}>

      <Pressable
        onPress={navigateToWelcome}
        style={{
          height: 32,
          width: 32,
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "column",
          backgroundColor: manualGradientColors.homeDarkColor,
          borderRadius: 20,
          marginRight: LEFT_BUTTONS_SPACER,
        }}
      >
        <MaterialCommunityIcons
          // name={"arrow-left"}
          name={"home"}
          size={16}
          color={manualGradientColors.lightColor}
        />
      </Pressable>
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
          // name={"arrow-left"}
          name={"swap-horizontal-variant"}
          size={16}
          color={manualGradientColors.lightColor}
        />
      </Pressable>
              
      </View>
      <View
        style={{
          height: "100%",
          justifyContent: "center",
        }}
      >
        {rightLabel && (
          <Text
            style={styles.buttonText}
            onPress={onRightPress}
            accessible={true}
            accessibilityLabel="Toggle button"
            accessibilityHint="Press to toggle between sign in and create account"
          >
            {rightLabel}
          </Text>
        )}
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
    // backgroundColor: "teal",
  },
  buttonText: {
    color: "black",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    selfAlign: "center",
  },
});

export default AuthScreenTopTray;
