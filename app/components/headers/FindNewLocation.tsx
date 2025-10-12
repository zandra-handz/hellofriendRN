import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState, useRef } from "react";

import SvgIcon from "@/app/styles/SvgIcons";
import Animated, { SlideInLeft } from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";
import SearchBarGoogleAddress from "../locations/SearchBarGoogleAddress";
import FlashMessage from "../alerts/FlashMessage";
import SearchBarAnimationWrapper from "../foranimations/SearchBarAnimationWrapper";

type Props = {
  userId: number;
  height: number;
  fontStyle?: number;
  addToOnPress?: ({
    categoryId,
    categoryName,
  }: {
    categoryId: number;
    categoryName: string;
  }) => void; //sets selected category Id after creating it
};

const FindNewLocation = ({
  primaryColor = "orange",
  primaryBackground,
  // userId,
  height = 60,
  fontStyle = 1,
  onPress,
  // addToOnPress,
}: Props) => {
  const searchStringRef = useRef(null);

  const HEIGHT = height - 20;
  const SEARCH_INPUT_LEFT_PADDING = 60; // so google search input isn't covered by back button
 
  const [mountingText, setMountingText] = useState("");

  const updateSearchString = (text) => {
 

    if (searchStringRef && searchStringRef.current) {
      searchStringRef.current.setText(text);
    }
  }; 

  const [flashMessage, setFlashMessage] = useState<null | {
    text: string;
    error: boolean;
    duration: number;
  }>(null);

  const [inputActive, setInputActive] = useState(false);

  const toggleInput = () => {
    setInputActive((prev) => !prev);
  };

  const flattenedButtonStyle = StyleSheet.flatten([
    styles.buttonContainer,
    {
      height: HEIGHT,
    },
  ]);
  return (
    <>
      {flashMessage && (
        <FlashMessage
          isInsideModal={true}
          message={flashMessage.text}
          error={flashMessage.error}
          onClose={() => setFlashMessage(null)}
        />
      )}

      <View
        style={{
          //   flexDirection: "row",
          //   alignItems: "center",

          paddingLeft: 0,
          borderRadius: fontStyle === 2 ? 20 : 0,
          width: inputActive ? "100%" : 60,
          height: !inputActive ? HEIGHT : "100%",
          backgroundColor: inputActive
            ? manualGradientColors.lightColor
            : "transparent",
        }}
      >
        <View style={styles.innerContainer}>
          <Pressable onPress={toggleInput} style={flattenedButtonStyle}>
            <SvgIcon
              name={!inputActive ? "plus" : "chevron_left"}
              color={manualGradientColors.homeDarkColor}
              size={16}
              style={{
                backgroundColor: manualGradientColors.lightColor,
                borderRadius: 999,
              }}
            />
          </Pressable>

          {!inputActive && (
            <View style={styles.labelWrapper}>
              <Text
                style={[
                  {
                    color: primaryColor,
                    fontSize: fontStyle === 2 ? 18 : 15,
                    fontWeight: fontStyle === 2 ? "regular" : "bold",
                    fontFamily: fontStyle === 2 ? "Poppins-Regular" : undefined,
                  },
                ]}
              >
                Add new
              </Text>
            </View>
          )}
        </View>

        {inputActive && (
          <Animated.View
            key="inputBox"
            entering={SlideInLeft}
            style={styles.animatedViewContainer}
          >
            <SearchBarAnimationWrapper>
              <View style={{ width: "100%" }}>
                <SearchBarGoogleAddress
                  ref={searchStringRef}
                  mountingText={mountingText}
                  autoFocus={true}
                  onPress={onPress}
                  searchBarLeftPadding={40}
                  visible={true}
                  onTextChange={updateSearchString}
                  paddingLeft={SEARCH_INPUT_LEFT_PADDING}
                  primaryColor={primaryColor}
                  primaryBackground={primaryBackground}
                />
              </View>
            </SearchBarAnimationWrapper>
          </Animated.View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    width: "auto",
    paddingHorizontal: 10,
    zIndex: 40000,
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 36,
    width: 200,
    height: "100%",
  },
  animatedViewContainer: {
    width: "100%",
    position: "absolute",
    left: 0,
    right: 0,
  },
});

export default FindNewLocation;
