import { View, Text, Pressable } from "react-native";
import React from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
 

import GlobalPressable from "../appwide/button/GlobalPressable";
import ToNextButton from "./ToNextButton";
import ActionAndBack from "./ActionAndBack";

import useAppNavigations from "@/src/hooks/useAppNavigations";
import { MaterialIcons  } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  label: string;
  iconName: string;
  forwardFlowOn: boolean;
};

const EscortBar = ({
  onPress,
  label = "Save and Continue",
  iconName = "keyboard-arrow-left",
  forwardFlowOn = true,
  manualGradientColors,
  subWelcomeTextStyle,
  primaryColor,
  primaryBackground,
}: Props) => { 
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
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 10, 
            backgroundColor: primaryBackground,
            // backgroundColor: "pink",
          },
        ]}
      >
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
            name={`${iconName}`}
            size={20}
            color={primaryColor}
          />
        </Pressable>

        <View style={{ alignItems: "center", flexDirection: "row"  }}>
          <Text
            style={[ 
              subWelcomeTextStyle,
              { color: primaryColor, fontSize: 13, marginRight: 12 },
            ]}
          >
            {label}
          </Text>
          {forwardFlowOn && <ToNextButton manualGradientColors={manualGradientColors} onPress={onPress} />}
          {!forwardFlowOn && <ActionAndBack manualGradientColors={manualGradientColors} onPress={onPress} />}
        </View>
      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBar;
