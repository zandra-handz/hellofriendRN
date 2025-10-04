import { View, Text, OpaqueColorValue, StyleSheet } from "react-native";
import React from "react"; 
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import manualGradientColors from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import GlobalPressable from "../appwide/button/GlobalPressable";
import InfoItem from "../headers/InfoItem";

import HelpButton from "./HelpButton";

type Props = {
  absolute: boolean;
  //   friendTheme?: ThemeAheadOfLoading;
  label: string;
  subLabel: string;

  rightSideElement?: React.ReactElement;
  labelColor: OpaqueColorValue;
  onMainPress: () => void;
  onRightPress: () => void;
  onLeftPress: () => void;
};

const TreeModalBigButtonFocusLocation = ({
  height,
  safeViewPaddingBottom,
  absolute = false,
  friendTheme,
  rightSideElement,
  label,
  subLabel,
  labelColor,
  backgroundColor,
  onLeftPress,
  onMainPress,
  onRightPress,
  trayItems, // taking the place of infoItems that was in this component's inspo component
}: Props) => {
  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  // const BOTTOM_SPACER = 60; // taken from FriendHistoryModal
  // moved height to parent in order to sync height with map padding, since map is below this component
  const bottomSpacer = height;

  return (
    <Animated.View>
      <Animated.View
        entering={FadeInUp.delay(500)}
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          borderRadius: 30,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          padding: 30,
          paddingTop: 18,
          paddingBottom: 26,
         
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: "red",
          backgroundColor: backgroundColor,

          alignItems: "center",
          height: "auto",
        }}
      >
        <InfoItem
        infoText={'HIIIIIIIIIIIIIIIIIIIIIIIIIIII'}
        primaryColor={labelColor}/>
        <HelpButton
          iconColor={labelColor}
          fontColor={labelColor}
          onPress={() => console.log("put something here")}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(800)}
        exiting={FadeOutUp.duration(0)}
        style={{
          height: bottomSpacer,
          paddingBottom: safeViewPaddingBottom,
          position: absolute ? "absolute" : "relative",
          bottom: -safeViewPaddingBottom,

          width: "100%",
          backgroundColor:
            friendTheme === undefined
              ? manualGradientColors.lightColor
              : friendTheme.lightColor, //to match friend profile button circle color
          borderRadius: 10,
        }}
      >
        <GlobalPressable
          onPress={onMainPress != undefined ? onMainPress : undefined}
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          ></View>
          <GlobalPressable
            onPress={onRightPress}
            style={{
              height: 22,
              width: 22,
              height: "100%",
              position: "absolute",
              right: 0,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              // backgroundColor: manualGradientColors.homeDarkColor,
            }}
          >
            <MaterialCommunityIcons
              name={"send-circle-outline"}
              size={22}
              color={manualGradientColors.homeDarkColor}
            />
          </GlobalPressable>

          <GlobalPressable
            onPress={onLeftPress}
            style={{
              position: "absolute",
              left: 0,
              height: "100%",
              alignItems: "center",
              // backgroundColor: "orange",
            }}
          >
            <MaterialIcons
              name={"keyboard-arrow-left"}
              color={labelColor}
              size={22}
            />
          </GlobalPressable>

          <View
            style={{
              position: "absolute",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text
              numberOfLines={1}
              style={[
                welcomeTextStyle,
                {
                  // color: primaryColor,
                  fontSize: 20,

                  fontFamily: "Poppins-Bold",
                  color: labelColor,
                },
              ]}
            >
              {label}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                subWelcomeTextStyle,
                {
                  lineHeight: 12,
                  fontFamily: "Poppins-Bold",
                  color: manualGradientColors.darkHomeColor,
                  fontSize: 11,
                },
              ]}
            >
              {subLabel}
            </Text>
          </View>
        </GlobalPressable>
      </Animated.View>
    </Animated.View>
  );
};

export default TreeModalBigButtonFocusLocation;
