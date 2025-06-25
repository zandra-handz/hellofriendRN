import { useShareIntentContext } from "expo-share-intent";
//import * as Sentry from "@sentry/react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import WelcomeMessageUI from "@/app/components/home/WelcomeMessageUI";
import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI"; 
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

import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import FriendHeaderMessageUI from "@/app/components/home/FriendHeaderMessageUI";

import { useUserSettings } from "@/src/context/UserSettingsContext";

const ScreenHome = () => {
  const { hasShareIntent, shareIntent } = useShareIntentContext();
  const navigation = useNavigation();
  // using DeviceLocationContext now
  // useGeolocationWatcher(); // Starts watching for location changes
  const { themeStyles, gradientColorsHome } = useGlobalStyle();
  const { user, isAuthenticated, isInitializing } = useUser();

  const { settings } = useUserSettings();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { friendList, friendListLength } = useFriendList();
  const [showMomentScreenButton, setShowMomentScreenButton] = useState(false);

  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { showMessage } = useMessage();

  const newMomentTextRef = useRef(null);
  const isNewUser =
    new Date(user?.created_on).toDateString() === new Date().toDateString();



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

  //const [slideAnim] = useState(new Animated.Value(1)); // Value for animating the button container
  const slideAnim = useSharedValue(1);
  // Trigger the slide-in animation when the screen mounts
  // useEffect(() => {
  //   Animated.timing(slideAnim, {
  //     toValue: 0, // Slide in from the right
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // }, []);

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
    console.log('handlefocuspress!');
     newMomentTextRef.current.focus();
    console.log(newMomentTextRef.current.getText());
    if (newMomentTextRef & newMomentTextRef.current) {
      console.log('focusing');
      newMomentTextRef.current.focus();
    }
  };

  return (
    <SafeViewAndGradientBackground
      includeBackgroundOverlay={true}
      backgroundOverlayHeight={ isKeyboardVisible ? '100%' : 300}
       backgroundOverlayBottomRadius={20}
      style={{ flex: 1 }}
     // header={HellofriendHeader}
    >
      {/* <Pressable onPress={handleFocusPress} style={{  position: 'absolute', width: '100%', top: 55, zIndex: 1000, height: 190 }}></Pressable>
      */}
     
      <KeyboardAvoidingView
    
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[{ flex: 1 }]}
      > 
        {isAuthenticated &&
        settings &&
        friendList &&
        friendList.length > 0 ? (
          <View
            style={{
              flex: 1, 
              justifyContent: "space-between",
              flexDirection: "column",
              paddingHorizontal: 0,
            }}
          >
            <View
              style={{
                position: 'absolute', zIndex: 3000,
                width: '100%',
              //  backgroundColor: themeStyles.lighterOverlayBackgroundColor.backgroundColor,
                borderRadius: 10,
                paddingHorizontal: 0, 
                
                
                height: isKeyboardVisible ? "89%" : "28%", // doesn't control height of quickwritemoment now -- prop 'multiline' does 
              }}
            >
              {/* <Button
                title="Try!"
                onPress={() => {
                  Sentry.captureException(new Error("First error"));
                }}
              /> */}
              {isAuthenticated && !isInitializing && (
                <View style={{width: '100%', paddingHorizontal: 10, marginTop: 0}}>
                  {!selectedFriend && (
                    
                <WelcomeMessageUI
                  username={user.username}
                  isNewUser={isNewUser}
                  isKeyboardVisible={isKeyboardVisible}
                  onPress={handleFocusPress} 
                />
                
                  )}
                  {selectedFriend && (
                    <FriendHeaderMessageUI
                    isKeyboardVisible={isKeyboardVisible}
                    onPress={handleFocusPress}

                    />
                  )}
                </View>
              )}
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
            </View>
            {!isKeyboardVisible && !loadingNewFriend && (
              <BelowKeyboardComponents
                slideAnim={slideAnim}
                friendListLength={friendListLength}
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
