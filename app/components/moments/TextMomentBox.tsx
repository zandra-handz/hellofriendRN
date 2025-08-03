import React, {
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 

// Forwarding ref to the parent to expose the TextInput value
const TextMomentBox = forwardRef(
  //width and height are original settings being used in location notes
  (
    { 
      // editScreen,
      mountingText = "",
      triggerReFocus,
      onTextChange,
      helperText,
      isKeyboardVisible,
    },
    ref
  ) => {
    const { themeStyles, appFontStyles } =
      useGlobalStyle();
    const [editedMessage, setEditedMessage] = useState(mountingText);
    const textInputRef = useRef();

    const PADDING_TEXT_ABOVE_KEYBOARD = 80;

    useEffect(() => {
      if (triggerReFocus) {
        console.log('triggerReFocus triggered in text moment box');
        textInputRef.current.blur();
        textInputRef.current.focus();
      }

    }, [triggerReFocus]);

 
    useImperativeHandle(ref, () => ({
      setText: (text) => {
        if (textInputRef.current) {
          textInputRef.current.setNativeProps({ text });
          setEditedMessage(text);
        }
      },
      clearText: () => {
        if (textInputRef.current) {
          textInputRef.current.clear();
          setEditedMessage("");
        }
      },
      getText: () => editedMessage,
    }));



    const handleTextInputChange = (text) => {
      console.log('text update:', text);
      setEditedMessage(text);
      onTextChange(text);
    };

    return (
      <View style={[styles.container, { width: "100%", height: "100%" }]}>
 
        <View style={{ flex: 1 }}>
          {helperText && (
            <Text style={[styles.helperText, themeStyles.genericText]}>
              {helperText}
            </Text>
          )}
          <KeyboardAvoidingView
            style={[
              styles.textInputKeyboardAvoidContainer,
              { paddingBottom: isKeyboardVisible ? 120 : 0 },
            ]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TextInput
              ref={textInputRef}
              autoFocus={true}
              style={[
                themeStyles.genericText,
                appFontStyles.welcomeText,
                {
                  // paddingTop: 0,
                  fontSize: 15,
                  lineHeight: 24, // same as moment view page
                  flex: 1,
                  flexGrow: 1, 
                  textAlignVertical: "top",
                  minHeight: 120, // to ensure a starting height
                },
              ]}
              value={editedMessage}
              onChangeText={handleTextInputChange}
              multiline={true}
            />

            <View style={{ width: "100%", height: PADDING_TEXT_ABOVE_KEYBOARD }}></View>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.5,
  },
  textInputKeyboardAvoidContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textInput: {
    textAlignVertical: "top",
    borderRadius: 20,
    paddingVertical: 10,
    flex: 1,
  },
});

export default TextMomentBox;
