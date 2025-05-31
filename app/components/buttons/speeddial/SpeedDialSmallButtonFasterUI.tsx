import React from "react";
import { View, Text, TouchableOpacity, DimensionValue, Animated } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

// 'faster' just means uses vector icons instead of svgs
interface SpeedDialSmallButtonFasterUIProps {
  containerWidth: DimensionValue | undefined;
  circleSize: number;
  iconLabel: string;
  icon: React.ReactElement;
  travellingIconOpacity: Animated.Value;
  travellingIcon: React.ReactElement; // root icon
  //   iconSize: number;
  iconColor: string;
  backgroundColor: string;
  onPress: () => void;
}

// WARNING: positioning of travellingIcon is temporary/not an exact science rn
const SpeedDialSmallButtonFasterUI: React.FC<
  SpeedDialSmallButtonFasterUIProps
> = ({
  containerWidth = 73,
  circleSize = 70,
  iconLabel = "test label",
  icon,
  travellingIconOpacity,
  travellingIcon,
  //   iconSize = 40,
  iconColor = "",
  backgroundColor = "",
  onPress = () =>
    console.warn("Warning! No function passed to SpeedDialSmallButtonUI press"),
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyle();

  const overlayBackgroundColor = "rgba(0, 0, 0, 0.6)";
  return (
    <View
      style={[
        appContainerStyles.speedDialSmallButtonContainer,
        { width: containerWidth },
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: 30,
          right: -34,
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingTop: circleSize / 3,
          height: "100%",
          opacity: travellingIconOpacity,
        }}
      >
        {/* <View style={{backgroundColor: overlayBackgroundColor, padding: 4, borderRadius: 20 }}>
         */}
        {travellingIcon}
        
            
        {/* </View> */}
      </Animated.View>
      <TouchableOpacity
        onPress={onPress}
        style={[
          appContainerStyles.speedDialSmallButton,
          {
            width: circleSize,
            height: circleSize,
            borderColor: iconColor,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        {icon}
      </TouchableOpacity>
<View
  style={{
    backgroundColor: overlayBackgroundColor, // semi-transparent black
    position: "absolute",
    bottom: -28,
    marginVertical: 2,
    borderRadius: 10,
    padding: 4,
    width: 70,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    height: 'auto',
  }}
>
        <Text
          numberOfLines={1}
          style={[
            themeStyles.genericText,
            { fontWeight: "bold", fontSize: 11, textAlign: "center" },
          ]}
        >
          {iconLabel}
        </Text>
      </View>
    </View>
  );
};

export default SpeedDialSmallButtonFasterUI;
