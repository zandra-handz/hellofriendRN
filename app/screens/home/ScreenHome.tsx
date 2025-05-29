import { useShareIntentContext } from "expo-share-intent";
//import * as Sentry from "@sentry/react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Alert,  
  Keyboard,
  Animated,  
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import WelcomeMessageUI from "@/app/components/home/WelcomeMessageUI";
import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI";
import HomeFriendItems from "@/app/components/home/HomeFriendItems";
import HellofriendHeader from "@/app/components/headers/HellofriendHeader";
import { useGeolocationWatcher } from "@/src/hooks/useCurrentLocationAndWatcher"; 
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext"; //to check if any friends, don't render Up Next component or upcoming scroll if so
import AddOptionsList from "@/app/components/home/AddOptionsList";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useMessage } from "@/src/context/MessageContext";
import { LinearGradient } from "expo-linear-gradient";
import HomeScrollSoon from "@/app/components/home/HomeScrollSoon";
import { useNavigation } from "@react-navigation/native";
import HomeScrollCalendarLights from "@/app/components/home/HomeScrollCalendarLights";
 
import KeyboardCoasterMomentOrFriend from "@/app/components/home/KeyboardCoasterMomentOrFriend";
import KeyboardCoasterNotNow from "@/app/components/home/KeyboardCoasterNotNow";


import HomeButtonUpNext from "@/app/components/home/HomeButtonUpNext";
import HomeButtonSelectedFriend from "@/app/components/home/HomeButtonSelectedFriend";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
import QuickWriteMoment from "@/app/components/moments/QuickWriteMoment";
import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";

import * as FileSystem from "expo-file-system";

import SafeView from "@/app/components/appwide/format/SafeView";

const ScreenHome = () => {
  const { hasShareIntent, shareIntent } = useShareIntentContext();
const navigation = useNavigation();
  useGeolocationWatcher(); // Starts watching for location changes
  const { themeStyles, gradientColorsHome } = useGlobalStyle();
  const { user, isAuthenticated, isInitializing, userAppSettings } = useUser();
  const { selectedFriend  } = useSelectedFriend();
  const { friendList, friendListLength } = useFriendList();
  const [showMomentScreenButton, setShowMomentScreenButton] = useState();

  const {
    requestPermission,
    imageUri,
    resizeImage, 
  } = useImageUploadFunctions();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { showMessage } = useMessage();

  const newMomentTextRef = useRef(null);
  const isNewUser = new Date(user?.created_on).toDateString() === new Date().toDateString();
 

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
  
  const [slideAnim] = useState(new Animated.Value(1)); // Value for animating the button container

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
 
  const navigateToAddFriendScreen = () => {
    navigation.navigate("AddFriend");
  };

 

  return (
    <SafeView style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          gradientColorsHome.darkColor,
          isKeyboardVisible
            ? gradientColorsHome.midpointColor
            : gradientColorsHome.lightColor,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <HellofriendHeader />
          {isAuthenticated   && userAppSettings && friendList && friendList.length > 0  ? (
            <View
              style={{
                flex: 1,
                paddingBottom: "1%",
                justifyContent: "space-between",
                flexDirection: "column",
                paddingHorizontal: "2%",
              }}
            >
            
              <View
                style={{
                  height: isKeyboardVisible ? "89%" : "30%",
                }}
              >
                {/* <Button
                title="Try!"
                onPress={() => {
                  Sentry.captureException(new Error("First error"));
                }}
              /> */}
              {isAuthenticated && !isInitializing && (
                
              <WelcomeMessageUI username={user.username} isNewUser={isNewUser} />
              
              )} 
              <QuickWriteMoment
                  width={"100%"}
                  height={"100%"}
                  ref={newMomentTextRef}
                  title={"Add a new moment?"}
                  iconColor={themeStyles.genericText.color}
                  mountingText={""}
                  onTextChange={updateNewMomentTextString}
                  multiline={true}
                />

                {isKeyboardVisible && (
                  <KeyboardCoasterNotNow 
                  onPress={() => Keyboard.dismiss()}/>
                )}
  
                {selectedFriend && showMomentScreenButton && (
                 
                    <KeyboardCoasterMomentOrFriend
                      onPress={navigateToAddMomentScreen}
                      borderRadius={40} 
                    /> 
                )}
                  {!selectedFriend && (
                 
                    <KeyboardCoasterMomentOrFriend
                      onPress={navigateToAddMomentScreen}
                      borderRadius={40} 
                    /> 
                )}
              </View>
              {friendListLength > 0 && (
                <AddOptionsList />
              )}
              <Animated.View
                style={[
                  {
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: 1,
                    paddingTop: 10,
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >

                {!selectedFriend && friendListLength > 0 && (
                  <HomeButtonUpNext
                    onPress={navigateToAddMomentScreen}
                    borderRadius={10}
                    height={500}
                    borderColor="black" 
                  />
                )}
                {selectedFriend && (
                  <>
                  <HomeButtonSelectedFriend
                    onPress={navigateToAddMomentScreen}
                    borderRadius={10}
                    borderColor="black"
                    height={"100%"}
                  />
                  <HomeFriendItems 
                  borderRadius={10}/>
                  
                  </>
                )}
                {friendListLength > 0 && selectedFriend && (
                  
                <HomeScrollSoon
                  height={"100%"}
                  maxHeight={600}
                  borderRadius={10}
                  borderColor="black"
                />
                
                )}
                {/* {selectedFriend && (
                  <HomeScrollCalendarLights
                    height={"5%"}
                    borderRadius={40}
                    borderColor="black"
                  />
                )} */}
              </Animated.View>
            </View>
          ) : (
            <NoFriendsMessageUI username={user?.username || ''} userCreatedOn={user?.created_on || ''}/>
          )}

          <HelloFriendFooter />
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeView>
  );
};

export default ScreenHome;
