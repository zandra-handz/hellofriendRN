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

// Forwarding ref to the parent to expose the TextInput value
const TextMomentBox =
  // forwardRef(
  ({
    mountingText = "",
    triggerReFocus,
    onTextChange,
    helperText,
    isKeyboardVisible,
    welcomeTextStyle,
    primaryColor, 
    ref,
    value,
  }) => {
    // const [editedMessage, setEditedMessage] = useState(mountingText);
    // const textInputRef = useRef();
console.log('momenttexttosave', value)
    const PADDING_TEXT_ABOVE_KEYBOARD = 80;

    useEffect(() => {
      if (triggerReFocus) {
        console.log(
          "triggerReFocus triggered in text moment box",
          triggerReFocus
        );
        // textInputRef.current.blur();
        // textInputRef.current.focus();
        ref.current.blur();
        ref.current.focus();
      }
    }, [triggerReFocus]);

    // useImperativeHandle(ref, () => ({
    //   setText: (text) => {
    //     if (textInputRef.current) {
    //       textInputRef.current.setNativeProps({ text });
    //       setEditedMessage(text);
    //     }
    //   },
    //   clearText: () => {
    //     if (textInputRef.current) {
    //       textInputRef.current.clear();
    //       setEditedMessage("");
    //     }
    //   },
    //   getText: () => editedMessage,
    // }));

    const handleTextInputChange = (text) => {
      console.log("text update:", text);
      // setEditedMessage(text);
      onTextChange(text);
    };

    return (
      <View style={[styles.container, { width: "100%", height: "100%" }]}>
        <View style={{ flex: 1 }}>
          {helperText && (
            <Text style={[styles.helperText, { color: primaryColor }]}>
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
              // ref={textInputRef}
              ref={ref}
              autoFocus={true}
              style={[
                welcomeTextStyle,
                {
                  color: primaryColor,
                  fontSize: 15,
                  lineHeight: 24, // same as moment view page
                  flex: 1,
                  flexGrow: 1,
                  textAlignVertical: "top",
                  minHeight: 120, // to ensure a starting height
                },
              ]}
              //value={editedMessage}
              value={value}
              onChangeText={handleTextInputChange}
              multiline={true}
            />

            <View
              style={{ width: "100%", height: PADDING_TEXT_ABOVE_KEYBOARD }}
            ></View>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  };

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
