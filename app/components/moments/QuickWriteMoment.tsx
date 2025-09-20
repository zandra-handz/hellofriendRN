//Derivative of TextEditBox
import React, {
  useCallback,
  useState,
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
  SlideInDown,
  withTiming,
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withSequence,
} from "react-native-reanimated";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
import keyframes from "react-native-reanimated/lib/typescript/css/stylesheet/keyframes";
import { TextHeightBehavior } from "@shopify/react-native-skia";

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
      primaryOverlayColor,
      isKeyboardVisible,

      value,
    },
    ref
  ) => {
    const opacityValue = useSharedValue(0);

    const scaleValue = useSharedValue(1);

    const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

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

    // const animatedStyle = useAnimatedStyle(
    //   () => ({
    //     opacity: opacityValue.value,
    //   }),
    //   [opacityValue]
    // );

    const textValue = useSharedValue("");
    // const [isFocused, setIsFocused] = useState(false);

    // const animatedProps = useAnimatedProps(() => {
    //   return {
    //     scale: scaleValue.value,
    //   };
    // });

    // const animatedFontStyle = useAnimatedStyle(
    //   () => ({
    //     transform: [{ scale: scaleValue.value }],
    //   }),
    //   [scaleValue]
    // );
    const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

    const animatedProps2 = useAnimatedProps(() => {
      return {
        text: `Box width: ${textValue.value}`,
        defaultValue: `Box width: ${scaleValue.value}`,
      };
    }, [textValue]);

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

    // const handleManualFocus = useCallback(() => {
    //   const timeout = setTimeout(() => {
    //     if (ref.current) {
    //       ref.current.focus();
    //     }
    //   }, 50);
    //   return () => clearTimeout(timeout);
    // }, []);

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
              // backgroundColor: multiline
              //   ? primaryBackgroundColor
              //   : "transparent",
            },
          ]}
        >
          <>
            <View
              style={{
                position: "absolute",
                // top: 60,
                // backgroundColor: "orange",
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
                    <Pressable
                      hitSlop={30}
                      zIndex={4000}
                      onPress={handleFocusText}
                      style={{
                        height: addIconSize,
                        width: addIconSize,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: addIconSize / 2,
                        borderWidth: 1,
                        borderColor: buttonColor,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="plus"
                        color={buttonColor}
                        size={20}
                      />
                    </Pressable>
                    <Text
                      style={[
                        styles.helperText,

                        { color: buttonColor, fontFamily: "Poppins-Regular" },
                      ]}
                    >
                      {"  "}Idea
                    </Text>

                    {!multiline && (
                      <Pressable
                        onPress={handleCaptureImage}
                        style={{
                          flexDirection: "row",
                          marginLeft: 30,
                          zIndex: 6000,
                          flexDirection: "row",
                          zIndex: 4000,
                          height: 30,
                          width: "auto",
                          alignItems: "center",
                          opacity: multiline ? 0 : 0.9,
                        }}
                      >
                        <View
                          style={{
                            height: addIconSize,
                            width: addIconSize,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: addIconSize / 2,
                            borderWidth: 1,
                            borderColor: buttonColor,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="plus"
                            color={buttonColor}
                            size={20}
                          />
                        </View>
                        <Text
                          style={[
                            styles.helperText,

                            {
                              color: buttonColor,
                              fontFamily: "Poppins-Regular",
                            },
                          ]}
                        >
                          {"  "}Pic
                        </Text>
                      </Pressable>
                    )}
                    {!multiline && (
                      <Pressable
                        onPress={handleSelectImage}
                        style={{
                          flexDirection: "row",
                          marginLeft: 30,
                          zIndex: 5000,
                          zIndex: 5000,
                          elevation: 5000,
                          width: "auto",
                          height: 30,
                          alignItems: "center",
                          opacity: multiline ? 0 : 0.9,
                        }}
                      >
                        <View
                          style={{
                            height: addIconSize,
                            width: addIconSize,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: addIconSize / 2,
                            borderWidth: 1,
                            borderColor: buttonColor,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="plus"
                            color={buttonColor}
                            size={20}
                          />
                        </View>
                        <Text
                          style={[
                            styles.helperText,
                            {
                              color: buttonColor,
                              fontFamily: "Poppins-Regular",
                            },
                          ]}
                        >
                          {"  "}Upload
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </>
              )}
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[{ flex: 1, paddingBottom: multiline ? 120 : 0 }]}
              >
                <Pressable
                onPress={onPress} // since we can't manually re-place the caret, just nav to edit screen
                  style={{
                    flex: 1, // NEED THIS
                  //  backgroundColor: "teal",
                  }}
                >
                  {isKeyboardVisible && (
                    <ScrollView
                      ref={scrollRef}
                      style={{ flex: 1,
                        // backgroundColor: "red"
                         }}
                      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                      keyboardShouldPersistTaps="handled"
                      inverted={true}
                    >
                      {/* <View
                        style={{
                          width: "100%",
                          height: 100,
                          backgroundColor: "pink",
                          borderWidth: 1,
                          borderColor: "black",
                        }}
                      ></View>
                      <View
                        style={{
                          width: "100%",
                          height: 100,
                          backgroundColor: "pink",
                          borderWidth: 1,
                          borderColor: "black",
                        }}
                      ></View>
                      <View
                        style={{
                          width: "100%",
                          height: 100,
                          backgroundColor: "pink",
                          borderWidth: 1,
                          borderColor: "black",
                        }}
                      ></View> */}
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
                  style={[
                    styles.textInput,
                    {
                      // backgroundColor: 'orange',
                      marginLeft: 26,
                      height: 30,
                      fontSize: 0.01,
                      color: "transparent",
                    },
                  ]}
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
});

export default QuickWriteMoment;
