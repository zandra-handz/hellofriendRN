import { View, Pressable, Text, StyleSheet } from "react-native";
import React, { useRef, useMemo, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons"; 
import GlobalPressable from "../appwide/button/GlobalPressable";
import useAppNavigations from "@/src/hooks/useAppNavigations";

import GeckoSolidSvg from "@/app/assets/svgs/gecko-solid.svg";
import GoOptionsModal from "../headers/GoOptionsModal";

type Props = {
  friendId: number;
  padding: number;
  height: number;
  borderRadius: number;
};

const SuggestedHello = ({
  friendId,
  manualGradientColors,
  primaryColor,
  primaryOverlayColor,
  primaryBackground,
  welcomeTextStyle,
  subWelcomeTextStyle,
  friendFutureDate,
  padding,
  height,
  borderRadius = 10,
}: Props) => {
  const { navigateToFinalize } = useAppNavigations(); 

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const [lastPress, setLastPress] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const DOUBLE_PRESS_DELAY = 300;

  const handleGoPress = () => {
    const now = Date.now();

    if (lastPress && now - lastPress < DOUBLE_PRESS_DELAY) {
      // Double press detected
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      console.log("double press here!");
      navigateToFinalize();

      setLastPress(null);
    } else {
      // First press
      setLastPress(now);

      timeoutRef.current = setTimeout(() => {
        setOptionsModalVisible(true);
        setLastPress(null);
        timeoutRef.current = null;
      }, DOUBLE_PRESS_DELAY);
    }
  }; 
  const renderSuggestedHello = useMemo(() => {
    return (
      <View>
        <>
          <Text
            style={[
              {
                fontFamily: "Poppins-Regular",
                fontSize: subWelcomeTextStyle.fontSize + 3,

                color: primaryColor,
                opacity: 0.9, 
              },
            ]}
          >
            {friendId && friendFutureDate ? "Suggested hello" : "None"}
          </Text>
          <Text
            style={[
              {
                // alignSelf: 'center',
                color: primaryColor,
                lineHeight: 28,
                fontSize: welcomeTextStyle.fontSize - 5,
                opacity: 0.9,
                paddingRight: 50,
              },
            ]}
          >
            {friendFutureDate}
          </Text>
        </>
      </View>
    );
  }, [
    friendId,
    friendFutureDate,
    welcomeTextStyle, subWelcomeTextStyle,
    primaryColor,
    manualGradientColors,
    styles,
  ]);

  return (
    <View
      style={{
        marginVertical: 4,

        maxHeight: height + 40,
        flexShrink: 1,
        alignItems: "center",
        flexDirection: "row",

        justifyContent: "space-between",
        borderRadius: borderRadius,
        // backgroundColor: 'orange',
        padding: padding,
        paddingRight: 10,
        width: "100%",
        backgroundColor: primaryOverlayColor,
      }}
    >
      <View style={styles.textContainer}>
        {renderSuggestedHello}
        <Pressable
          // onPress={navigateToMoments}
          onPress={handleGoPress}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            backgroundColor: manualGradientColors.lightColor,
            justifyContent: "center",
            borderRadius: 10,
            padding: 4,
            width: "auto",
            minWidth: 50,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              position: "absolute",
              opacity: 0.9,
              position: "absolute",
              top: -60,
              right: 0,
              transform: [{ rotate: "90deg" }],
            }}
          >
            <GeckoSolidSvg
              width={140}
              height={140}
              color={manualGradientColors.homeDarkColor}
              style={{ opacity: 1 }}
            />
          </View>
          <View
            style={{
              bottom: -1,
              position: "absolute",
              alignItems: "center",
              flexDirection: "row",
              width: "100%",
              left: 2,
            }}
          >
            <Text
              style={{
                color: manualGradientColors.homeDarkColor,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              GO{" "}
            </Text>
            <FontAwesome6
              name={"arrow-right"}
              size={20}
              color={manualGradientColors.homeDarkColor}
            />
          </View>
        </Pressable>
      </View>

      <View
        style={{
          borderRadius: 20,
          // height: "100%",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></View>
      {optionsModalVisible && (
        <GoOptionsModal
        primaryColor={primaryColor}
        backgroundColor={primaryOverlayColor}
        modalBackgroundColor={primaryBackground}
        manualGradientColors={manualGradientColors}
        subWelcomeTextStyle={subWelcomeTextStyle}
          isVisible={optionsModalVisible}
          closeModal={() => setOptionsModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    zIndex: 5,
    // flexDirection: "column",
    width: "100%",
    flexWrap: "wrap",
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SuggestedHello;
