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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import EditPencilOutlineSvg from "../assets/svgs/edit-pencil-outline.svg";
import FriendSelectModalVersionButtonOnly from "../components/FriendSelectModalVersionButtonOnly";
import HomeButtonMomentAdd from "../components/HomeButtonMomentAdd";
import LeafSingleOutlineThickerSvg from "../assets/svgs/leaf-single-outline-thicker.svg";
import { useAuthUser } from "../context/AuthUserContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useFriendList } from "../context/FriendListContext";
import LeavesTwoFallingOutlineThickerSvg from "../assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeavesSingleStemOutlineSvg from "../assets/svgs/leaves-single-stem-outline.svg";
import { useFocusEffect } from "@react-navigation/native";

// Forwarding ref to the parent to expose the TextInput value
const TextMomentHomeScreenBox = forwardRef(
  //width and height are original settings being used in location notes
  (
    {
      title = "title",
      mountingText = "Start typing",
      onTextChange,
      autoFocus = true,
      width = "90%",
      height = "60%",
      multiline = true,
      iconColor = "red",
    },
    ref
  ) => {
    const { themeStyles } = useGlobalStyle();
    const { authUserState } = useAuthUser();
    const { friendListLength } = useFriendList();
    const { selectedFriend } = useSelectedFriend();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [editedMessage, setEditedMessage] = useState(mountingText); // Use the starting text passed as prop
    const textInputRef = useRef();

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => setIsKeyboardVisible(true)
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => setIsKeyboardVisible(false)
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

    useEffect(() => {
      if (authUserState && authUserState.user) {
        console.log(authUserState);
      }
    }, []);

    useFocusEffect(
      useCallback(() => {
        const timeout = setTimeout(() => {
          if (textInputRef.current) {
            console.log("Focusing TextInput");
            textInputRef.current.focus();
          }
        }, 50); // Small delay for rendering
        return () => clearTimeout(timeout); // Cleanup timeout
      }, [])
    );

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
      console.log(text);
      setEditedMessage(text);
      onTextChange(text);
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            //themeStyles.genericTextBackground,
            { width: width, height: height },
          ]}
        >
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                height: "auto",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  height: "100%",
                  alignItems: "center",
                  marginBottom: "1%",
                }}
              >
                <Text
                  style={[styles.welcomeHeaderText, themeStyles.genericText]}
                >
                  {new Date(authUserState?.user?.created_on).toDateString() ===
                  new Date().toDateString()
                    ? `Hi ${authUserState?.user?.username}!`
                    : `Welcome back, ${authUserState?.user?.username}!`}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                height: "auto",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.title, themeStyles.genericText]}>
                  {friendListLength
                    ? title
                    : `Please add one or more friends to use this app!`}
                </Text>
              </View>

              {friendListLength && (
                <View
                  style={[styles.selectFriendContainer, { marginBottom: "2%" }]}
                >
                  <FriendSelectModalVersionButtonOnly
                    color={themeStyles.genericText.color}
                    includeLabel={true}
                    width="auto"
                  />
                </View>
              )}
            </View>
            <>
              <View style={{ flex: 1, marginTop: "1%" }}>
                {friendListLength && (
                  <Text style={[styles.helperText, themeStyles.genericText]}>
                    Enter a note, anecdote, joke, or whatever else you
                    would like to share with{" "}
                    {selectedFriend ? (
                      <Text style={{ fontWeight: "bold" }}>
                        {selectedFriend.name}
                      </Text>
                    ) : (
                      <Text>your friend</Text>
                    )}{" "}
                    here:
                  </Text>
                )}
                {friendListLength > 0 && (
                  
                <View style={{ flexDirection: "row", marginTop: "2%" }}>
                  <View style={{ flexShrink: 1, width: "auto" }}>
                    <LeafSingleOutlineThickerSvg
                      height={36}
                      width={36}
                      color={themeStyles.genericText.color}
                    />
                  </View>
                  
                
                  {friendListLength && (
                    <TextInput
                      ref={textInputRef}
                      autoFocus={autoFocus}
                      style={[
                        styles.textInput,
                        themeStyles.genericText,
                        //themeStyles.genericTextBackground,
                      ]}
                      value={editedMessage}
                      placeholder={""}
                      placeholderTextColor={"white"}
                      onChangeText={handleTextInputChange} // Update local state
                      multiline={multiline}
                    />
                  )}
                </View>
                )}
              </View>
            </>
          </>
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: "4%",
  },
  container: {
    borderRadius: 30,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  selectFriendContainer: {
    width: 40,
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
  },
  welcomeHeaderText: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: "Poppins-Regular",
    //textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    lineHeight: 32,

    fontFamily: "Poppins-Regular",
    //textTransform: "uppercase",
  },
  helperText: {
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.5,
    //marginLeft: '6%'
    //textTransform: "uppercase",
  },
  textInput: {
    textAlignVertical: "top",
    borderRadius: 20,
    paddingVertical: 10,
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
  },
});

export default TextMomentHomeScreenBox;
