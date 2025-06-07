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
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { AntDesign } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
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
    },
    ref
  ) => {
    const {
      themeStyles,
      appFontStyles,
      manualGradientColors,
      appContainerStyles,
    } = useGlobalStyle();
    const { userAppSettings } = useUser();
    // const { friendListLength } = useFriendList(); checking higher up
    const { selectedFriend } = useSelectedFriend();
    const [editedMessage, setEditedMessage] = useState(mountingText); // Use the starting text passed as prop

    const { handleCaptureImage, handleSelectImage } = useImageUploadFunctions();

    const textInputRef = useRef();

    //This is what turns moment text input autofocus on/off depending on user's settings
    useFocusEffect(
      useCallback(() => {
        const timeout = setTimeout(() => {
          if (
            textInputRef.current &&
            userAppSettings.simplify_app_for_focus === true
          ) {
            textInputRef.current.focus();
          } else {
            //  console.log("Not focusing TextInput");
          }
        }, 50); // Small delay for rendering
        return () => clearTimeout(timeout); // Cleanup timeout
      }, [userAppSettings])
    );

    const addIconSize = 22;

    //  (CHATGIPITY EXPLANATION ON WHY I NEEDED TO PASS IN USERAPPSETTINGS IN THE DEPEND ARRAY ABOVE:
    //
    // If you leave the dependency array empty:

    // The useCallback function is only created once, on the initial render.
    // It captures the initial value of userAppSettings and does not respond to changes in that variable.
    // Subsequent updates to userAppSettings won’t trigger the useFocusEffect callback because the dependencies for the useCallback don’t change.
    // Why Including userAppSettings Solves the Problem
    // By including userAppSettings in the dependency array, you tell React:

    // Recreate the useCallback whenever userAppSettings changes.
    // This ensures that the useFocusEffect re-executes with the latest value of userAppSettings.)

    // useEffect(() => {
    //   if (userAppSettings) {
    //     // console.log('userappsettings focus: ', userAppSettings.simplify_app_for_focus);
    //     setAutoFocusSelected(userAppSettings.simplify_app_for_focus);
    //   }
    // }, [userAppSettings]);

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
           marginTop: 8,
              paddingTop: multiline ? 0 : 0,
              borderRadius: 10,
              backgroundColor: multiline
                   ? themeStyles.primaryBackground.backgroundColor
                // ? manualGradientColors.homeDarkColor
                : "transparent",
                  //  backgroundColor: 'red',
            },
          ]}
        >
          <>
            <View style={{ flex: 1 }}>
              <></>
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
                    <Text style={[styles.helperText, themeStyles.primaryText, { fontFamily: 'Poppins-Regular'}]}>
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
                      <TouchableOpacity
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
                          width: 'auto',
                          alignItems: "center",
                          opacity: multiline ? 0 : .9,
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
                          style={[styles.helperText, themeStyles.primaryText, {  fontFamily: 'Poppins-Regular'}]}
                        >
                          {"  "}Pic
                        </Text>
                      </TouchableOpacity>
                    )}
                    {!multiline && (
                      <TouchableOpacity
                        onPress={handleSelectImage}
                        style={{
                          //  position: "absolute",
                   flexDirection: 'row',
                          marginLeft: 30,
                          zIndex: 5000,
                          zIndex: 5000,
                          elevation: 5000,
                         // width: 60,
                          width: 'auto',
                          // backgroundColor: 'red',
                          // top: 0,
                          // left: 266,
                          // right: 0,
                          height: 30,
                          //backgroundColor: 'orange',
                          alignItems: "center",
                          opacity: multiline ? 0 : .9,
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
                          style={[styles.helperText, themeStyles.primaryText, { fontFamily: 'Poppins-Regular'}]}
                        >
                          {"  "}Upload
                        </Text>
                      </TouchableOpacity>
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
                  {userAppSettings && (
                    <TextInput
                      ref={textInputRef}
                      autoFocus={userAppSettings.simplify_app_for_focus}
                      style={[styles.textInput, themeStyles.genericText]}
                      value={editedMessage}
                      placeholder={""}
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
