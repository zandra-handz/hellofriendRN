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
import { useFriendDash } from "@/src/context/FriendDashContext";
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
import { useCategories } from "@/src/context/CategoriesContext";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
import QuickWriteMoment from "@/app/components/moments/QuickWriteMoment";
import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";
import { useLDTheme } from "@/src/context/LDThemeContext";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";

import * as FileSystem from "expo-file-system";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import useFontStyles from "@/src/hooks/StylesCalls/useFontStyles"; 
const ScreenHome = () => {
  const { hasShareIntent, shareIntent } = useShareIntentContext();
  const { userCategories } = useCategories();

  const { lightDarkTheme } = useLDTheme();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const navigation = useNavigation();
  const {
 
    appFontStyles,
    manualGradientColors,
  
  } = useGlobalStyle();


 
const { fontStyles } = useFontStyles(appFontStyles);

  const welcomeTextStyle = appFontStyles.welcomeText;
  const subWelcomeTextStyle = appFontStyles.subWelcomeText;
 

 
 

  const spinnerStyle = 'flow';

  const { themeAheadOfLoading, getThemeAheadOfLoading } = useFriendStyle();

  const appColorsStyle = manualGradientColors;
  const themeAheadOfLoadingStyle = themeAheadOfLoading;

  const { navigateToMomentFocusWithText, navigateToSelectFriend } =
    useAppNavigations();
  const { user } = useUser();

  const { friendDash, loadingDash } = useFriendDash();
  const { selectedFriend } = useSelectedFriend();
  const friendId = selectedFriend?.id;
  const friendName = selectedFriend?.name;
  const userId = user?.id;
  const username = user?.username;
  const userCreatedOn = user?.created_on;

  const { friendList, friendListFetched } = useFriendList();
  const [showMomentScreenButton, setShowMomentScreenButton] = useState(false);

  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const newMomentTextRef = useRef(null);

  const isNewUser =
    new Date(userCreatedOn).toDateString() === new Date().toDateString();

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
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={themeAheadOfLoading.lightColor}
      friendColorDark={themeAheadOfLoading.darkColor}
      backgroundOverlayColor={
        friendList?.length > 0
          ? lightDarkTheme.primaryBackground 
          : lightDarkTheme.overlayBackground
      }
      friendId={friendId}
      includeBackgroundOverlay={true}
      backgroundOverlayHeight={
        isKeyboardVisible ? "100%" : friendList?.length > 0 ? 90 : 66
      }
      backgroundOverlayBottomRadius={0}
      useFriendColors={friendId ? true : false}
      style={{ flex: 1 }}
      // header={HellofriendHeader}
    >
      {!friendListFetched && ( // isLoading is in FS Spinner
        <View
          style={{
            zIndex: 100000,
            elevation: 100000,
            position: "absolute",
            backgroundColor: "pink",
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
                style={{ width: "100%", paddingHorizontal: 0, marginTop: 0 }}
              >
                {friendId && (
                  <TopBarHome
                    loading={loadingDash}
                    style={themeAheadOfLoadingStyle}
                  
                    fontStyle={fontStyles?.welcome}
                    textColor={lightDarkTheme.primaryText} 
                    backgroundColor={lightDarkTheme.primaryBackground}
                    onPress={navigateToSelectFriend}
                  />
                )}
              </View>

              {!friendId && (
                <>
                  {friendList?.length < 1 && (
                    <NoFriendsMessageUI
                      manualGradientColors={manualGradientColors}
                      backgroundColor={lightDarkTheme.primaryBackgroundColor}
                      backgroundColor={lightDarkTheme.primaryOverlayColor}
                      primaryColor={lightDarkTheme.primaryText}
                   
                      welcomeTextStyle={welcomeTextStyle}
                      username={username || ""}
                      userCreatedOn={userCreatedOn || ""}
                    />
                  )}

                  {friendList?.length > 0 && (
                    <>
                      <WelcomeMessageUI
                        primaryColor={lightDarkTheme.primaryText}
                        welcomeTextStyle={welcomeTextStyle}
                        subWelcomeTextStyle={subWelcomeTextStyle}
                        username={username}
                        isNewUser={isNewUser}
                        backgroundColor={lightDarkTheme.primaryBackground
                        }
                        borderBottomLeftRadius={0}
                        borderBottomRightRadius={0}
                        // isKeyboardVisible={isKeyboardVisible}
                        onPress={handleFocusPress}
                        isKeyboardVisible={isKeyboardVisible}
                      />

                      <QuickWriteMoment 
                        primaryColor={lightDarkTheme.primaryText}
                        primaryBackgroundColor={lightDarkTheme.primaryBackground}
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
                      manualGradientColors={manualGradientColors}
                      primaryColor={lightDarkTheme.primaryText}
                        isKeyboardVisible={isKeyboardVisible}
                        isFriendSelected={friendId}
                        showMomentScreenButton={showMomentScreenButton}
                        onPress={navigateToAddMomentScreen}
                      />
                    </>
                  )}
                </>
              )}
              {!isKeyboardVisible && !loadingDash && friendList.length > 0 && (
                <BelowKeyboardComponents
                userId={userId}
                  userCategories={userCategories}
                  upcomingHelloes={upcomingHelloes}
                  isLoading={isLoading}
                  getThemeAheadOfLoading={getThemeAheadOfLoading}
                  friendList={friendList}
                  manualGradientColors={manualGradientColors}
                  appColorsStyle={appColorsStyle}
                  friendStyle={themeAheadOfLoadingStyle}
                  selectedFriendId={friendId}
                  selectedFriendName={friendName}
                  primaryOverlayColor={lightDarkTheme.overlayBackground}
                  primaryColor={lightDarkTheme.primaryText}
                  welcomeTextStyle={welcomeTextStyle}
                  subWelcomeTextStyle={subWelcomeTextStyle}
                  primaryBackgroundColor={lightDarkTheme.primaryBackground}
                  darkerOverlayBackgroundColor={lightDarkTheme.darkerOverlayBackground}
                  spinnerStyle={spinnerStyle}
                  slideAnim={slideAnim}
                  friendListLength={friendList?.length || 0}
                  isFriendSelected={!!friendId}
                  onPress={navigateToAddMomentScreen}
                  loadingDash={loadingDash}
                  friendDash={friendDash}
                />
              )}
            </View>
          )}
        </KeyboardAvoidingView>
      </>

      <HelloFriendFooter
        userCategories={userCategories}
        manualGradientColors={manualGradientColors}
        lightDarkTheme={lightDarkTheme}
        themeAheadOfLoading={themeAheadOfLoading}
        overlayColor={
          friendList?.length > 0
            ? lightDarkTheme.overlayBackground
            : lightDarkTheme.primaryBackground
        }
        textColor={lightDarkTheme.primaryText}
        dividerStyle={lightDarkTheme.divider}
        userId={userId}
        friendId={friendId}
        friendName={friendName}
        friendDash={friendDash}
      />
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHome;
