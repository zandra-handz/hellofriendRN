import { View, Text, Pressable } from "react-native";
import React from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import GlobalPressable from "../appwide/button/GlobalPressable";
import ToNextButton from "./ToNextButton";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  label: string;
};

const EscortBar = ({ onPress, label = "navigator" }: Props) => {
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  const { navigateBack } = useAppNavigations();
  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
      <GlobalPressable
        onPress={onPress}
        style={[
          {
            height: 50,
            paddingHorizontal: 10,
            flexDirection: "row",
            width: "100%",
            // paddingVertical: 12,
            // paddingTop: 17,
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 10,
            // marginVertical: 10,
            backgroundColor: themeStyles.primaryBackground.backgroundColor,
            // backgroundColor: "pink",
          },
        ]}
      >
        {/* <View
          style={{
             height: 50,
            position: "absolute",
            top: 0,
            bottom: 0,
            // left: 0,
            // right: 0,
            borderRadius: 10,
            backgroundColor: themeStyles.primaryBackground.backgroundColor,
            zIndex: 0,
            width: '100%',
      
          }}
        ></View> */}

        <Pressable
        hitSlop={10}
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={navigateBack}
        >
          <MaterialIcons
            name={"keyboard-arrow-left"}
            size={20}
            color={themeStyles.primaryText.color}
          />
        </Pressable>

        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <Text
            style={[
              themeStyles.primaryText,
              appFontStyles.subWelcomeText,
              { fontSize: 13, marginRight: 12 },
            ]}
          >
            Save and Continue
          </Text>
          <ToNextButton onPress={onPress} />
        </View>
      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBar;
