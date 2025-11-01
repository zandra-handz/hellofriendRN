import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import useAppNavigations from "@/src/hooks/useAppNavigations";
 
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
import ActionButton from "./ActionButton";  
type Props = {
  padding: number;
  height: number;
  borderRadius: number;
};

const SuggestedActions = ({
  darkerGlassBackground,

  primaryColor,
  primaryOverlayColor,
  primaryBackground,

  padding,
}: Props) => {
  const { navigateToAddFriend, navigateToSelectFriend} = useAppNavigations();

  const handleNavigateToSelectFriend = () => {
    navigateToSelectFriend({useNavigateBack: false})

  };

  const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.container,
          {
            padding: padding,
            backgroundColor: darkerGlassBackground,
            flexDirection: "row",
            justifyContent: "space-between",
          },
        ]}
      >
        <ActionButton
          onPress={handleSelectImage}
          backgroundColor={manualGradientColors.lightColor}
          iconColor={manualGradientColors.homeDarkColor}
          labelColor={primaryColor}
          iconName={'upload_outline'}
          label={"Upload"}
        />
        <ActionButton
          onPress={handleCaptureImage}
          backgroundColor={manualGradientColors.lightColor}
          iconColor={manualGradientColors.homeDarkColor}
          labelColor={primaryColor}
          iconName={'camera_outline'}
          label={"Pic"}
        />
        <ActionButton
          onPress={handleNavigateToSelectFriend}
          backgroundColor={manualGradientColors.lightColor}
          iconColor={manualGradientColors.homeDarkColor}
          labelColor={primaryColor}
          iconName={"account_switch_outline"}
          label={"Friends"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 110,
  },
  container: {
    marginVertical: 4,
    // minHeight: 96, // EYEBALL
    height: "100%",
    // flexShrink: 1,
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "space-between",
    width: "100%",
    width: "92%",
    width: "80%",
    // borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 999,
  },
  textContainer: {
    zIndex: 5,
    width: "70%",
    flexGrow: 1,
    flexWrap: "wrap",
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    fontWeight: "bold",
    lineHeight: 20,

    opacity: 0.9,
  },
  futureDateText: {
    lineHeight: 32,
    opacity: 0.9,
    paddingRight: 8, // EYEBALL
  },
  geckoButtonWrapper: {
    //   flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    height: "100%",

    right: 0,
    zIndex: 9000,
  },
});

export default SuggestedActions;
