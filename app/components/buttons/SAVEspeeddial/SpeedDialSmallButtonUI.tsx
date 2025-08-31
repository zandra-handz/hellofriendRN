// import React from "react";
// import { View, TouchableOpacity, DimensionValue } from "react-native";
// import { SvgProps } from "react-native-svg";
// import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

// interface SpeedDialSmallButtonUIProps {
//   containerWidth: DimensionValue | undefined;
//   circleSize: number;
//   icon: React.FC<SvgProps>;
//   iconSize: number; 
//   onPress: () => void;
// }

// const SpeedDialSmallButtonUI: React.FC<SpeedDialSmallButtonUIProps> = ({
//   containerWidth = 73,
//   circleSize = 70,
//   icon: Icon,
//   iconSize = 40,
//   // iconColor = "",
//   // backgroundColor = "",
//   onPress = () =>
//     console.warn("Warning! No function passed to SpeedDialSmallButtonUI press"),
// }) => {

//   const { appContainerStyles, manualGradientColors } = useGlobalStyle();

//   const iconColor = manualGradientColors.lightColor;
//   const backgroundColor = manualGradientColors.homeDarkColor;

//   return (
//     <View style={[appContainerStyles.speedDialSmallButtonContainer, { width: containerWidth }]}>
//       <TouchableOpacity
//         onPress={onPress}
//         style={[
//           appContainerStyles.speedDialSmallButton,
//           {
//             width: circleSize,
//             height: circleSize,
//             borderColor: iconColor,
//             backgroundColor: backgroundColor,
//           },
//         ]}
//       >
//         {Icon && <Icon width={iconSize} height={iconSize} color={iconColor} />}
//       </TouchableOpacity>
//     </View>
//   );
// }; 

// export default SpeedDialSmallButtonUI;
