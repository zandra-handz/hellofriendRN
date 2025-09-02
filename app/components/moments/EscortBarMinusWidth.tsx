import { View, Text, Pressable } from "react-native";
import React from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { appFontStyles } from "@/src/hooks/StaticFonts";

import { MaterialIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  onPress: () => void;
  label: string;
};

const EscortBarMinusWidth = ({
  backgroundColor,
  overlayColor,
  primaryColor,
  navigateBack,
  onPress,
  label = "categories",
}: Props) => {
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
            // backgroundColor: "orange",

            marginVertical: 10,
          },
        ]}
      >
        <View
          style={{
            width: "auto",
            left: 0, // should match padding on right
            flex: 1,
            height: "100%",
            // backgroundColor: "red",
            position: "absolute",
            bottom: 0,
            top: 0,
            height: 50,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 50000,
          }}
        >
          <Pressable
            hitSlop={10}
            style={{
              borderRadius: 999,
              padding: 4,
              backgroundColor: overlayColor,
              alignItems: "center",
              justifyContent: "center",
            }}
            //   onPress={navigateBack}
            onPress={navigateBack}
          >
            <MaterialIcons
              name={"keyboard-arrow-left"}
              size={20}
              color={primaryColor}
            />
          </Pressable>
        </View>

        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 10,
            backgroundColor: backgroundColor,
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
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <MaterialIcons
              name={"keyboard-arrow-up"}
              size={16}
              //  color={homeDarkColor}
              color={primaryColor}
              style={{
                position: "absolute",
                bottom: 17,
              }}
            />
            <Text
              style={[
                appFontStyles.subWelcomeText,
                { color: primaryColor, fontSize: 13 },
              ]}
            >
              {label}
            </Text>
          </View>
        </View>
      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBarMinusWidth;
