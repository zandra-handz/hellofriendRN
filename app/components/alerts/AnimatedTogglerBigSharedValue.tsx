// // components/AnimatedTogglerBigSharedValue.tsx
// import React, { useCallback } from "react";
// import { StyleSheet, View, Pressable } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useAnimatedReaction,
//   withSpring,
//   withTiming,
//   withDelay,
//   withSequence,
//   SharedValue,
// } from "react-native-reanimated";
// import SvgIcon from "@/app/styles/SvgIcons";

// const SHADOW_COLOR = "rgba(0,0,0,0.95)";
// const OUTLINE_COLOR = "rgba(0,0,0,0.95)";
// const OUTLINE_R = 1;

// interface Props {
//   onPress: () => void;
//   backgroundColor?: string;
//   colorA: string;
//   colorB: string;
//   iconAName?: string;
//   iconBName?: string;
//   labelA?: string;
//   labelB?: string;
//   labelSide?: "left" | "right";
//   valueAB: boolean;
//   timing?: number;
//   hiddenValue: SharedValue<boolean>;
//   hideTiming?: number;
// }

// const AnimatedTogglerBigSharedValue: React.FC<Props> = ({
//   onPress,
//   backgroundColor = "transparent",
//   colorA,
//   colorB,
//   iconAName = "close",
//   iconBName = "close",
//   labelA,
//   labelB,
//   labelSide = "right",
//   valueAB,
//   timing = 200,
//   hiddenValue,
//   hideTiming = 200,
// }) => {
//   const pressScale = useSharedValue(1);

//   // --- slot A ---
//   const aOpacity      = useSharedValue(valueAB ? 0 : 1);
//   const aLabelOpacity = useSharedValue(valueAB ? 0 : 1);
//   const aScale        = useSharedValue(valueAB ? 0.85 : 1);
//   const aIconScale    = useSharedValue(valueAB ? 0 : 1);

//   // --- slot B ---
//   const bOpacity      = useSharedValue(valueAB ? 1 : 0);
//   const bLabelOpacity = useSharedValue(valueAB ? 1 : 0);
//   const bScale        = useSharedValue(valueAB ? 1 : 0.85);
//   const bIconScale    = useSharedValue(valueAB ? 1 : 0);

//   React.useEffect(() => {
//     if (valueAB) {
//       aIconScale.value    = withTiming(0, { duration: timing });
//       aLabelOpacity.value = withTiming(0, { duration: timing });
//       aOpacity.value      = withDelay(timing, withTiming(0, { duration: timing }));
//       aScale.value        = withDelay(timing, withTiming(0.85, { duration: timing }));
//       bOpacity.value      = withDelay(timing, withTiming(1, { duration: timing }));
//       bScale.value        = withDelay(timing, withTiming(1, { duration: timing }));
//       bIconScale.value    = withSequence(
//         withTiming(0, { duration: 0 }),
//         withDelay(timing, withTiming(1, { duration: timing })),
//       );
//       bLabelOpacity.value = withDelay(timing * 2, withTiming(1, { duration: timing }));
//     } else {
//       bOpacity.value      = withTiming(0, { duration: timing });
//       bLabelOpacity.value = withTiming(0, { duration: timing });
//       bIconScale.value    = withTiming(0, { duration: timing });
//       bScale.value        = withTiming(0.85, { duration: timing });
//       aOpacity.value      = withDelay(timing, withTiming(1, { duration: timing / 4 }));
//       aScale.value        = withDelay(timing, withTiming(1, { duration: timing / 4 }));
//       aIconScale.value    = withSequence(
//         withTiming(0, { duration: 0 }),
//         withDelay(timing, withTiming(1, { duration: timing / 4 })),
//       );
//       aLabelOpacity.value = withDelay(timing, withTiming(1, { duration: timing }));
//     }
//   }, [valueAB]);

//   const handlePressIn = useCallback(() => {
//     pressScale.value = withSpring(0.65, { stiffness: 500, damping: 30, mass: 0.5 });
//   }, []);

//   const handlePressOut = useCallback(() => {
//     pressScale.value = withSpring(1, { stiffness: 600, damping: 30, mass: 0.5 });
//   }, []);

//   const pressStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: pressScale.value }],
//   }));

//   const hiddenOpacity = useSharedValue(hiddenValue.value ? 1 : 0);

//   useAnimatedReaction(
//     () => hiddenValue.value,
//     (current) => {
//       hiddenOpacity.value = withTiming(current ? 1 : 0, { duration: hideTiming });
//     }
//   );

//   const hiddenStyle = useAnimatedStyle(() => ({
//     opacity: hiddenOpacity.value,
//     pointerEvents: hiddenOpacity.value > 0 ? "auto" : "none",
//   }));

//   const aWrapperStyle = useAnimatedStyle(() => ({
//     opacity: aOpacity.value,
//     transform: [{ scale: aScale.value }],
//   }));
//   const aIconStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: aIconScale.value }],
//   }));
//   const aLabelStyle = useAnimatedStyle(() => ({ opacity: aLabelOpacity.value }));

//   const bWrapperStyle = useAnimatedStyle(() => ({
//     opacity: bOpacity.value,
//     transform: [{ scale: bScale.value }],
//   }));
//   const bIconStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: bIconScale.value }],
//   }));
//   const bLabelStyle = useAnimatedStyle(() => ({ opacity: bLabelOpacity.value }));

//   const renderLabel = (label: string, color: string, animStyle: any) => (
//     <View style={styles.labelContainer}>
//       <Animated.Text style={[styles.label, { color: OUTLINE_COLOR, position: "absolute", left: -OUTLINE_R }, animStyle]}>{label}</Animated.Text>
//       <Animated.Text style={[styles.label, { color: OUTLINE_COLOR, position: "absolute", left: OUTLINE_R }, animStyle]}>{label}</Animated.Text>
//       <Animated.Text style={[styles.label, { color: OUTLINE_COLOR, position: "absolute", top: -OUTLINE_R }, animStyle]}>{label}</Animated.Text>
//       <Animated.Text style={[styles.label, { color: OUTLINE_COLOR, position: "absolute", top: OUTLINE_R }, animStyle]}>{label}</Animated.Text>
//       <Animated.Text style={[styles.label, { color: SHADOW_COLOR, position: "absolute", top: 3 }, animStyle]}>{label}</Animated.Text>
//       <Animated.Text style={[styles.label, { color }, animStyle]}>{label}</Animated.Text>
//     </View>
//   );

//   return (
//     <Animated.View pointerEvents="box-none" style={[styles.closeButtonWrapper, hiddenStyle]}>
//       <Pressable
//         onPress={onPress}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         style={[
//           styles.closeButton,
//           { backgroundColor },
//           (labelA || labelB) ? styles.closeButtonWithLabel : styles.closeButtonNoLabel,
//         ]}
//       >
//         <Animated.View style={[styles.innerContent, pressStyle]}>
//           {/* Slot A */}
//           <Animated.View style={[styles.overlay, aWrapperStyle]}>
//             {labelSide === "right" && (
//               <Animated.View style={aIconStyle}>
//                 <View style={styles.iconShadow}>
//                   <SvgIcon name={iconAName} size={24} color={colorA} />
//                 </View>
//               </Animated.View>
//             )}
//             {labelA && renderLabel(labelA, colorA, aLabelStyle)}
//             {labelSide === "left" && (
//               <Animated.View style={aIconStyle}>
//                 <View style={styles.iconShadow}>
//                   <SvgIcon name={iconAName} size={24} color={colorA} />
//                 </View>
//               </Animated.View>
//             )}
//           </Animated.View>

//           {/* Slot B */}
//           <Animated.View style={[styles.overlay, bWrapperStyle]}>
//             {labelSide === "right" && (
//               <Animated.View style={bIconStyle}>
//                 <View style={styles.iconShadow}>
//                   <SvgIcon name={iconBName} size={24} color={colorB} />
//                 </View>
//               </Animated.View>
//             )}
//             {labelB && renderLabel(labelB, colorB, bLabelStyle)}
//             {labelSide === "left" && (
//               <Animated.View style={bIconStyle}>
//                 <View style={styles.iconShadow}>
//                   <SvgIcon name={iconBName} size={24} color={colorB} />
//                 </View>
//               </Animated.View>
//             )}
//           </Animated.View>
//         </Animated.View>
//       </Pressable>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   closeButtonWrapper: {
//     position: "absolute",
//     bottom: 30,
//     left: 0,
//     right: 0,
//     height: 60,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 99999,
//     elevation: 99999,
//   },
//   closeButton: {
//     borderRadius: 999,
//     alignItems: "center",
//     justifyContent: "center",
//     height: 60,
//   },
//   closeButtonNoLabel: {
//     width: 60,
//   },
//   closeButtonWithLabel: {
//     minWidth: 60,
//     paddingHorizontal: 20,
//   },
//   innerContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//     height: "100%",
//   },
//   overlay: {
//     position: "absolute",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   labelContainer: {
//     position: "relative",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   iconShadow: {
//     shadowColor: SHADOW_COLOR,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.95,
//     shadowRadius: 1,
//     elevation: 4,
//   },
// });

// export default AnimatedTogglerBigSharedValue;