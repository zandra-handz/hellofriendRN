import { useShareIntentContext } from "expo-share-intent";
//import * as Sentry from "@sentry/react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform, 
} from "react-native";
import WelcomeMessageUI from "@/app/components/home/WelcomeMessageUI";
import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI";
import TopBarHome from "@/app/components/home/TopBarHome";
import { AppState, AppStateStatus } from "react-native"; 
// import { useGeolocationWatcher } from "@/src/hooks/useCurrentLocationAndWatcher";
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext"; //to check if any friends, don't render Up Next component or upcoming scroll if so

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useMessage } from "@/src/context/MessageContext";
import { useNavigation } from "@react-navigation/native";
import BelowKeyboardComponents from "@/app/components/home/BelowKeyboardComponents";
import { useFocusEffect } from "@react-navigation/native";
import KeyboardCoasters from "@/app/components/home/KeyboardCoasters";
import { useSharedValue } from "react-native-reanimated";

import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
import QuickWriteMoment from "@/app/components/moments/QuickWriteMoment";
import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";

import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 

const ScreenHome = () => {
  const { hasShareIntent, shareIntent } = useShareIntentContext();
  const navigation = useNavigation();
  // using DeviceLocationContext now
  // useGeolocationWatcher(); // Starts watching for location changes
  const { themeStyles } = useGlobalStyle();
  const { user, reInitialize, onSignOut } = useUser();

  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { friendList } = useFriendList();
  const [showMomentScreenButton, setShowMomentScreenButton] = useState(false);

  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { showMessage } = useMessage();

  const newMomentTextRef = useRef(null);
  const username = user?.username;
  const isNewUser =
    new Date(user?.created_on).toDateString() === new Date().toDateString();


 
  // console.log("HOME SCREEN RERENDEREEEEEEEEEEEEERded");

   const appState = useRef(AppState.currentState);
    useEffect(() => {
      const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
        console.log("Welcome screen: App state changed:", nextState);
  
        
        if (
          appState.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
  
  
          console.log("Weclome screen: App has come to the foreground!"); 
          
          console.warn(`CHEKING IF SGINED IN   `);
          
          checkIfSignedIn();
          if (!reInitialize) {
          return;
        }
    
        }
  
        appState.current = nextState;
      });
  
      return () => subscription.remove(); // cleanup
    }, [reInitialize]);


    useEffect(() => {
      console.log('user changed!!!!!!!');

    }, [user]);
  useEffect(() => {
    if (!hasShareIntent || !shareIntent) return;

    if (hasShareIntent && shareIntent?.files?.length > 0) {
      const file = shareIntent.files[0];
      const uri = file?.path || file?.contentUri; // Support both iOS and Android URIs

      if (uri) {
        processSharedFile(uri);
      } else {
        console.warn("No valid URI found for the shared file.");
      }
    }

    if (hasShareIntent && shareIntent?.text?.length > 0) {
      const sharedText = shareIntent.text.replace(/^["']|["']$/g, "");
      if (sharedText) {
        navigation.navigate("MomentFocus", {
          momentText: sharedText,
        });
      } else {
        showMessage(
          true,
          null,
          `length in shared text but data structure passed here is not valid`
        );
      }
    }
  }, [shareIntent, hasShareIntent]);

  const processSharedFile = async (url) => {
    if (url.startsWith("content://") || url.startsWith("file://")) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(url);

        if (fileInfo && fileInfo.exists) {
          // Validate that it's an image
          if (fileInfo.uri.match(/\.(jpg|jpeg|png|gif)$/)) {
            const resizedImage = await resizeImage(fileInfo.uri);
            navigation.navigate("AddImage", { imageUri: resizedImage.uri }); // Navigate with resized image URI
          } else {
            Alert.alert(
              "Unsupported File",
              "The shared file is not a valid image."
            );
          }
        } else {
          Alert.alert("Error", "Could not process the shared file.");
        }
      } catch (error) {
        console.error("Error processing shared file:", error);
        Alert.alert(
          "Error",
          "An error occurred while processing the shared file."
        );
      }
    }
  };

  //just checks if token, if no token stored, signs out which will cause redirect to welcome screen
  //NO REINIT/API CALL HERE, OTHER PARTS OF THE CODE WILL HANDLE THAT IF 401 ERROR OCCURS
  const checkIfSignedIn = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        // reInitialize();
        console.log('good to go!');
      } else {
        onSignOut();
      }
    } catch (error) {
      console.error("Error checking sign-in status", error);
      onSignOut();
    }
  };

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

  const updateNewMomentTextString = (text) => {
    if (newMomentTextRef && newMomentTextRef.current) {
      const textLengthPrev = newMomentTextRef.current.getText().length;
      if (textLengthPrev === 0) {
        if (text.length - textLengthPrev > 1) {
          //this is here to check if something is copy-pasted in or shared in
          setShowMomentScreenButton(true);
        }
      }
      newMomentTextRef.current.setText(text);
      if (text.length === 0) {
        setShowMomentScreenButton(false);
      }
      if (text.length === 1) {
        setShowMomentScreenButton(true);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (newMomentTextRef && newMomentTextRef.current) {
        if (newMomentTextRef.current.getText().length > 0) {
          setShowMomentScreenButton(true);
        } else {
          setShowMomentScreenButton(false);
        }
      }
      return () => {};
    }, [])
  );
   const slideAnim = useSharedValue(1);
 

  const clearNewMomentText = () => {
    if (newMomentTextRef && newMomentTextRef.current) {
      newMomentTextRef.current.setText("");
      setShowMomentScreenButton(false);
    }
  };

  const navigateToAddMomentScreen = () => {
    navigation.navigate("MomentFocus", {
      momentText: newMomentTextRef.current.getText(),
    });
    clearNewMomentText();
  };

  const navigateToAddImageScreen = () => {
    navigation.navigate("AddImage", { imageUri: imageUri });
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (imageUri) {
      navigateToAddImageScreen();
    }
  }, [imageUri]);

  const handleFocusPress = () => {
    if (newMomentTextRef & newMomentTextRef.current) {
      console.log("focusing");
      newMomentTextRef.current.focus();
    }
  };

  return (
    <SafeViewAndGradientBackground
      includeBackgroundOverlay={true}
      backgroundOverlayHeight={isKeyboardVisible ? "100%" : 90}
      backgroundOverlayBottomRadius={0}
      useFriendColors={selectedFriend ? true : false}
      style={{ flex: 1 }}
      // header={HellofriendHeader}
    >
      {/* <Pressable onPress={handleFocusPress} style={{  position: 'absolute', width: '100%', top: 55, zIndex: 1000, height: 190 }}></Pressable>
       */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[{ flex: 1 }]}
      >
        {friendList ? (
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "column",
              paddingHorizontal: 0,
            }}
          > 
            <View style={{ width: "100%", paddingHorizontal: 0, marginTop: 0 }}>
           
              {selectedFriend && (
                <TopBarHome /> 
              )}
            </View>

            {/* // )} */}
            {!selectedFriend && (
              <>
                <WelcomeMessageUI
                  username={username}
                  isNewUser={isNewUser}
                  backgroundColor={
                    themeStyles.primaryBackground.backgroundColor
                  }
                  borderBottomLeftRadius={0}
                  borderBottomRightRadius={0}
                  // isKeyboardVisible={isKeyboardVisible}
                  onPress={handleFocusPress}
                  isKeyboardVisible={isKeyboardVisible}
                />
                <QuickWriteMoment
                  width={"100%"}
                  height={"100%"}
                  ref={newMomentTextRef}
                  title={"Add a new moment?"}
                  iconColor={themeStyles.genericText.color}
                  mountingText={""}
                  onTextChange={updateNewMomentTextString}
                  multiline={isKeyboardVisible}
                />
                <KeyboardCoasters
                  isKeyboardVisible={isKeyboardVisible}
                  isFriendSelected={!!selectedFriend}
                  showMomentScreenButton={showMomentScreenButton}
                  onPress={navigateToAddMomentScreen}
                />
              </>
            )}
            {!isKeyboardVisible && !loadingNewFriend && (
              <BelowKeyboardComponents
                slideAnim={slideAnim}
                friendListLength={friendList?.length || 0}
                isFriendSelected={!!selectedFriend}
                onPress={navigateToAddMomentScreen}
              />
            )}
          </View>
        ) : (
          <NoFriendsMessageUI
            username={user?.username || ""}
            userCreatedOn={user?.created_on || ""}
          />
        )}
      </KeyboardAvoidingView>

      <HelloFriendFooter />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHome;
