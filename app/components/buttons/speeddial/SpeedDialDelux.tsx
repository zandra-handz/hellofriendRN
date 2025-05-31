import React, { useState, useRef, useCallback } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SpeedDialSmallButtonUI from "./SpeedDialSmallButtonUI";
import SpeedDialRootFasterUI from "./SpeedDialRootFasterUI";
import ButtonGoToAddMoment from "../moments/ButtonGoToAddMoment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import SpeedDialSmallButtonFasterUI from "./SpeedDialSmallButtonFasterUI";
import { useFocusEffect } from "@react-navigation/native";
import AddMomentButton from "../moments/AddMomentButton";

interface SpeedDialDeluxProps {
  rootIcon: React.FC<SvgProps>;
  topIcon: React.FC<SvgProps>;
  topOnPress: () => void;
  icon: React.ReactElement;
  midOnPress: () => void;
  deluxButton: React.ReactElement; // use: <View>{deluxButton}</View>
  //deluxButton: () => JSX.Element; // use: <View>{deluxButton()}</View>
}

const SpeedDialDelux: React.FC<SpeedDialDeluxProps> = ({
  rootIcon,
  topIcon,
  topOnPress,
  midIcon,
  midOnPress,
  deluxButton,
}) => {
  const topAnimatedHeight = -60;
  const midAnimatedHeight = -38;

  const moveDeluxButtonOffScreen = -200;

  const topMidIconSize = 32;
  const topMidDiameter = 50;
  const helperIconSize = 22;

  const rootButtonIconSize = 42; // for run-fast

  const smallButtonContainerHeight = 60; // adjust this if labels do not have enough space

  const { appContainerStyles, manualGradientColors } = useGlobalStyle();

  const iconColor = manualGradientColors.lightColor;
  const buttonBackgroundColor = manualGradientColors.homeDarkColor;

  const [expanded, setExpanded] = useState(false);
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(1)).current;
  const animation4 = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current; // New animation value for rotation

  useFocusEffect(
    useCallback(() => {
      return () => {
        Animated.parallel([
          Animated.timing(rotation, {
            toValue: 0, // Reset rotation
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(animation2, {
              toValue: 0,
              duration: 40,
              useNativeDriver: true,
            }),
            Animated.timing(animation3, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(animation1, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animation4, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => setExpanded(false));
      };
    }, [])
  );

  const toggleButtons = () => {
    if (!expanded) {
      setExpanded(true);

      Animated.parallel([
        Animated.timing(animation1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation2, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(animation4, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animation3, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Collapses option buttons
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 0, // Reset rotation
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(animation2, {
            toValue: 0,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(animation3, {
            toValue: 1,
            duration: 140,
            useNativeDriver: true,
          }),
          Animated.timing(animation1, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animation4, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => setExpanded(false));
    }
  };

  const buttonTranslateY1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, midAnimatedHeight],
  });

  const buttonTranslateY2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, topAnimatedHeight],
  });

    const buttonTranslateX3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: [ moveDeluxButtonOffScreen, 0],
  });

  return (
    <View style={appContainerStyles.speedDialPositioning}>
      <Animated.View
        style={[
          styles.smallButtonContainer,
          {
            height: smallButtonContainerHeight,

            transform: [{ translateY: buttonTranslateY2 }],
            opacity: animation2,
          },
        ]}
      >
        <SpeedDialSmallButtonFasterUI
          onPress={topOnPress}
          containerWidth={"auto"}
          iconColor={iconColor}
          iconLabel={"Locations"}
          backgroundColor={buttonBackgroundColor}
          circleSize={topMidDiameter}
          icon={
            <SimpleLineIcons
              name="directions"
              size={topMidIconSize}
              color={iconColor}
            />
          }
          travellingIcon={
            <MaterialCommunityIcons
              name="run-fast"
              size={helperIconSize}
              color={iconColor}
            />
          }
          travellingIconOpacity={animation4}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.smallButtonContainer,
          {
            height: smallButtonContainerHeight,
            transform: [{ translateY: buttonTranslateY1 }],
            opacity: animation1,
            top: 0,
          },
        ]}
      >
        <SpeedDialSmallButtonFasterUI
          onPress={midOnPress}
          containerWidth={"auto"}
          circleSize={topMidDiameter}
          iconLabel={"Add hello"}
          iconColor={iconColor}
          backgroundColor={buttonBackgroundColor}
          travellingIcon={
            <MaterialCommunityIcons
              name="run-fast"
              size={helperIconSize}
              color={iconColor}
            />
          }
          travellingIconOpacity={animation4}
          icon={
            <MaterialCommunityIcons
              name="hand-wave-outline"
              size={topMidIconSize}
              color={iconColor}
            />
          }
        />
      </Animated.View>

      <Animated.View
        style={{ bottom: 76, position: "absolute", opacity: animation3,
            transform: [{ translateX: buttonTranslateX3 }],
         }}
      >
        {deluxButton}
      </Animated.View>

      <SpeedDialRootFasterUI
        expanded={expanded}
        iconColor={iconColor}
        iconOpacity={animation3}
        backgroundColor={buttonBackgroundColor}
        icon={
          <MaterialCommunityIcons
            name="run-fast"
            size={rootButtonIconSize}
            color={iconColor}
          />
        }
        iconSize={rootButtonIconSize}
        onPress={toggleButtons}
        rotation={rotation} // Pass rotation to the main button
      />
    </View>
  );
};

const styles = StyleSheet.create({
  smallButtonContainer: {
    // justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
});

export default SpeedDialDelux;
