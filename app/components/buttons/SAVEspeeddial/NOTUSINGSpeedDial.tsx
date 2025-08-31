// import React, { useState, useRef } from "react";
// import { View, Animated, StyleSheet } from "react-native";
// import { SvgProps } from "react-native-svg";
// import { useGlobalStyle } from "@/src/context/GlobalStyleContext";  
// import SpeedDialSmallButtonUI from "./SpeedDialSmallButtonUI";
// import SpeedDialRootUI from "./SpeedDialRootUI";

// interface SpeedDialProps {
//     rootIcon: React.FC<SvgProps>;
//     topIcon: React.FC<SvgProps>;
//     topOnPress: () => void;
//     midIcon: React.FC<SvgProps>;
//     midOnPress: () => void; 
// }

// const SpeedDial: React.FC<SpeedDialProps> = ({
//   rootIcon,
//   topIcon,
//   topOnPress,
//   midIcon,
//   midOnPress, 
// }) => {

//     const topAnimatedHeight = -60;
//   const midAnimatedHeight = -38;

//  const topMidIconSize = 32;
//   const topMidDiameter = 50;

//   const { manualGradientColors } = useGlobalStyle();
//   const [expanded, setExpanded] = useState(false);
//   const animation1 = useRef(new Animated.Value(0)).current;
//   const animation2 = useRef(new Animated.Value(0)).current;
//   const rotation = useRef(new Animated.Value(0)).current; // New animation value for rotation

//   const toggleButtons = () => {
//     if (!expanded) {
//       setExpanded(true);

//       Animated.parallel([
//         Animated.timing(animation1, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(animation2, {
//           toValue: 1,
//           duration: 220,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       // Collapses option buttons
//       Animated.parallel([
//         Animated.timing(rotation, {
//           toValue: 0, // Reset rotation
//           duration: 100,
//           useNativeDriver: true,
//         }),
//         Animated.parallel([
//           Animated.timing(animation2, {
//             toValue: 0,
//             duration: 40,
//             useNativeDriver: true,
//           }),
//           Animated.timing(animation1, {
//             toValue: 0,
//             duration: 100,
//             useNativeDriver: true,
//           }),
//         ]),
//       ]).start(() => setExpanded(false));
//     }
//   };

//   const buttonTranslateY1 = animation1.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, midAnimatedHeight],
//   });

//   const buttonTranslateY2 = animation2.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, topAnimatedHeight],
//   });

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.smallButtonContainer,
//           {
//             transform: [{ translateY: buttonTranslateY2 }],
//             opacity: animation2,
//           },
//         ]}
//       >
//         <SpeedDialSmallButtonUI
//           onPress={topOnPress}
//           containerWidth={"auto"}
//           circleSize={topMidDiameter}
//           icon={topIcon}
//           iconSize={topMidIconSize} 
//         />
//       </Animated.View>

//       <Animated.View
//         style={[
//           styles.smallButtonContainer,
//           {
//             transform: [{ translateY: buttonTranslateY1 }],
//             opacity: animation1,
//             top: 0,
//           },
//         ]}
//       >
//         <SpeedDialSmallButtonUI
//           onPress={midOnPress}
//           containerWidth={"auto"}
//           circleSize={topMidDiameter}
//           icon={midIcon}
//           iconSize={topMidIconSize} 
//         />
//       </Animated.View>

//       <SpeedDialRootUI
//         expanded={expanded}
//         icon={rootIcon}
//         iconSize={42}
//         onPress={toggleButtons} 
//         rotation={rotation} // Pass rotation to the main button
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     position: "absolute",
//     flexWrap: "wrap",
//     width: 73,
//     alignContent: "center",
//     justifyContent: "center",
//     right: 10,
//     bottom: 20,
//     zIndex: 3000,
//   },
//   smallButtonContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     width: 50,
//     height: 50,
//   },
// });

// export default SpeedDial;
