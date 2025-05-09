import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import RightArrowNoStemSolidSvg from "@/app/assets/svgs/right-arrow-no-stem-solid.svg";
import HelperTag from "@/app/components/alerts/HelperTag";

import LizardHands from "@/app/components/appwide/logo/LizardHands";

const DOUBLE_TAP_DELAY = 300;

const SlideUpToOpen = ({
  onPress,
  triggerReappear,
  onDoubleTap = () => {},
  targetIcon: TargetIcon,
  height = 180,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [manualOpacity, setManualOpacity] = useState(1);
  const position = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const isDraggingRef = useRef(false);

  const screenHeight = Dimensions.get("window").height; // Full screen height
  const {
    manualGradientColors,
    themeStyles,
    gradientColors,
    gradientColorsHome,
  } = useGlobalStyle();
  const [helpersVisible, setHelpersVisible] = useState(false);
  const [firstLizardVisible, setFirstLizardVisible] = useState(false);
  const [secondLizardVisible, setSecondLizardVisible] = useState(false);
  const [thirdLizardVisible, setThirdLizardVisible] = useState(false);

  const lastTapRef = useRef(0);

  const rotation = position.interpolate({
    inputRange: [-screenHeight / 20, 0],
    outputRange: ["-90deg", "0deg"],
    extrapolate: "clamp",
  });

  const isMirrored = position.__getValue() < 0 ? -1 : 1;

  useEffect(() => {
    if (triggerReappear) {
      Animated.timing(position, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setIsPressed(false);
      setIsDragging(false);
      isDraggingRef.current = false;

      setManualOpacity(1);
    }
  }, [triggerReappear]);

  const handlePress = () => {
    if (onPress) onPress();
  };

  const handleDoubleTap = () => {
    if (onDoubleTap) onDoubleTap();
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      //console.log("double tapped!");
      handleDoubleTap();
    } else {
      lastTapRef.current = now;
    }
  };

  const onInitialPress = () => {
    setHelpersVisible(true);
    //console.log("slide up button pressed");
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Trigger the initial press action
        handleTap();
        if (onInitialPress) {
          onInitialPress();
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy <= 0 && Math.abs(gestureState.dy) <= screenHeight) {
          position.setValue(gestureState.dy);

          if (Math.abs(gestureState.dy) >= screenHeight * 0.04) {
            //.09
            //&& !isDraggingRef.current
            setHelpersVisible(false);
          }

          if (Math.abs(gestureState.dy) >= screenHeight * 0.18) {
            //console.log("Button is at the top of the screen");
            // Set opacity to zero
            setManualOpacity(0);
          }

          if (Math.abs(gestureState.dy) < screenHeight * 0.18) {
            // console.log("Button is at the top of the screen");
            // Set opacity to zero
            setManualOpacity(1);
          }

          if (Math.abs(gestureState.dy) >= screenHeight * 0.001) {
            //&& !isDraggingRef.current
            isDraggingRef.current = true;
            setIsDragging(true);
            setFirstLizardVisible(true);
            setSecondLizardVisible(false);

            setThirdLizardVisible(false);
            setHelpersVisible(false); //second earlier one
          }
          if (Math.abs(gestureState.dy) >= screenHeight * 0.07) {
            setFirstLizardVisible(false);
            setSecondLizardVisible(true);

            setThirdLizardVisible(false);
          }

          if (Math.abs(gestureState.dy) >= screenHeight * 0.14) {
            setFirstLizardVisible(false);
            setSecondLizardVisible(false);
            setThirdLizardVisible(true);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) >= screenHeight * 0.07) {
          //console.log("press in slider up");
          setFirstLizardVisible(false);
          setSecondLizardVisible(false);

          setThirdLizardVisible(false);
          handlePress();
          setIsPressed(true);
        }

        // Triggering the correct animation based on isPressed state
        if (!isPressed) {
          setHelpersVisible(false);
          // Only bounce back if NOT pressed
          setFirstLizardVisible(false);
          setSecondLizardVisible(false);
          setThirdLizardVisible(false);

          isDraggingRef.current = false;
          setIsDragging(false);
          Animated.spring(position, {
            toValue: 0, // Move back to the original position
            useNativeDriver: true,
            speed: 15,
            bounciness: 8,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isPressed) {
      // If pressed, immediately move to the top
      Animated.timing(position, {
        toValue: -screenHeight / 1.22, // Move to the exact top
        duration: 200, // Fast movement
        useNativeDriver: true,
      }).start(() => {
        // After the animation completes, set opacity to 0
        setManualOpacity(0);
      });
    }
  }, [isPressed]);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: isDragging
            ? gradientColors.lightColor
            : "transparent",
        },
      ]}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          {
            opacity: manualOpacity,
            backgroundColor: isDragging
              ? "#000002"
              : themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
            transform: [{ translateY: position }, { rotate: rotation }],
          },
        ]}
      >
        <View
          style={{
            backgroundColor: manualGradientColors.homeDarkColor,
            alignItems: "center",
            justifyContent: "center",
            width: 63,
            height: 63,
            borderRadius: "50%",
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: manualGradientColors.lightColor,
          }}
        >
          <RightArrowNoStemSolidSvg
            height={36}
            width={36}
            color={manualGradientColors.lightColor}
          />
        </View>
      </Animated.View>
      {firstLizardVisible && (
        <View
          style={{
            position: "absolute",
            width: "auto",
            minWidth: 50,
            flex: 1,
            right: -32,
            height: "auto",
            top: 50,
          }}
        >
          <LizardHands
            color={themeStyles.genericTextBackground.backgroundColor}
          />
        </View>
      )}

      {secondLizardVisible && (
        <View
          style={{
            position: "absolute",
            width: "auto",
            minWidth: 50,
            flex: 1,
            height: "auto",
            top: 0,
          }}
        >
          <LizardHands
            isMirrored={true}
            color={themeStyles.genericTextBackground.backgroundColor}
          />
        </View>
      )}

      {thirdLizardVisible && (
        <View
          style={{
            position: "absolute",
            width: "auto",
            minWidth: 50,
            flex: 1,
            height: "auto",
            top: -50,
          }}
        >
          <LizardHands
            color={themeStyles.genericTextBackground.backgroundColor}
          />
        </View>
      )}
      {helpersVisible && (
        <>
          <View
            style={{
              position: "absolute",
              width: "auto",
              minWidth: 50,
              flex: 1,
              height: "auto",
              top: 40,
            }}
          >
            <HelperTag
              helperText="details"
              textColor={themeStyles.genericText.color}
              backgroundColor={
                themeStyles.genericTextBackgroundShadeTwo.backgroundColor
              }
            />
          </View>
        </>
      )}
      {TargetIcon && helpersVisible && (
        <View style={styles.iconContainer}>
          <RightArrowNoStemSolidSvg
            height={30}
            width={30}
            color={
              isDragging || helpersVisible
                ? gradientColorsHome.lightColor
                : "transparent"
            }
            style={{ transform: [{ rotate: "-90deg" }] }} // Apply the rotation here
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 50,
    zIndex: 5000,
    elevation: 5000,
  },
  slider: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 50,
    borderWidth: 0,
    borderColor: "transparent",
    zIndex: 5000,
    elevation: 5000,
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5000,
    elevation: 5000,
  },
});

export default SlideUpToOpen;
