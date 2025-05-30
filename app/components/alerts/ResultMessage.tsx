import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useMessage } from "@/src/context/MessageContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useDerivedValue,
  useAnimatedReaction,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";

interface ResultMessageProps {
  resultsDisplayDuration: number;
  messageDelay: number;
}

const ResultMessage: React.FC<ResultMessageProps> = ({
  resultsDisplayDuration = 2000,
  messageDelay = 0,
}) => {
  const { messageQueue, removeMessage } = useMessage();
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    constantColorsStyles,
  } = useGlobalStyle();

  // UI-thread controlled visibility
  const translateY = useSharedValue(-200);
  const visible = useSharedValue(false);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: visible.value ? 1 : 1,
  }));

  const messageText = useSharedValue("");

  useAnimatedReaction(
    () => {
      const message = messageQueue.value?.[0]?.resultsMessage ?? null;
      console.log("message in animtedreaction: ", message);
      return message;
    },
    (newMessage, prevMessage) => {
      //const isNew = newMessage != prevMessage && newMessage !== null;
      const isNew =
        newMessage != prevMessage && newMessage !== null && newMessage !== "";
      //const isNew = newMessage !== null;
      if (isNew) {
        messageText.value = "";
        messageText.value = newMessage;

        // Slide in, wait, then slide out
        translateY.value = withSequence(
          withTiming(10, { duration: 180 }), // Slide up
          withDelay(
            resultsDisplayDuration + messageDelay,
            withTiming(-200, { duration: 180 }, (finished) => {
              if (finished) {
                 messageText.value = "";
              //  console.log("REMOVING MESSAGE");
               // messageQueue.value = messageQueue.value.slice(1); //moved back to context
              }
            })
          )
        );
      }
    },
    [messageQueue]
  );

  const animatedMessageText = useAnimatedProps(() => {
  
    console.log(`message in animatedProps: `, messageText.value);
    return {
      text: `${messageText.value}`,

      defaultValue: `${messageText.value}`,
      color: themeStyles.genericText.color,
    };
  });

  // Hide the component if not visible and messageQueue is empty
  // if (!visible.value || messageQueue.value.length === 0) {
  //   console.log('RETURNING NOTHING');
  //   return null;
  // }

  return (
    <Animated.View
      style={[appContainerStyles.appMessageContainer, animatedStyle]}
    >
      <Animated.View
        style={[
          appContainerStyles.appMessageTextWrapper,
          themeStyles.primaryBackground,
          { borderColor: themeStyles.primaryText.color },
        ]}
      >
        <AnimatedTextInput
          style={[appFontStyles.appMessageText, themeStyles.primaryText]}
          animatedProps={animatedMessageText}
          editable={false}
          defaultValue={""}
          multiline={true}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default ResultMessage;
