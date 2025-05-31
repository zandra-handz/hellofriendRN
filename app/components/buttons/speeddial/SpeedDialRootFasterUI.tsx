import React, { useEffect } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import AddOutlineSvg from "@/app/assets/svgs/add-outline.svg";

// 'faster' just means uses vector icons instead of svgs
interface SpeedDialRootFasterUIProps {
  expanded: boolean;
  onPress: () => void;
  icon: React.ReactElement;
  iconSize: number; 
  iconColor: string;
  iconOpacity: Animated.Value;
  backgroundColor: string;

  rotation: Animated.Value;
}

const SpeedDialRootFasterUI: React.FC<SpeedDialRootFasterUIProps> = ({
  expanded,
  onPress=() => console.warn('Warning! No function passed to SpeedDialRootUI press'),
  icon,
  iconColor,
  iconOpacity,
  backgroundColor,
  rotation,
}) => {
  const { appContainerStyles, manualGradientColors } = useGlobalStyle();


//   const iconColor = manualGradientColors.lightColor;
//   const backgroundColor = manualGradientColors.homeDarkColor;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: expanded ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-90deg"],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        appContainerStyles.speedDialRootButton,
        { backgroundColor: backgroundColor, borderColor: iconColor,
           
         },
      ]}
    >
      {/* <View style={{ position: "absolute", bottom: 13, right: 4 }}>
        <AddOutlineSvg width={20} height={20} color={iconColor} />
      </View> */}
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }], opacity: iconOpacity }}>
        {icon}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default SpeedDialRootFasterUI;
