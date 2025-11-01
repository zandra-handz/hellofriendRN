//Derivative of TextEditBox
import React, {
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Pressable,
  Keyboard,
} from "react-native";
import Animated, {
  // SlideInDown,
  withTiming,
  useSharedValue,
  // useAnimatedProps,
  useAnimatedStyle,
  withSequence,
} from "react-native-reanimated";

import SvgIcon from "@/app/styles/SvgIcons";
import { useFocusEffect } from "@react-navigation/native";

import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
// import keyframes from "react-native-reanimated/lib/typescript/css/stylesheet/keyframes";
// import { TextHeightBehavior } from "@shopify/react-native-skia";

interface QuickWriteMomentProps {
  title?: string;
  mountingText?: string;
  onTextChange?: (text: string) => void;
  width?: string | number;
  height?: string | number;
  multiline?: boolean;
  friendModalOpened: boolean;
}

// Forwarding ref to the parent to expose the TextInput value
const QuickWriteMoment = forwardRef(
  (
    {
      focusMode,
      mountingText = "Start typing",
      onTextChange,
      multiline = true,
      primaryColor,
      onPress,
      primaryBackgroundColor,
      isKeyboardVisible,

      value,
    },
    ref
  ) => {
    const opacityValue = useSharedValue(0);

    const scaleValue = useSharedValue(1);

    useEffect(() => {
      if (isKeyboardVisible) {
        opacityValue.value = withTiming(1, { duration: 500 });
        scaleValue.value = withTiming(2, { duration: 500 });
        scaleValue.value = withTiming(1.4, { duration: 200 });
      }
      if (!isKeyboardVisible) {
        opacityValue.value = withTiming(1, { duration: 500 });

        scaleValue.value = withTiming(1.4, { duration: 200 });
        scaleValue.value = withTiming(1, { duration: 200 });
      }
    }, [isKeyboardVisible]);

    const textValue = useSharedValue("");

    const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

    const textInputRef = useRef();
    useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
      blur: () => textInputRef.current?.blur(),
      getValue: () => value,
    }));

    const buttonColor = primaryBackgroundColor;
    //This is what turns moment text input autofocus on/off depending on user's settings
    useFocusEffect(
      useCallback(() => {
        console.log("usefocys triggered");
        const timeout = setTimeout(() => {
          if (
            ref.current &&
            focusMode === true // not sure if there was a specific reason I added === true, so leaving as is
          ) {
            ref.current.focus();
          }
        }, 50); // Small delay for rendering
        return () => clearTimeout(timeout);
      }, [focusMode])
    );

    useEffect(() => {
      textValue.value = value;
      scaleValue.value = withSequence(
        withTiming(1.1, { duration: 50 }),
        withTiming(1, { duration: 800 })
      );
    }, [value]);

    const handleFocusText = () => {
      ref.current.focus();
    };

    const lastCharScale = useSharedValue(1);

    useEffect(() => {
      lastCharScale.value = withSequence(
        withTiming(22, { duration: 70 }),
        withTiming(17, { duration: 500 })
      );
    }, [value]);

    const lastCharStyle = useAnimatedStyle(() => ({
      transform: [{ scale: lastCharScale.value }],
      color: primaryColor,
      fontSize: lastCharScale.value,
      lineHeight: 28,
    }));

    // Split text into all but last char + last char
    const allButLast = value?.slice(0, -1) ?? "";
    const lastChar = value?.slice(-1) ?? "";

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
      // scroll to bottom whenever content changes
      scrollRef.current?.scrollToEnd({ animated: false });
    }, [allButLast, lastChar]); // update dependencies whenever content changes

    const addIconSize = 22;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.newMomentContainer,
            {
              width: "100%",
              height: multiline ? "100%" : 30,
              paddingLeft: 18,
              paddingTop: multiline ? 0 : 0,

              borderRadius: 0,
            },
          ]}
        >
          <>
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: 50,
              }}
            ></View>
            <View style={{ flex: 1 }}>
              {!isKeyboardVisible && (
                <>
                  <View
                    style={{
                      position: "absolute",
                      flexDirection: "row",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 30,
                      alignItems: "center",
                      opacity: multiline ? 0.5 : 1,
                    }}
                  >
                 
                  </View>
                </>
              )}
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[{ flex: 1, paddingBottom: multiline ? 0 : 0 }]}
              >
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation(); // stops it from reaching TouchableWithoutFeedback
                    onPress?.();
                  }}
                  //onPress={onPress} // since we can't manually re-place the caret, just nav to edit screen
                  style={{
                    flex: 1, // NEED THIS
                  }}
                >
                  {isKeyboardVisible && (
                    <ScrollView
                      ref={scrollRef}
                      style={{
                        flex: 1,
                      }}
                      contentContainerStyle={{
                        paddingHorizontal: 10,
                        paddingVertical: 0,
                        paddingBottom: 10,
                      }}
                      keyboardShouldPersistTaps="handled"
                      inverted={true}
                    >
                      <Text
                        style={{
                          fontSize: 17,
                          lineHeight: 33,
                          color: primaryColor,
                        }}
                      >
                        {allButLast}
                        <Animated.Text
                          style={[
                            lastCharStyle,
                            styles.textInput,
                            { color: primaryColor },
                          ]}
                        >
                          {lastChar}
                        </Animated.Text>
                      </Text>
                    </ScrollView>
                  )}
                </Pressable>

                <TextInput
                  ref={textInputRef}
                  textBreakStrategy={"highQuality"}
                  autoFocus={focusMode}
                  pointerEvents="none"
                  style={styles.textInputInvisible}
                  color={"transparent"}
                  caretHidden={true}
                  value={isKeyboardVisible ? value : ""}
                  // onFocus={(e) => {
                  //   setIsFocused(true);
                  // }}
                  placeholder={""}
                  // onBlur={() => console.log("lost focus")}
                  placeholderTextColor={primaryColor}
                  onChangeText={onTextChange}
                  multiline={multiline}
                />
              </KeyboardAvoidingView>
            </View>
          </>
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

const styles = StyleSheet.create({
  selectFriendContainer: {
    width: 40,
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
  },
  newMomentContainer: {
    borderRadius: 30,
    alignSelf: "center",
    padding: 4,
  },
  title: {
    fontSize: 15,
    lineHeight: 32,
    fontFamily: "Poppins-Regular",
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textInput: {
    borderRadius: 20,
    paddingVertical: 0,
    marginLeft: 0,
    flex: 1,
    fontSize: 15,
    lineHeight: 33,
    fontFamily: "Poppins-Regular",
    color: "transparent",
  },

  textInputInvisible: {
    borderRadius: 20,
    paddingVertical: 0,
    marginLeft: 0,
    flex: 1,
    lineHeight: 33,
    zIndex: 1,

    fontSize: 0.01,
  },
  selectImageButton: {
    flexDirection: "row",
    marginLeft: 30,
    zIndex: 5000,
    elevation: 5000,
    width: "auto",
    height: 30,
    alignItems: "center",
  },
});

export default QuickWriteMoment;
