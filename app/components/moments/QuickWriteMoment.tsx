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
    const { themeStyles, appFontStyles, manualGradientColors, appContainerStyles } = useGlobalStyle();
    const { userAppSettings } = useUser();
    // const { friendListLength } = useFriendList(); checking higher up
    const { selectedFriend } = useSelectedFriend();
    const [editedMessage, setEditedMessage] = useState(mountingText); // Use the starting text passed as prop
    const [autoFocusSelected, setAutoFocusSelected] = useState(true);
      const { 
    handleCaptureImage,
    handleSelectImage,
  } = useImageUploadFunctions();

    const textInputRef = useRef();

    //This is what turns moment text input autofocus on/off depending on user's settings
    useFocusEffect(
      useCallback(() => {
        const timeout = setTimeout(() => {
          if (
            textInputRef.current &&
            userAppSettings.simplify_app_for_focus === true
          ) {
            console.log("Focusing TextInput");
            textInputRef.current.focus();
          } else {
            console.log("Not focusing TextInput");
          }
        }, 50); // Small delay for rendering
        return () => clearTimeout(timeout); // Cleanup timeout
      }, [userAppSettings])
    );

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

    useEffect(() => {
      if (userAppSettings) {
        // console.log('userappsettings focus: ', userAppSettings.simplify_app_for_focus);
        setAutoFocusSelected(userAppSettings.simplify_app_for_focus);
      }
    }, [userAppSettings]);

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
            { width: '100%', height: multiline? '100%' : 30, paddingLeft: 16, paddingTop: multiline? 16 : 0, borderRadius: 10, backgroundColor: multiline ? manualGradientColors.homeDarkColor : 'transparent' },
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
                    alignItems: 'center',
                    opacity: multiline ? .5 : 1,
                  }}
                >
                  <View
                    style={{
                      height: 24,
                      width: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
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
                  <Text style={[styles.helperText, themeStyles.primaryText]}>
                    {"  "}Talking point
                    {/* {selectedFriend ? ( 
                        <Text style={{ fontWeight: "bold" }}>
                          {selectedFriend.name}
                        </Text>
                      ) : ( 
                        <Text>a friend</Text>
                      )} */}
                    {/* ? */}
                  </Text>
                </View>

                {/* <TouchableOpacity
                onPress={handleCaptureImage}
                  style={{
                    position: "absolute",
                    flexDirection: "row",
                  zIndex: 4000,
                   // backgroundColor: 'red',
                    top: 0,
                    left: 134, 
                    height: 30,
                    width: 60,
                    //backgroundColor: 'pink',
                    alignItems: 'center',
                    opacity: multiline ? 0 : 1,
                  }}
                >
                  <View
                    style={{
                      height: 24,
                      width: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
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
                  <Text style={[styles.helperText, themeStyles.primaryText]}>
                    {"  "}Pic 
                  </Text>
                </TouchableOpacity> */}
                
                  {/* <TouchableOpacity
                 onPress={handleSelectImage}
                  style={{
                 //   position: "absolute",
                    flexDirection: "row",
                    zIndex: 5000,
                    elevation: 5000,
                    width: 60,
                   // backgroundColor: 'red',
                    top: 0,
                    left: 200,
                    right: 0,
                    height: 30,
                    //backgroundColor: 'orange',
                    alignItems: 'center',
                    opacity: multiline ? 0 : 1,
                  }}
                >
                  <View
                    style={{
                      height: 24,
                      width: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 12,
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
                  <Text style={[styles.helperText, themeStyles.primaryText]}>
                    {"  "}Upl
                    {/* {selectedFriend ? ( 
                        <Text style={{ fontWeight: "bold" }}>
                          {selectedFriend.name}
                        </Text>
                      ) : ( 
                        <Text>a friend</Text>
                      )} */}
                    {/* ? */}

                  {/* </Text>
                </TouchableOpacity> */} 
                </>
                
                
              )}
                    <KeyboardAvoidingView
                      keyboardVerticalOffset={130}
                      behavior={Platform.OS === "ios" ? "padding" : "height"}
                      style={[{ flex: 1 , paddingBottom: multiline? 70 : 0}]}
                    > 
              <View style={{ flexDirection: "row", paddingTop: 3, paddingLeft: 4 }}>
                {/* <View
                  style={{
                    flexShrink: 1,
                    justifyContent: "flex-start",
                    width: "auto",
                  }}
                ></View> */}
                <TextInput
                  ref={textInputRef}
                  autoFocus={autoFocusSelected || false}
                  style={[styles.textInput, themeStyles.genericText]}
                  value={editedMessage}
                  placeholder={""}
                  placeholderTextColor={"white"}
                  onChangeText={handleTextInputChange} // Update local state
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

  title: {
    fontSize: 15,
    lineHeight: 32,

    fontFamily: "Poppins-Regular",
  },
  helperText: {
    fontSize: 16,
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
