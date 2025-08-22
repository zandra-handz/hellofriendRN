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
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import useAppNavigations from "@/src/hooks/useAppNavigations";
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

const ScreenHome = () => {
  const { hasShareIntent, shareIntent } = useShareIntentContext();
  const navigation = useNavigation();
  const { appContainerStyles,appFontStyles, manualGradientColors, themeStyleSpinners, themeStyles,  } = useGlobalStyle();
  const welcomeTextStyle = appFontStyles.welcomeText;
  const subWelcomeTextStyle = appFontStyles.subWelcomeText;
  const primaryTextStyle = themeStyles.primaryText;
  const primaryColor = themeStyles.primaryText.color;
  const primaryBackgroundColor = themeStyles.primaryBackground.backgroundColor;
  const primaryOverlayColor =
    themeStyles.overlayBackgroundColor.backgroundColor;
    const darkerOverlayBackgroundColor = themeStyles.darkerOverlayBackgroundColor.backgroundColor;
  const newMomentContainerStyle =
    appContainerStyles.homeScreenNewMomentContainer;

    const spinnerStyle = themeStyleSpinners.homeScreen;


  const { themeAheadOfLoading } = useFriendStyle();


  const appColorsStyle = manualGradientColors;
  const themeAheadOfLoadingStyle = themeAheadOfLoading;

  const { navigateToMomentFocusWithText } = useAppNavigations();
  const { user } = useUser();

  const { selectedFriend, loadingNewFriend } = useSelectedFriend();


  const { friendList } = useFriendList();
  const [showMomentScreenButton, setShowMomentScreenButton] = useState(false);

  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const newMomentTextRef = useRef(null);
  const username = user?.username;
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
        navigateToMomentFocusWithText({
          screenCameFrom: 0, //goes back to home screen that is now selected friend screen
          momentText: sharedText,
        });
      } else {
        showFlashMessage(
          `length in shared text but data structure passed here is not valid`,
          true,
          2000
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
    if (newMomentTextRef && newMomentTextRef.current) {
      navigateToMomentFocusWithText({
        screenCameFrom: 0, //goes back to home screen that is now selected friend screen
        momentText: newMomentTextRef.current.getText(),
      });
      clearNewMomentText();
    }
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
      // console.log("focusing");
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
              {selectedFriend && <TopBarHome />}
            </View>

            {/* // )} */}
            {!selectedFriend && (
              <>
                <WelcomeMessageUI
                  primaryColor={primaryColor}
                  welcomeTextStyle={welcomeTextStyle}
                  subWelcomeTextStyle={subWelcomeTextStyle}
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
                  primaryTextStyle={primaryTextStyle}
                  primaryBackgroundColor={primaryBackgroundColor}
                  primaryOverlayColor={primaryOverlayColor}
                  darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
                  newMomentContainerStyle={newMomentContainerStyle}
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
              appColorsStyle={appColorsStyle}
              friendStyle={themeAheadOfLoadingStyle}
              selectedFriendId={selectedFriend?.id}
              selectedFriendName={selectedFriend?.name}
primaryOverlayColor={primaryOverlayColor}
                primaryTextStyle={primaryTextStyle}
                welcomeTextStyle={welcomeTextStyle}
                subWelcomeTextStyle={subWelcomeTextStyle}
                primaryBackgroundColor={primaryBackgroundColor}
                darkerOverlayBackgroundColor={darkerOverlayBackgroundColor}
                spinnerStyle={spinnerStyle}
                slideAnim={slideAnim}
                friendListLength={friendList?.length || 0}
                isFriendSelected={!!selectedFriend}
                onPress={navigateToAddMomentScreen}
                loadingNewFriend={loadingNewFriend}
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
