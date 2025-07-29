import { View, Text } from "react-native";
import React from "react";
import Animated, {
  SlideInDown,
  SlideOutDown, 
} from "react-native-reanimated";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import {   MaterialIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";
 
type Props = {
  onPress: () => void;
  label: string;
};

const EscortBarMinusWidth = ({ onPress, label = "navigator" }: Props) => {
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
 

      <GlobalPressable
        onPress={onPress}
        style={[ 
          {
            paddingHorizontal: 20,
            flexDirection: "row",
            width: "100%",
            paddingVertical: 12,
            paddingTop: 17,
            alignItems: "center",
            justifyContent: "center", 
            borderRadius: 10,
            marginVertical: 10,
          },
        ]}
      >
         <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 10,
            backgroundColor: themeStyles.primaryBackground.backgroundColor,
            zIndex: 0,
            marginLeft: 106,
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            borderRadius: 0,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            padding: 0,
            //  backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
            //  backgroundColor: themeStyles.primaryBackground.backgroundColor,
          }}
        >
          <View
            // onPress={navigateToMomentFocus}
            // hitSlop={20}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <MaterialIcons
              name={"keyboard-arrow-up"}
              size={16}
              color={manualGradientColors.homeDarkColor}
              color={themeStyles.primaryText.color}
              style={{
                position: "absolute",
                bottom: 17,
                // backgroundColor: themeStyles.primaryText.color,
                // borderRadius: 999,
              }}
            />
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.subWelcomeText,
                { fontSize: 13 },
              ]}
            >
              {label}
            </Text>
          </View>

          {/* <MaterialCommunityIcons
                 name={"arrow-up"}
                size={26}
                color={themeStyles.primaryText.color}
              /> */}
        </View>
      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBarMinusWidth;
