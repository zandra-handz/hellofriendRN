//import * as Sentry from "@sentry/react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// app state
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendDash } from "@/src/context/FriendDashContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import SelectedFriendFooter from "@/app/components/headers/SelectedFriendFooter";
import { useLDTheme } from "@/src/context/LDThemeContext"; 
// app utils
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

// app hooks
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

// third party  RESTORE SHARE INTENT WHEN PACKAGE IS UPDATED
// import { useShareIntentContext } from "expo-share-intent";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

import { useFocusEffect } from "@react-navigation/native";
import { useSharedValue } from "react-native-reanimated";

// app components
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import WelcomeMessageUI from "@/app/components/home/WelcomeMessageUI";
import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI";
import TopBarHome from "@/app/components/home/TopBarHome";
import QuickWriteMoment from "@/app/components/moments/QuickWriteMoment";
import BelowKeyboardComponents from "@/app/components/home/BelowKeyboardComponents";
import KeyboardCoasters from "@/app/components/home/KeyboardCoasters";
import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import manualGradientColors  from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
const ScreenHome = () => {
  const { user } = useUser();
  const { settings } = useUserSettings();

  // const { hasShareIntent, shareIntent } = useShareIntentContext();

  const { lightDarkTheme } = useLDTheme();
  const { isLoading } = useUpcomingHelloes();
  const navigation = useNavigation();

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const spinnerStyle = "flow";

  const { themeAheadOfLoading, getThemeAheadOfLoading } = useFriendStyle();

  const { navigateToMomentFocusWithText, navigateToSelectFriend } =
    useAppNavigations();
  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

  const { friendList, friendListFetched } = useFriendList();
  const { selectedFriend, deselectFriend } = useSelectedFriend();
  const { friendDash, loadingDash } = useFriendDash();

  const [showMomentScreenButton, setShowMomentScreenButton] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const newMomentTextRef = useRef(null);

  const userCreatedOn = user?.created_on;
  const isNewUser =
    new Date(userCreatedOn).toDateString() === new Date().toDateString();

  // useEffect(() => {
  //   if (!hasShareIntent || !shareIntent) return;

  //   if (hasShareIntent && shareIntent?.files?.length > 0) {
  //     const file = shareIntent.files[0];
  //     const uri = file?.path || file?.contentUri; // Support both iOS and Android URIs

  //     if (uri) {
  //       processSharedFile(uri);
  //     } else {
  //       console.warn("No valid URI found for the shared file.");
  //     }
  //   }

  //   if (hasShareIntent && shareIntent?.text?.length > 0) {
  //     const sharedText = shareIntent.text.replace(/^["']|["']$/g, "");
  //     if (sharedText) {
  //       navigateToMomentFocusWithText({
  //         screenCameFrom: 0, //goes back to home screen that is now selected friend screen
  //         momentText: sharedText,
  //       });
  //     } else {
  //       showFlashMessage(
  //         `length in shared text but data structure passed here is not valid`,
  //         true,
  //         2000
  //       );
  //     }
  //   }
  // }, [shareIntent, hasShareIntent]);

  // const processSharedFile = async (url) => {
  //   if (url.startsWith("content://") || url.startsWith("file://")) {
  //     try {
  //       const fileInfo = await FileSystem.getInfoAsync(url);

  //       if (fileInfo && fileInfo.exists) {
  //         // Validate that it's an image
  //         if (fileInfo.uri.match(/\.(jpg|jpeg|png|gif)$/)) {
  //           const resizedImage = await resizeImage(fileInfo.uri);
  //           navigation.navigate("AddImage", { imageUri: resizedImage.uri }); // Navigate with resized image URI
  //         } else {
  //           Alert.alert(
  //             "Unsupported File",
  //             "The shared file is not a valid image."
  //           );
  //         }
  //       } else {
  //         Alert.alert("Error", "Could not process the shared file.");
  //       }
  //     } catch (error) {
  //       console.error("Error processing shared file:", error);
  //       Alert.alert(
  //         "Error",
  //         "An error occurred while processing the shared file."
  //       );
  //     }
  //   }
  // };

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
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={
        friendList?.length > 0
          ? lightDarkTheme.primaryBackground
          : lightDarkTheme.overlayBackground
      }
      friendId={selectedFriend?.id}
      includeBackgroundOverlay={true}
      backgroundOverlayHeight={
        isKeyboardVisible ? "100%" : friendList?.length > 0 ? 90 : 66
      }
      backgroundOverlayBottomRadius={0}
      useFriendColors={!!selectedFriend?.id}
      style={{ flex: 1 }}
      // header={HellofriendHeader}
    >
 
      {!friendListFetched && ( // isLoading is in FS Spinner
        <View
          style={{
            zIndex: 100000,
            elevation: 100000,
            position: "absolute",
            backgroundColor: manualGradientColors.lightColor,
            width: "100%",
            height: "100%",
            flex: 1,
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
        >
          <LoadingPage
            loading={true}
            spinnerType="circle"
            spinnerSize={40}
            color={manualGradientColors.homeDarkColor}
          />
        </View>
      )}

      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[{ flex: 1 }]}
        >
          {friendListFetched && ( //&& !isLoading  is in FSSpinner
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
                  width: "100%",
                  backgroundColor: lightDarkTheme.primaryBackground, // keeps this from collapsing in between friend selects
                  height: selectedFriend?.id ? 44 : 'auto',
                  paddingHorizontal: 0,
                  marginTop: 0,
                }}
              >
                
                {selectedFriend?.id && (
                  <TopBarHome
                    loading={loadingDash}
                    style={themeAheadOfLoading}
                    fontStyle={subWelcomeTextStyle}
                    textColor={lightDarkTheme.primaryText}
                    backgroundColor={lightDarkTheme.primaryBackground}
                    onPress={navigateToSelectFriend}
                  />
                )}
              </View>

              {!selectedFriend?.id && (
                <>
                  {friendList?.length < 1 && (
                    <NoFriendsMessageUI
                      backgroundColor={lightDarkTheme.overlayBackground}
                    //  backgroundColor={'transparent'}
                    //  backgroundColor={lightDarkTheme.darkerOverlayBackground}
                      primaryColor={lightDarkTheme.primaryText}
                      welcomeTextStyle={welcomeTextStyle}
                      username={user?.username || ""}
                      userCreatedOn={userCreatedOn || ""}
                    />
                  )}

                  {friendList?.length > 0 && (
                    <>
                      <WelcomeMessageUI
                        primaryColor={lightDarkTheme.primaryText}
                        welcomeTextStyle={welcomeTextStyle}
                        subWelcomeTextStyle={subWelcomeTextStyle}
                        username={user?.username}
                        isNewUser={isNewUser}
                        friendId={selectedFriend?.id}
                        friendName={selectedFriend?.name}
                        themeAheadOfLoading={themeAheadOfLoading}
                        backgroundColor={lightDarkTheme.primaryBackground}
                        borderBottomLeftRadius={0}
                        borderBottomRightRadius={0}
                        // isKeyboardVisible={isKeyboardVisible}
                        onPress={handleFocusPress}
                        isKeyboardVisible={isKeyboardVisible}
                      />

                      <QuickWriteMoment
                        focusMode={settings?.simplify_app_for_focus}
                        primaryColor={lightDarkTheme.primaryText}
                        primaryBackgroundColor={
                          lightDarkTheme.primaryBackground
                        }
                        primaryOverlayColor={lightDarkTheme.overlayBackground}
                        darkerOverlayBackgroundColor={
                          lightDarkTheme.darkerOverlayBackground
                        }
                        width={"100%"}
                        height={"100%"}
                        ref={newMomentTextRef}
                        title={"Add a new moment?"}
                        iconColor={lightDarkTheme.primaryText}
                        mountingText={""}
                        onTextChange={updateNewMomentTextString}
                        multiline={isKeyboardVisible}
                      />
                      <KeyboardCoasters
                        primaryColor={lightDarkTheme.primaryText}
                        isKeyboardVisible={isKeyboardVisible}
                        isFriendSelected={!!selectedFriend?.id}
                        showMomentScreenButton={showMomentScreenButton}
                        onPress={navigateToAddMomentScreen}
                      />
                    </>
                  )}
                </>
              )}
              {!isKeyboardVisible &&
                // && !loadingDash
                friendList?.length > 0 && (  // loadingDash internally spins the components between friend selects
                  <BelowKeyboardComponents
                    userId={user?.id}
               
                    isLoading={isLoading}
                    friendStyle={themeAheadOfLoading}
                    selectedFriendId={selectedFriend?.id}
                    selectedFriendName={selectedFriend?.name}
                    primaryOverlayColor={lightDarkTheme.overlayBackground}
                    primaryColor={lightDarkTheme.primaryText}
                    primaryBackgroundColor={lightDarkTheme.primaryBackground}
                    darkerOverlayBackgroundColor={
                      lightDarkTheme.darkerOverlayBackground
                    }
                    lighterOverlayBackgroundColor={lightDarkTheme.lighterOverlayBackground}
                    spinnerStyle={spinnerStyle}
               
                    friendListLength={friendList?.length || 0}
                    onPress={navigateToAddMomentScreen}
                  />
                )}
            </View>
          )}
        </KeyboardAvoidingView>
      </>
      {!selectedFriend?.id && (
        <HelloFriendFooter
          userId={user?.id}
          username={user?.username}
          settings={settings}
          friendId={selectedFriend?.id}
          friendName={selectedFriend?.name}
          // friendDash={friendDash}
          lightDarkTheme={lightDarkTheme}
          overlayColor={
            friendList?.length > 0
              ? lightDarkTheme.overlayBackground
              : lightDarkTheme.primaryBackground
          }
          dividerStyle={lightDarkTheme.divider}
          deselectFriend={deselectFriend}
        />
      )}

      {selectedFriend?.id && (
        <SelectedFriendFooter
          userId={user?.id}
          username={user?.username}
          settings={settings}
          friendId={selectedFriend?.id}
          friendName={selectedFriend?.name}
        
          lightDarkTheme={lightDarkTheme}
          overlayColor={lightDarkTheme.overlayBackground}
          dividerStyle={lightDarkTheme.divider}
          deselectFriend={deselectFriend}
        />
      )}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHome;
