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
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import FriendSelectModalVersionButtonOnly from "../friends/FriendSelectModalVersionButtonOnly";
 
import LeafSingleOutlineThickerSvg from "@/app/assets/svgs/leaf-single-outline-thicker.svg";
import { useAuthUser } from "@/src/context/AuthUserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext"; 
import { useFocusEffect } from "@react-navigation/native";
 


// Forwarding ref to the parent to expose the TextInput value
const TextMomentHomeScreenBox = forwardRef(
  //width and height are original settings being used in location notes
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
    const { themeStyles } = useGlobalStyle();
    const { authUserState, userAppSettings } = useAuthUser();
    const {   friendListLength } = useFriendList();
    const { selectedFriend } = useSelectedFriend();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [editedMessage, setEditedMessage] = useState(mountingText); // Use the starting text passed as prop
     const [ autoFocusSelected, setAutoFocusSelected ] = useState(true);

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

    // useEffect(() => {
    //   if (authUserState && authUserState.user) {
    //     console.log(authUserState);
    //   }
    // }, []);

 
//This is what turns moment text input autofocus on/off depending on user's settings
    useFocusEffect(
      useCallback(() => {
        const timeout = setTimeout(() => {
          if (textInputRef.current && userAppSettings.simplify_app_for_focus === true) {
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
          console.log('userappsettings focus: ', userAppSettings.simplify_app_for_focus);
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
                  //marginBottom: "1%",
                }}
              >
                <Text
                  style={[styles.welcomeHeaderText, themeStyles.genericText]}
                >
                  {new Date(authUserState?.user?.created_on).toDateString() ===
                  new Date().toDateString()
                    ? `Hi ${authUserState?.user?.username}!`
                    : `Hi ${authUserState?.user?.username}!`}
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
              <View style={{ flex: 1, marginTop: "0%" }}>
                {friendListLength && !editedMessage && (
                  <View style={{position: 'absolute', top: 0, left: 46, right: 0}}>

                  <Text style={[styles.helperText, themeStyles.genericText]}>
                    Add a new moment for{" "}
                    {/* Enter a note, anecdote, joke, or whatever else you
                    would like to share with{" "} */}
                    {selectedFriend ? (
                                //   <View style={{
                                //     backgroundColor: selectedFriend ? themeAheadOfLoading.lightColor : 'transparent',  // Circle color
                                //     borderRadius: 50,  // Half of width/height to make it circular
                                //     //width: 32,  // Circle diameter
                                //     //height: 32,
                                //     alignItems: 'center', 
                                //     justifyContent: 'center',
                                //     //marginLeft: 4,  // Adjust spacing between circle and ProfileCircleSvg if needed
                                // }}>


                      // color: themeAheadOfLoading.darkColor
                      <Text style={{ fontWeight: "bold" }}>
                        {selectedFriend.name}
                      </Text>
                      
                      // </View>
                    ) : (
                      <Text>your friend</Text>
                    )}?
                  </Text>
                  </View>
                )}
                {friendListLength > 0 && (
                  
                <View style={{ flexDirection: "row", marginTop: "0%" }}>
                  <View style={{ flexShrink: 1,justifyContent: 'flex-start', width: "auto" }}>
                    <LeafSingleOutlineThickerSvg
                      height={26}
                      width={26}
                      color={themeStyles.genericText.color}
                    />
                  </View>
                  
                
                  {friendListLength && (
                    <TextInput
                      ref={textInputRef}
                      autoFocus={autoFocusSelected || false}
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
 
  container: {
    borderRadius: 30,
    alignSelf: "center",
    paddingHorizontal: '4%',
    paddingVertical: '0%',
    //backgroundColor: 'gray',
    padding: '2%',
    marginBottom: '2%',
  },
  selectFriendContainer: {
    width: 40,
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30, 
  },
  welcomeHeaderText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Poppins-Regular",
    //textTransform: "uppercase",
  },
  title: {
    fontSize: 17,
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
    paddingVertical: 0,
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "Poppins-Regular",
     
  },
});

export default TextMomentHomeScreenBox;
