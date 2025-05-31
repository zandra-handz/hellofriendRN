import React, { useEffect } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { SvgProps } from "react-native-svg";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import AddOutlineSvg from "@/app/assets/svgs/add-outline.svg";


interface SpeedDialRootUIProps {
  expanded: boolean;
  onPress: () => void;
  icon: React.FC<SvgProps>;
  iconSize: number;
  backgroundColor: string;
  iconColor: string;
  rotation: Animated.Value;
}

const SpeedDialRootUI: React.FC<SpeedDialRootUIProps> = ({
  expanded,
  onPress=() => console.warn('Warning! No function passed to SpeedDialRootUI press'),
  icon: Icon,
  iconSize = 52,
  backgroundColor,
  iconColor,
  rotation,
}) => {
  const { appContainerStyles } = useGlobalStyle();

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
        { backgroundColor: backgroundColor, borderColor: iconColor },
      ]}
    >
      <View style={{ position: "absolute", bottom: 13, right: 4 }}>
        <AddOutlineSvg width={20} height={20} color={iconColor} />
      </View>
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        {Icon && <Icon width={iconSize} height={iconSize} color={iconColor} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default SpeedDialRootUI;
