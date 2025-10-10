import { View, Text, OpaqueColorValue, StyleSheet } from "react-native";
import React from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors"; 
import GlobalPressable from "../appwide/button/GlobalPressable";

import InfoItemLocation from "../locations/InfoItemLocation";

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
  userId,
  friendId,
  friendName,
  height,
  safeViewPaddingBottom,
  themeAheadOfLoading,
  absolute = false,
  friendTheme,
  location,
  label,
  primaryColor = "orange",
  subLabel,
  labelColor, 
  onLeftPress,
  onMainPress,
  onRightPress,
  openAddresses,
  userAddress,
  friendAddress,
  openItems,
  closeItems,
}: Props) => { 
  const bottomSpacer = height;

  const CARD_BACKGROUND = "rgba(0,0,0,0.8)";

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: "100%",
        bottom: 0, // EYEBALL
      }}
    >
      <Animated.View
        entering={FadeInUp.delay(500)}
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          borderRadius: 30,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          // padding: 30,
          // paddingTop: 18,
          paddingHorizontal: 8,
          paddingBottom: 26,

          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: "red",
          backgroundColor: CARD_BACKGROUND,

          alignItems: "center",

          flex: 1,
        }}
      >
        <InfoItemLocation
          userId={userId}
          friendId={friendId}
          friendName={friendName}
          infoText={"HIIIIIIIIIIIIIIIIIIIIIIIIIIII"}
          primaryColor={primaryColor}
          onAddressSettingsPress={openAddresses}
          destinationLocation={location}
          userLocation={userAddress}
          friendLocation={friendAddress}
          themeAheadOfLoading={themeAheadOfLoading}
          onLocationDetailsPress={openItems}
          onCloseLocationDetails={closeItems}
          // children={
          //   <HelpButton
          //     iconColor={labelColor}
          //     fontColor={labelColor}
          //     onPress={() => console.log("put something here")}
          //   />
          // }
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
          style={styles.mainPressButton}
        >
          <GlobalPressable
            onPress={onRightPress}
            style={styles.rightPressButton}
          >
            <MaterialCommunityIcons
              name={"send-circle-outline"}
              size={28}
              color={manualGradientColors.homeDarkColor}
            />
          </GlobalPressable>

          <GlobalPressable onPress={onLeftPress} style={styles.leftPressButton}>
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
                { 
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

const styles = StyleSheet.create({
  mainPressButton: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  rightPressButton: {
    width: 28,
    height: "100%",
    position: "absolute",
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  leftPressButton: {
    position: "absolute",
    left: 0,
    height: "100%",
    alignItems: "center",
  },
});

export default TreeModalBigButtonFocusLocation;
