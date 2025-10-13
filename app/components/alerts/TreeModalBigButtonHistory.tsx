import {
  View,
  Text,
  OpaqueColorValue,
  StyleSheet,
  DimensionValue,
} from "react-native";
import React from "react";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";
import GlobalPressable from "../appwide/button/GlobalPressable";
import SvgIcon from "@/app/styles/SvgIcons";
import InfoItemLocation from "../locations/InfoItemLocation";

import { ThemeAheadOfLoading } from "@/src/types/FriendTypes";
import { FocusedLocation } from "@/src/types/LocationTypes";

// import HelpButton from "./HelpButton";

type Props = {
  userId: number;
  friendId: number;
  friendName: string;
  absolute: boolean;
  height: DimensionValue;
  safeViewPaddingBottom: number;
  themeAheadOfLoading: ThemeAheadOfLoading;
  location: FocusedLocation;
  label: string;
  subLabel: string;
  primaryColor: string;

  rightSideElement?: React.ReactElement;
  labelColor: OpaqueColorValue;
  onMainPress: () => void;
  onRightPress: () => void;
  onLeftPress: () => void;
  openItems: (data: object) => void; //double check this
  closeItems: () => void;
};

const TreeModalBigButtonHistory= ({
  userId,
  friendId,
  friendName,
  height,
  safeViewPaddingBottom,
  themeAheadOfLoading,
  absolute = false,
 
  label,
  primaryColor = "orange",
  subLabel,
  labelColor,
  onLeftPress,
  onMainPress,
  onRightPress,
 
  openItems,
  closeItems,
}: Props) => {
  const bottomSpacer = height;

  const CARD_BACKGROUND = "rgba(0,0,0,0.8)";

  const flattenedLabelStyle = StyleSheet.flatten([
    styles.labelText,
    { color: labelColor },
  ]);
  const flattenedSubLabelStyle = StyleSheet.flatten([
    styles.subLabelText,
    { color: labelColor },
  ]);

  const flattenedContainerStyle = StyleSheet.flatten([
    styles.container,
    { backgroundColor: CARD_BACKGROUND },
  ]);

  return (
    <Animated.View style={styles.outerContainer}>
      <Animated.View
        entering={FadeInUp.delay(500)}
        style={flattenedContainerStyle}
      >
        {/* <InfoItemLocation
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
        /> */}
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
            themeAheadOfLoading === undefined
              ? manualGradientColors.lightColor
              : themeAheadOfLoading.lightColor, //to match friend profile button circle color
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
            <SvgIcon
              name={"send_circle_outline"}
              size={50} 
              color={labelColor}
            />
          </GlobalPressable>

          <GlobalPressable onPress={onLeftPress} style={styles.leftPressButton}>
            <SvgIcon
              name={"chevron_left"}
              size={22} 
              color={labelColor}
            />
          </GlobalPressable>

          <View
            style={styles.labelsContainer}
          >
            <Text numberOfLines={1} style={flattenedLabelStyle}>
              {label}
            </Text>
            <Text numberOfLines={1} style={flattenedSubLabelStyle}>
              {subLabel}
            </Text>
          </View>
        </GlobalPressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0, // EYEBALL
  },
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 30,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 8,
    paddingBottom: 26,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "red",
    alignItems: "center",
    flex: 1,
  },
  mainPressButton: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  rightPressButton: {
    width: 50,
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
  labelsContainer: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
  },
  labelText: {
    fontSize: 20,
    // lineHeight: 34,
    fontFamily:  'Poppins_700Bold',
  },
  subLabelText: { lineHeight: 12, fontFamily:  'Poppins_700Bold', fontSize: 11 },
});

export default TreeModalBigButtonHistory;
