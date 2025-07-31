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
 import SwitchFriend from "../home/SwitchFriend";
 
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
      isKeyboardVisible, 
    },
    ref
  ) => { 
    const { themeStyles, appFontStyles, manualGradientColors } =
      useGlobalStyle();
    const [editedMessage, setEditedMessage] = useState(mountingText);  
    const textInputRef = useRef();

 
    useEffect(() => {
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text: mountingText });
        console.log('setting edited message in text box');
        setEditedMessage(mountingText);
      }
    }, []);
 
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
 
      setEditedMessage(text);
      onTextChange(text);
    };

    return (
      <View
        style={[
          styles.container, 
          { width: "100%", height: '100%' },
        ]}
      >
        {!editScreen && (
          
        <SwitchFriend />
        
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >

          
        



          {/* {editScreen && (
            <EditPencilOutlineSvg
              height={24}
              width={24}
              color={manualGradientColors.lightColor}
            />
          )} */}
        </View>
        <View style={{ flex: 1 }}>
          {helperText && (
            <Text style={[styles.helperText, themeStyles.genericText]}>
              {helperText}
            </Text>
          )}
          <KeyboardAvoidingView
            style={[styles.textInputKeyboardAvoidContainer, {paddingBottom: isKeyboardVisible ? 120 : 0}]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}  
          >
<TextInput
  ref={textInputRef}
  autoFocus={true}
  style={[
    themeStyles.genericText,
    appFontStyles.welcomeText,
    {
      paddingTop: 10,
      fontSize: 15, lineHeight: 24, // same as moment view page
      flex: 1,
      flexGrow: 1, 
      paddingBottom: 0,
      textAlignVertical: "top",
      minHeight: 120, // ensure some starting height
      
    }
  ]}
  value={editedMessage}
  onChangeText={handleTextInputChange}
  multiline={true}
/>

            <View
              style={{ width: "100%", height: 80 }}  
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
