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
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import SwitchFriend from "../home/switchFriend";
import { useUserSettings } from "@/src/context/UserSettingsContext"; 
// import { useFriendList } from "@/src/context/FriendListContext";
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
      title = "title",
      mountingText = "Start typing",
      onTextChange,
      width = "90%",
      height = "60%",
      multiline = true,
      friendModalOpened =true,
    },
    ref
  ) => {
    const {
      themeStyles,
      appFontStyles,
      manualGradientColors,
      appContainerStyles,
    } = useGlobalStyle();

    const { settings } = useUserSettings(); 
    const [editedMessage, setEditedMessage] = useState(mountingText); // Use the starting text passed as prop

    const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

    const textInputRef = useRef();

    //This is what turns moment text input autofocus on/off depending on user's settings
    useFocusEffect(
      useCallback(() => {
        const timeout = setTimeout(() => {
          if (
            textInputRef.current &&
            settings.simplify_app_for_focus === true
          ) {
            textInputRef.current.focus();
          } else {
            //  console.log("Not focusing TextInput");
          }
        }, 50); // Small delay for rendering
        return () => clearTimeout(timeout); // Cleanup timeout
      }, [settings])
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
      focus: () => {
        
        console.log('focus!');
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
            appContainerStyles.homeScreenNewMomentContainer,
            {
              width: "100%",
              height: multiline ? "100%" : 30,
              paddingLeft: 18,
              marginTop: 0,
              paddingTop: multiline ? 0 : 0,
              borderRadius: 0,
              backgroundColor: multiline
                ? themeStyles.primaryBackground.backgroundColor
                : // ? manualGradientColors.homeDarkColor
                  themeStyles.overlayBackgroundColor.backgroundColor
              //  backgroundColor: 'red',
                // backgroundColor: 'teal',
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
                      // backgroundColor: 'red',
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
                        borderColor: themeStyles.primaryText.color,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="plus"
                        color={themeStyles.primaryText.color}
                        size={20}
                      />
                    </View>
                    <Text
                      style={[
                        styles.helperText,
                        themeStyles.primaryText,
                        { fontFamily: "Poppins-Regular" },
                      ]}
                    >
                      {"  "}Add talking point
                      {/* {selectedFriend ? ( 
                        <Text style={{ fontWeight: "bold" }}>
                          {selectedFriend.name}
                        </Text>
                      ) : ( 
                        <Text>a friend</Text>
                      )} */}
                      {/* ? */}
                    </Text>

                    {!multiline && (
                      <Pressable
                        onPress={handleCaptureImage}
                        style={{
                          flexDirection: "row",
                          marginLeft: 30,
                          zIndex: 6000,
                          // position: "absolute",
                          flexDirection: "row",
                          zIndex: 4000,
                          // backgroundColor: 'red',
                          // top: 0,
                          // left: 180,
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
                            borderColor: themeStyles.primaryText.color,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="plus"
                            color={themeStyles.primaryText.color}
                            size={20}
                          />
                        </View>
                        <Text
                          style={[
                            styles.helperText,
                            themeStyles.primaryText,
                            { fontFamily: "Poppins-Regular" },
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
                          //  position: "absolute",
                          flexDirection: "row",
                          marginLeft: 30,
                          zIndex: 5000,
                          zIndex: 5000,
                          elevation: 5000,
                          // width: 60,
                          width: "auto",
                          // backgroundColor: 'red',
                          // top: 0,
                          // left: 266,
                          // right: 0,
                          height: 30,
                          //backgroundColor: 'orange',
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
                            borderColor: themeStyles.primaryText.color,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="plus"
                            color={themeStyles.primaryText.color}
                            size={20}
                          />
                        </View>
                        <Text
                          // numberOfLines={1}
                          style={[
                            styles.helperText,
                            themeStyles.primaryText,
                            { fontFamily: "Poppins-Regular" },
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
                // keyboardVerticalOffset={100}
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
                  {/* <View
                  style={{
                    flexShrink: 1,
                    justifyContent: "flex-start",
                    width: "auto",
                  }}
                ></View> */}
                  {settings && (
                    <TextInput
                      ref={textInputRef}
                      autoFocus={settings.simplify_app_for_focus}
                      style={[styles.textInput, themeStyles.genericText]}
                      value={editedMessage}
                      placeholder={""}
                      onBlur={() => console.log('lost focus')}
                      placeholderTextColor={"white"}
                      onChangeText={handleTextInputChange} // Update local state
                      multiline={multiline}
                    />
                  )}
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
