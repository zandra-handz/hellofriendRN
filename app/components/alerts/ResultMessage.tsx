// import React from "react";
// import { 
//   TextInput, 
// } from "react-native";
// import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
// import { useMessage } from "@/src/context/MessageContext";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useAnimatedProps, 
//   useAnimatedReaction,
//   withTiming,
//   withSequence,
//   withDelay,
// } from "react-native-reanimated";

// interface ResultMessageProps {
//   resultsDisplayDuration: number;
//   messageDelay: number;
// }

// const ResultMessage: React.FC<ResultMessageProps> = ({
//   resultsDisplayDuration = 2000,
//   messageDelay = 0,
// }) => {
//   const { messageQueue  } = useMessage();
//   const {
//     themeStyles,
//     appContainerStyles,
//     appFontStyles, 
//   } = useGlobalStyle();

//   // UI-thread controlled visibility
//   const translateY = useSharedValue(-200);
//   const visible = useSharedValue(false);
//   const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//     opacity: visible.value ? 1 : 1,
//   }));

//   const messageText = useSharedValue("");

//   useAnimatedReaction(
//     () => {
//       const message = messageQueue.value?.[0]?.resultsMessage ?? null;
    
//       return message;
//     },
//     (newMessage, prevMessage) => { 
//       const isNew =
//         newMessage != prevMessage && newMessage !== null && newMessage !== "";
  
//       if (isNew) {
//         messageText.value = "";
//         messageText.value = newMessage;
 
//         translateY.value = withSequence(
//           withTiming(10, { duration: 180 }), // Slide up
//           withDelay(
//             resultsDisplayDuration + messageDelay,
//             withTiming(-200, { duration: 180 }, (finished) => {
//               if (finished) {
//                  messageText.value = ""; 
//               }
//             })
//           )
//         );
//       }
//     },
//     [messageQueue]
//   );

//   const animatedMessageText = useAnimatedProps(() => {
   
//     return {
//       text: `${messageText.value}`,

//       defaultValue: `${messageText.value}`,
//       color: themeStyles.genericText.color,
//     };
//   });
 

//   return (
//     <Animated.View
//       style={[appContainerStyles.appMessageContainer, animatedStyle]}
//     >
//       <Animated.View
//         style={[
//           appContainerStyles.appMessageTextWrapper,
//           themeStyles.primaryBackground,
//           { borderColor: themeStyles.primaryText.color },
//         ]}
//       >
//         <AnimatedTextInput
//           style={[appFontStyles.appMessageText, themeStyles.primaryText]}
//           animatedProps={animatedMessageText}
//           editable={false}
//           defaultValue={""}
//           multiline={true}
//         />
//       </Animated.View>
//     </Animated.View>
//   );
// };

// export default ResultMessage;
