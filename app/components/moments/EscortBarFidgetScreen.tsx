import { View, Text, Pressable } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { AppFontStyles } from "@/app/styles/AppFonts";

import GlobalPressable from "../appwide/button/GlobalPressable";
 
import ActionAndBack from "./ActionAndBack";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  onBackPress: () => void;
  label: string;
  iconName: string;
  forwardFlowOn: boolean;
  primaryColor: string;
  primaryBackground: string;
};

const EscortBarFidgetScreen = ({
  onPress,
  onBackPress,
  onCenterPress,
  label = "Save and Continue",
  labelCenter = "Recenter",
  iconName = "keyboard-arrow-left",
 
  style,
  primaryColor,
  primaryBackground,
}: Props) => {
  const { navigateBack } = useAppNavigations();

const onGoBack = async () => {
  if (onBackPress) {
    // wait for onBackPress to finish if it's async
    await onBackPress();
  }
  navigateBack();
};

  return (
    <Animated.View
      style={style}
      //  entering={SlideInDown} exiting={SlideOutDown}
    >
      <GlobalPressable
        onPress={onPress}
        style={[
          {
            height: 50,
            paddingHorizontal: 5,
            flexDirection: "row",
            backgroundColor: "orange",

            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 999,
            backgroundColor: primaryBackground,
          },
        ]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            hitSlop={10}
            style={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={onGoBack}
          >
            <MaterialIcons
              name={`${iconName}`}
              size={20}
              color={primaryColor}
            />
          </Pressable>


                    <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Text
              style={[
                AppFontStyles?.subWelcomeText,
                { color: primaryColor, fontSize: 13, marginRight: 12 },
              ]}
            >
              {labelCenter}
            </Text>

         
              <ActionAndBack onPress={onCenterPress} iconName={"refresh"} rounded={true} />
        
          </View>
                    <View style={{ alignItems: "center", flexDirection: "row" }}>
            <Text
              style={[
                AppFontStyles?.subWelcomeText,
                { color: primaryColor, fontSize: 13, marginRight: 12 },
              ]}
            >
              {label}
            </Text>

         
              <ActionAndBack onPress={onPress} iconName={"refresh"} rounded={true} />
        
          </View>


        </View>
      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBarFidgetScreen;
