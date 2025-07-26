import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import AddMomentButton from "../buttons/moments/AddMomentButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import GlobalPressable from "../appwide/button/GlobalPressable";
type Props = {
  capsuleCount: number;
  size: number;
};

const LargeThoughtBubble = ({ capsuleCount = 5, size=70 }: Props) => {
  const { themeStyles, appContainerStyles, manualGradientColors } =
    useGlobalStyle();
  const {  navigateToMomentFocus } = useAppNavigations();

 
 
  return (
    <GlobalPressable
      style={({ pressed }) => [
        styles.container,
        {
          borderColor: themeStyles.primaryText.color,
          
          // padding: 10,
          // width: ITEM_SIZE + 20,
          // height: ITEM_SIZE + 20,
          borderRadius: 999,
          backgroundColor: themeStyles.primaryBackground.backgroundColor,
          // backgroundColor: pressed ? "darkred" : "red",

          flex: 1,
          opacity: pressed ? 0.8 : 1, // optional visual feedback
        },
      ]}
      onPress={navigateToMomentFocus}
    >
      <MaterialCommunityIcons
       // name={"thought-bubble"}
        name={"leaf"}
        //   size={300}
        size={size}
        // backgroundColor={themeStyles.primaryBackground.backgroundColor}
        //   color={themeStyles.genericTextBackground.backgroundColor}

        color={themeStyles.primaryText.color}
        style={[{ borderColor: themeStyles.primaryText.color }]}
      />
      <View
        style={[
          styles.textPlacement,
          { alignItems: "center", width: 70 * 0.7 },
        ]}
      >
        <Text
          style={[
            themeStyles.primaryText,

            {
              fontSize: 16,
              fontWeight: "bold",
              color: themeStyles.primaryBackground.backgroundColor,
            },
          ]}
        >
          {capsuleCount}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 12, 
          right: 6,
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: manualGradientColors.homeDarkColor,
          backgroundColor: manualGradientColors.lightColor,
        }}
      >
        <MaterialCommunityIcons
          name={"plus"}
          color={manualGradientColors.homeDarkColor}
          size={26}
        />
      </View> 
    </GlobalPressable>
  );
};

const styles = StyleSheet.create({
  textPlacement: {
    position: "absolute",
    zIndex: 60000,
    top: -52,
    right: 22,
  },
  addButtonPlacement: {
    position: "absolute",
    zIndex: 60000,
    top: -42,
    right: 17,
  },

  container: {
    position: "absolute",
    right: -0,
    top: -80,
    zIndex: 800000,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default LargeThoughtBubble;
