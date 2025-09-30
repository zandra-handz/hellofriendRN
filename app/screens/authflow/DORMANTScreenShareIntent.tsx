// import React, {
 
// } from "react";
// import {
//   View, 
//   StyleSheet,
//   Text, 
//   Pressable,
// } from "react-native";
 
// import manualGradientColors  from "@/src/hooks/StaticColors";
// import { useRoute, RouteProp } from "@react-navigation/native";
// import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
// import useAppNavigations from "@/src/hooks/useAppNavigations";
  
// import { useLDTheme } from "@/src/context/LDThemeContext"; 
// import { AppFontStyles } from "@/src/hooks/StaticFonts";

// type ShareIntentParams = {
//   ShareIntent: {
//     sharedUrl: string;
//   };
// };

// const ScreenShareIntent = () => {
//   const route = useRoute<RouteProp<ShareIntentParams, "ShareIntent">>();
//   const sharedUrl = route.params?.sharedUrl;

//   const {   navigateBack } =
//     useAppNavigations();
//   const { lightDarkTheme } = useLDTheme();

//   return (
//     <PreAuthSafeViewAndGradientBackground
//       settings={null}
//       startColor={manualGradientColors.darkColor}
//       endColor={manualGradientColors.lightColor}
//       friendColorLight={null}
//       friendColorDark={null}
//       friendId={null}
//       includeCustomStatusBar={false}
//       backgroundOverlayColor={lightDarkTheme.primaryBackground}
//       style={{
//         flex: 1,
//         // paddingTop: 40, // TEMPORARY
//       }}
//     >
//       {" "}
//       <View
//         style={{
//           flexDirection: "column",
//           flex: 1,
//           alignItems: "center",
//           justifyContent: "center",
//           width: "100%",
//         }}
//       >
//         <Text style={{}}>
//           SHARE INTENT SCREEN!
//           <Text style={{ fontSize: 16, color: "#555" }}>
//             {sharedUrl || "No URL received"}
//           </Text>
//         </Text>
//         <Pressable
//           onPress={navigateBack}
//           style={{
//             width: "90%",
//             padding: 10,
//             alignItems: "center",
//             flexDirection: "row",
//             justifyContent: "center",
//             backgroundColor: manualGradientColors.homeDarkColor,
//             borderRadius: 999,
//           }}
//         >
//           <Text
//             style={[
//               AppFontStyles.subWelcomeText,
//               { color: manualGradientColors.lightColor },
//             ]}
//           >
//             Back
//           </Text>
//         </Pressable>
//       </View>
//     </PreAuthSafeViewAndGradientBackground>
//   );
// };

// const styles = StyleSheet.create({
//   inputsContainer: {
//     height: 200,
//     width: "100%",
//     fontFamily: "Poppins-Regular",
//     //   backgroundColor: "hotpink",
//     justifyContent: "flex-start",
//     flex: 1,
//   },
//   input: {
//     fontFamily: "Poppins-Regular",

//     height: "auto",
//     borderWidth: 2.6,
//     padding: 10,
//     paddingTop: 10,
//     borderRadius: 10,
//     alignContent: "center",
//     justifyContent: "center",
//     borderColor: "black",
//     fontSize: 15,
//   },
//   inputFocused: {
//     fontFamily: "Poppins-Regular",
//     borderWidth: 3,
//   },
//   title: {
//     fontSize: 62,
//     marginBottom: 10,
//     fontFamily: "Poppins-Bold",
//     textAlign: "center",
//   },
//   toggleButton: {
//     color: "black",
//     fontFamily: "Poppins-Bold",
//     fontSize: 14,
//     selfAlign: "center",
//   },
//   spinnerContainer: {
//     ...StyleSheet.absoluteFillObject, // Cover the entire screen
//     backgroundColor: "transparent", // Semi-transparent background
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default ScreenShareIntent;
