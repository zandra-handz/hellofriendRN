import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import DragRightThickOutlineSvg from "../assets/svgs/drag-right-thick-outline.svg";
import LizardHandsHorizontal from "../components/LizardHandsHorizontal";

const SlideToAdd = ({
  onPress,
  sliderText = "Label",
  sliderTextSize= 11,
  targetIcon: TargetIcon,
  width = Dimensions.get("window").width - 50,
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const isDraggingRef = useRef(false); // Use ref for immediate updates
  const { themeStyles, gradientColors, gradientColorsHome } = useGlobalStyle();

  const [firstLizardVisible, setFirstLizardVisible] = useState(false);
  const [secondLizardVisible, setSecondLizardVisible] = useState(false);
  const [thirdLizardVisible, setThirdLizardVisible] = useState(false);
  const [fourthLizardVisible, setFourthLizardVisible] = useState(false);
  const [fifthLizardVisible, setFifthLizardVisible] = useState(false);
  const [sixthLizardVisible, setSixthLizardVisible] = useState(false);
  const [seventhLizardVisible, setSeventhLizardVisible] = useState(false);

  const handlePress = () => {
    if (onPress) onPress();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= width) {
          position.setValue(gestureState.dx);

          if (gestureState.dx >= width * 0.2 && !isDraggingRef.current) {
            isDraggingRef.current = true; // Update ref immediately
            setIsDragging(true); // Update state for UI
            setFirstLizardVisible(true);
            setSecondLizardVisible(false);
            setThirdLizardVisible(false);
            setFourthLizardVisible(false);
            setFifthLizardVisible(false);
            setSixthLizardVisible(false);
            setSeventhLizardVisible(false);
          }

          if (gestureState.dx >= width * 0.4) {
            setFirstLizardVisible(false);
            setSecondLizardVisible(true);
            setThirdLizardVisible(false);
            setFourthLizardVisible(false);
            setFifthLizardVisible(false);
            setSixthLizardVisible(false);
            setSeventhLizardVisible(false);
          }

          if (gestureState.dx >= width * 0.5) {
            setFirstLizardVisible(false);
            setSecondLizardVisible(false);
            setThirdLizardVisible(true);
            setFourthLizardVisible(false);
            setFifthLizardVisible(false);
            setSixthLizardVisible(false);
            setSeventhLizardVisible(false);
          }
          //THIS IS SO SILLY
          if (gestureState.dx >= width * 0.6) {
            setFirstLizardVisible(false);
            setSecondLizardVisible(false);
            setThirdLizardVisible(false);
            setFourthLizardVisible(true);
            setFifthLizardVisible(false);
            setSixthLizardVisible(false);
            setSeventhLizardVisible(false);
          }

          if (gestureState.dx >= width * 0.7) {
            setFirstLizardVisible(false);
            setSecondLizardVisible(false);
            setThirdLizardVisible(false);
            setFourthLizardVisible(false);
            setFifthLizardVisible(true);
            setSixthLizardVisible(false);
            setSeventhLizardVisible(false);
          }

          if (gestureState.dx >= width * 0.77) {
            setFirstLizardVisible(false);
            setSecondLizardVisible(false);
            setThirdLizardVisible(false);
            setFourthLizardVisible(false);
            setFifthLizardVisible(false);
            setSixthLizardVisible(true);
            setSeventhLizardVisible(false);
          }
          if (gestureState.dx >= width * 0.8) {
            setFirstLizardVisible(false);
            setSecondLizardVisible(false);
            setThirdLizardVisible(false);
            setFourthLizardVisible(false);
            setFifthLizardVisible(false);
            setSixthLizardVisible(false);
            setSeventhLizardVisible(true);
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= width * 0.7) {
          handlePress();
          setIsPressed(true);
        }

        
        setFirstLizardVisible(false);
        setSecondLizardVisible(false);
        setThirdLizardVisible(false);
        setFourthLizardVisible(false);
        setFifthLizardVisible(false);
        setSixthLizardVisible(false);
        setSeventhLizardVisible(false);

        isDraggingRef.current = false; // Reset ref immediately
        setIsDragging(false); // Reset state for UI

        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: true,
          speed: 15, // Faster spring animation
          bounciness: 8, // Lower bounciness for quicker reset
        }).start();
      },
    })
  ).current;

  const sliderWidth = width;

  return (
    <View
      style={[
        styles.container,
        {
          width: sliderWidth,
          backgroundColor: isDragging
            ? gradientColors.lightColor
            : "transparent", //themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
        },
      ]}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slider,
          {
            flexDirection: "row",
            backgroundColor: isDragging
              ? "#000002"
              : 'transparent', //themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
            transform: [{ translateX: position }],
            width: "auto",
          },
        ]}
      >
        <Text style={[themeStyles.genericText, {fontSize: sliderTextSize, opacity: .5}]}>
          {sliderText}
        </Text>

        <View style={{ paddingHorizontal: "2%" }}>
          <DragRightThickOutlineSvg
            height={18}
            width={18}
            style={[themeStyles.genericText, {opacity: .6}]}
          />
        </View>
      </Animated.View>

      {TargetIcon && !sixthLizardVisible && !seventhLizardVisible && (
        <View style={styles.iconContainer}>
          <TargetIcon
            height={30}
            width={30}
            color={isDragging ? gradientColorsHome.lightColor : "transparent"}
          />
        </View>
      )}
      {firstLizardVisible && (
        <View
          style={{
            position: "absolute",
            width: "auto",
            minWidth: 50,
            flex: 1,
            height: "auto",
            top: -26,
            left: 40,
          }}
        >
          <LizardHandsHorizontal
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
            top: -20,
            left: 70,
          }}
        >
          <LizardHandsHorizontal
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
            top: -26,
            left: 110,
          }}
        >
          <LizardHandsHorizontal
            color={themeStyles.genericTextBackground.backgroundColor}
          />
        </View>
      )}
      {fourthLizardVisible && (
        <View
          style={{
            position: "absolute",
            width: "auto",
            minWidth: 50,
            flex: 1,
            height: "auto",
            top: -20,
            left: 150,
          }}
        >
          <LizardHandsHorizontal
            isMirrored={true}
            color={themeStyles.genericTextBackground.backgroundColor}
          />
        </View>
      )}
      {fifthLizardVisible && (
        <View
          style={{
            position: "absolute",
            width: "auto",
            minWidth: 50,
            flex: 1,
            height: "auto",
            top: -26,
            left: 190,
          }}
        >
          <LizardHandsHorizontal
            color={themeStyles.genericTextBackground.backgroundColor}
          />
        </View>
      )}
      {sixthLizardVisible && (
        <View
          style={{
            position: "absolute",
            width: "auto",
            minWidth: 50,
            flex: 1,
            height: "auto",
            top: -20,
            left: 210,
          }}
        >
          <LizardHandsHorizontal
            isMirrored={true}
            color={themeStyles.genericTextBackground.backgroundColor}
          />
        </View>
      )}

      {seventhLizardVisible && (
        <View
          style={{
            position: "absolute",
            width: "auto",
            minWidth: 50,
            flex: 1,
            height: "auto",
            top: -24,
            left: 260,
          }}
        >
          <LizardHandsHorizontal
            color={themeStyles.genericTextBackground.backgroundColor}
          />
        </View>

        //SEVEN LIZARDS ALL AROUND ME
        //SEVEN LIZARDS IN MY HOUSE
        //i will fix this later
        //pRoTOtype
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    margin: 0,
    overflow:'hidden',
  },
  text: {
    position: "absolute",
    color: "#333",
    fontSize: 16,
  },
  slider: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "3%",
    height: "100%",
    borderRadius: 30,
    borderWidth: 0.8,
    borderColor: "transparent",
    zIndex: 4000,
    elevation: 4000,
  }, 
  iconContainer: {
    position: "absolute",
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SlideToAdd;
