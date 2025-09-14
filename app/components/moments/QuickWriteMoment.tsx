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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback, 
  Pressable,
  Keyboard,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import { useFocusEffect } from "@react-navigation/native";

import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

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
const QuickWriteMoment = forwardRef<TextInput, QuickWriteMomentProps>(
  (
    { 
      focusMode,
      mountingText = "Start typing",
      onTextChange, 
      multiline = true,  
      primaryColor,
  
        primaryBackgroundColor,
        primaryOverlayColor, 
    },
    ref
  ) => {  
    const [editedMessage, setEditedMessage] = useState(mountingText); 

    const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

    const textInputRef = useRef();
const buttonColor = primaryBackgroundColor;
    //This is what turns moment text input autofocus on/off depending on user's settings
    useFocusEffect(
      useCallback(() => {
        const timeout = setTimeout(() => {
          if (
            textInputRef.current &&
            focusMode === true // not sure if there was a specific reason I added === true, so leaving as is 
          ) {
            textInputRef.current.focus();
          } 
        }, 50); // Small delay for rendering
        return () => clearTimeout(timeout); 
      }, [focusMode])
    );

const handleManualFocus = useCallback(() => {
  const timeout = setTimeout(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, 50);
  return () => clearTimeout(timeout);
}, []);

    const addIconSize = 22;

    useEffect(() => {
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text: mountingText });
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
      focus: () => {
         
       textInputRef.current.blur(); // YA THIS WORKS. Gotta blur manually for some reason to get it to work more than one time in a row
        handleManualFocus();
      },
    }));

    useEffect(() => {
      setEditedMessage(mountingText); // Reset to starting text if it changes
    }, [mountingText]);

    const handleTextInputChange = (text) => {
      setEditedMessage(text);
      onTextChange(text);
    };

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
              backgroundColor: multiline
                ? primaryBackgroundColor
                :   'transparent'
            },
          
          ]}
        >
          <>
            <View style={{ flex: 1 }}>
              {!editedMessage && (
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
                       
                            { color: buttonColor, fontFamily: "Poppins-Regular" },
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
                            { color: buttonColor, fontFamily: "Poppins-Regular" },
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
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 3,
                    paddingLeft: 4,
                  }}
                > 
                    <TextInput
                      ref={textInputRef}
                      autoFocus={focusMode}
                      style={[styles.textInput, {color: buttonColor}]}
                      value={editedMessage}
                      placeholder={""}
                      onBlur={() => console.log('lost focus')}
                      placeholderTextColor={"white"}
                      onChangeText={handleTextInputChange} 
                      multiline={multiline}
                    />
                </View>
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
    textAlignVertical: "top",
    borderRadius: 20,
    paddingVertical: 0,
    marginLeft: 0,
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "Poppins-Regular",
  },
});

export default QuickWriteMoment;
