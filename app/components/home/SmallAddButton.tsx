import { View,   StyleSheet } from "react-native";
import GlobalPressable from "../appwide/button/GlobalPressable";
import React from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SmallAddButton = ({
  manualGradientColors,
  primaryBackground,
size=64,
  onPress,
}) => {
  return (
    <Animated.View entering={FadeIn.delay(200)}>
      <GlobalPressable
        style={[
          styles.smallAddButton,
          {
            borderColor: primaryBackground,
            backgroundColor: manualGradientColors.lightColor,
            padding: size / 2,
          },
        ]}
        onPress={onPress}
      >
        <View
          style={{
            width: "auto",
            borderRadius: 999,

            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="account-plus"
            size={size}
            color={manualGradientColors.homeDarkColor}
          />
        </View>
      </GlobalPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  smallAddButton: {
 
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },

  smallAddButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SmallAddButton;
