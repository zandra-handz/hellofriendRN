import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
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
  runOnJS,
} from "react-native-reanimated";

const ResultMessage = ({ resultsDisplayDuration = 2000, messageDelay = 0 }) => {
  const { messageQueue, removeMessage } = useMessage();
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    constantColorsStyles,
  } = useGlobalStyle();

  // UI-thread controlled visibility
  const translateY = useSharedValue(-160);
  const visible = useSharedValue(false);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: visible.value ? 1 : 1,
  }));

  const messageText = useSharedValue("");

useAnimatedReaction(
  () => messageQueue.value.length > 0,
  (hasMessage, prevHasMessage) => {
    if (hasMessage && !prevHasMessage) { 
      
      messageText.value = messageQueue.value?.[0]?.resultsMessage || '';

      // Slide in, wait, then slide out
      translateY.value = withSequence(
        withTiming(10, { duration: 180 }), // Slide up
        withDelay(resultsDisplayDuration + messageDelay, withTiming(-160, { duration: 180 }, () => {
          // Remove message only after sliding out
          //  runOnJS(removeMessage)(); // running in context right now because not working here
        }))
      );
    }
  },
  [messageQueue]
);


  // const derivedMessage = useDerivedValue(() => {
  //     const message = messageQueue?.value?.value[0]?.resultsMessage || 'No message';
  //     return message;
  //  // return messageQueue; 
  // });

  const derivedMessage = useDerivedValue(() => {
   const message = messageQueue.value?.[0]?.resultsMessage || '';
   console.log(messageQueue.value);
  return message;
});

useAnimatedReaction(
  () => messageQueue.value[0]?.resultsMessage || '',
  (newMessage, prevMessage) => {
    if (newMessage !== prevMessage) {
      messageText.value = newMessage;
    }
  },
  [messageQueue]
);


  const animatedMessageText = useAnimatedProps(() => {
     const message = messageQueue.value?.[0]?.resultsMessage || '';
   // const message = derivedMessage.value;
   // const message = derivedMessage.value;
   // console.log(derivedMessage);

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
    // <View style={[styles.container]}>
      <Animated.View
        style={[
          
          styles.container,
       
            animatedStyle,
        ]}
      >
        <Animated.View
        style={[styles.textContainer, themeStyles.primaryBackground]}>
          
        <AnimatedTextInput
          style={[themeStyles.primaryText]}
          animatedProps={animatedMessageText}
          editable={false}
          defaultValue={""}
        />
        
        </Animated.View>
        {/* <Animated.Text
          style={[
            appFontStyles.appMessageButtonText,
            themeStyles.primaryText,
          ]}
        >
          {currentMessage.resultsMessage}
        </Animated.Text> */}

        {/* {currentMessage.buttonPress && currentMessage.buttonLabel && (
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              style={[
                appContainerStyles.appMessageButton,
                {
                  backgroundColor:
                    constantColorsStyles.v1LogoColor.backgroundColor,
                },
              ]}
              onPress={currentMessage.buttonPress}
            >
              <AnimatedTextInput
                style={[themeStyles.primaryText]}
                animatedProps={animatedMessageText}
                editable={false}
                defaultValue={""}
              />
              {/* <Text
                style={[
                  constantColorsStyles.v1LogoColor,
                  appFontStyles.appMessageButtonText,
                ]}
              >
                {currentMessage.buttonLabel}
              </Text> 
            </TouchableOpacity>
          </View> //  )} */}


      </Animated.View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    position: "absolute",
  //  backgroundColor: 'red',
    top: 40,
    left: 0,
   // flex: 1,
    zIndex: 100000,
    elevation: 100000,
    width: '100%',
    padding: 4,
    height: 'auto',
    minHeight: 100,
    maxHeight: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
 //   borderTopLeftRadius: 20,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center", 
    width: "100%", 
    height: "100%",
    borderRadius: 30,
    paddingHorizontal: 20,
    padding: 10,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  loadingTextBold: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 0,
  },
});

export default ResultMessage;
