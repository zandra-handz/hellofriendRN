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
import EditPencilOutlineSvg from "@/app/assets/svgs/edit-pencil-outline.svg"; 
import SwitchFriend from "../home/switchFriend";
 
// Forwarding ref to the parent to expose the TextInput value
const TextMomentBox = forwardRef(


  //width and height are original settings being used in location notes
  (
    {
      title = "title",
      editScreen,
      mountingText = "",
      onTextChange,
      helperText,
      showCategoriesSlider,
      handleCategorySelect,
      existingCategory,
      onSave,
      isKeyboardVisible,
      selectedUserCategory,
    },
    ref
  ) => {
      console.log('TEXT MOMENT EDIT BOX RERENDERED');
    const { themeStyles, appFontStyles, manualGradientColors } =
      useGlobalStyle();
    const [editedMessage, setEditedMessage] = useState(mountingText); // Use the starting text passed as prop
    const textInputRef = useRef();

 
    useEffect(() => {
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text: mountingText });
        console.log('setting edited message in text box');
        setEditedMessage(mountingText);
      }
    }, []);

    // Expose the current value of the TextInput via the ref
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

    useEffect(() => {
      setEditedMessage(mountingText); // Reset to starting text if it changes
    }, [mountingText]);

    const handleTextInputChange = (text) => {
      // console.log(text);
      setEditedMessage(text);
      onTextChange(text);
    };

    return (
      <View
        style={[
          styles.container,
          // themeStyles.genericTextBackground,
          { width: "100%", height: "100%" },
        ]}
      >
        <SwitchFriend />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              opacity: 0.8,
              height: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                themeStyles.genericText,
                appFontStyles.welcomeText,
                { fontSize: 20 },
              ]}
            >
              {" "}
              {title}
            </Text>
          </View>
          {editScreen && (
            <EditPencilOutlineSvg
              height={24}
              width={24}
              color={manualGradientColors.lightColor}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          {helperText && (
            <Text style={[styles.helperText, themeStyles.genericText]}>
              {helperText}
            </Text>
          )}
          <KeyboardAvoidingView
            style={[styles.textInputKeyboardAvoidContainer, {paddingBottom: isKeyboardVisible ? 100 : 0}]}
            behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on the platform
          >
            <TextInput
              ref={textInputRef}
              autoFocus={true}
              style={[
                // styles.textInput,
                themeStyles.genericText,
                appFontStyles.welcomeText,
                {
                  //backgroundColor: "orange",
                  flexShrink: 1,
                  fontSize: 26,
                  paddingBottom: 30,
                }, // this leaves space for category button component overlaying it
              ]}
              value={editedMessage}
              onChangeText={handleTextInputChange} // Update local state
              multiline={true}
            />
            <View
              style={{ width: "100%", height: 80 }} //backgroundColor: "red"
            > 
    
 
            </View>
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
    //marginLeft: '6%'
    //textTransform: "uppercase",
  },
  textInputKeyboardAvoidContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    
    // height: 200,
  },
  textInput: {
    // fontFamily: 'Poppins-Regular',
    // fontSize: 15,

    // lineHeight: 24,
    textAlignVertical: "top",
    borderRadius: 20,
    paddingVertical: 10,
    flex: 1,
  },
});

export default TextMomentBox;
