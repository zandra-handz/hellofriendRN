//import * as Sentry from "@sentry/react-native";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

// app state
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";

import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import useUpNextCache from "@/src/hooks/UpcomingHelloesCalls/useUpNextCache";
import SelectedFriendFooter from "@/app/components/headers/SelectedFriendFooter";
import { useLDTheme } from "@/src/context/LDThemeContext";
import LocalPeacefulGradientSpinner from "@/app/components/appwide/spinner/LocalPeacefulGradientSpinner";
// app utils
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
// import { logQueryCacheSize } from "@/src/utils/logQueryCacheSize";

// app hooks
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

// third party  RESTORE SHARE INTENT WHEN PACKAGE IS UPDATED
import { useShareIntentContext } from "expo-share-intent";
import { File } from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

// import { useFocusEffect } from "@react-navigation/native";

// app components
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import WelcomeMessageUI from "@/app/components/home/WelcomeMessageUI";
import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI";
// import TopBarHome from "@/app/components/home/TopBarHome";
import QuickWriteMoment from "@/app/components/moments/QuickWriteMoment";
import BelowKeyboardComponents from "@/app/components/home/BelowKeyboardComponents";
import KeyboardCoasters from "@/app/components/home/KeyboardCoasters";
import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";
import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
// import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";
// import { QueryClient, useQueryClient } from "@tanstack/react-query";
const ScreenHome = () => {
  const { user } = useUser();
  const { settings } = useUserSettings(); // MUST GO AT TOP OTHERWISE SOMETHING ELSE WILL RERENDER THE SCREEN FIRST AND THIS WILL HAVE OLD VALUES
  //FOR SOME REASON SETTINGS UPDATE DOESN'T GET BATCHED WITH OTHER THINGS RENDERING
  //MAYBE TOO MUCH ON THIS SCREEN TO RENDER???? ???????

  // const { upcomingHelloes  } = useUpcomingHelloes();
  const { friendListAndUpcoming, isLoading, friendListAndUpcomingIsSuccess } =
    useFriendListAndUpcoming();

  const { setUpNextCache } = useUpNextCache({
    userId: user?.id,
    friendListAndUpcoming: friendListAndUpcoming,
  });

  setUpNextCache();
 

// logQueryCacheSize(queryClient);
  const friendList = friendListAndUpcoming?.friends;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;
  // const upcomingId = friendListAndUpcoming?.next?.id;

  // const { friendList, friendListFetched } = useFriendList();
  const { themeAheadOfLoading, getThemeAheadOfLoading, resetTheme } =
    useFriendStyle();

  const { autoSelectFriend } = useAutoSelector();
 
  const { selectedFriend, selectFriend } = useSelectedFriend();

  const { hasShareIntent, shareIntent } = useShareIntentContext();

  const { lightDarkTheme } = useLDTheme();

  const navigation = useNavigation();

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const { navigateToMomentFocusWithText } = useAppNavigations();
  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

  // const [screenReady, setScreenReady] = useState(false);

  // console.error(
  //   "SCREEN RERENDERED",
  //   `lock in custom string ->`,
  //   settings?.lock_in_custom_string,
  //   `----------- lock in next ->`,
  //   settings?.lock_in_next,
  //   "----------- selected friend ->",
  //   selectedFriend?.name,
  //   "----------- auto select ->",
  //   autoSelectId
  // );

  // useEffect(() => {
  //   console.log("AUTO SELECT ID", autoSelectId);
  // }, [autoSelectId]);

  // useEffect(() => {
  //   if (friendListAndUpcoming) {
  //     console.log(
  //       "THSSSSUCCCCHESSSSSSS!! ya bitch",
  //       friendListAndUpcoming.next,
  //       friendListAndUpcoming?.upcoming?.length
  //     );
  //   }
  // }, [friendListAndUpcoming]);

  useEffect(() => {
    console.log('AUTOSELECTING FRIEND')
    // only run if we have an id mismatch
    // console.log("autoselect", autoSelectId);
    if (
      // !selectedFriend?.id &&
      // && !loadingSettings
      autoSelectFriend && !selectedFriend?.id
    ) {
      if (autoSelectFriend.customFriend?.id) {
        selectFriend(autoSelectFriend.customFriend);
        getThemeAheadOfLoading(autoSelectFriend.customFriend);
      } else if (autoSelectFriend.nextFriend?.id) {
        selectFriend(autoSelectFriend.nextFriend);
        getThemeAheadOfLoading(autoSelectFriend.nextFriend);
      }
    }
  }, [autoSelectFriend]);

  const [showMomentScreenButton, setShowMomentScreenButton] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [newMomentText, setNewMomentText] = useState();
  const newMomentTextRef = useRef(null);

  const userCreatedOn = user?.created_on;
  const isNewUser =
    new Date(userCreatedOn).toDateString() === new Date().toDateString();

  const PADDING_HORIZONTAL = 6;

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
        const file = new File(url);

        const fileInfo = await file.info();
        // const fileInfo = await FileSystem.getInfoAsync(url);

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
    // console.log("request permissions!!");
    requestPermission();
  }, []);

  useEffect(() => {
    if (imageUri) {
      navigateToAddImageScreen();
    }
  }, [imageUri]);

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

  const updateNewMomentTextString = (text) => { //just passing in moment text length as a boolean now instead of setting this
    // const textLengthPrev = newMomentText?.length;
    setNewMomentText(text);
    // if (textLengthPrev === 0) {
    //   if (text.length - textLengthPrev > 1) {
    //     setShowMomentScreenButton(true);
    //   }
    // }
    // if (text.length === 0) {
    //   setShowMomentScreenButton(false);
    // }
    // if (text.length === 1) {
    //   setShowMomentScreenButton(true);
    // }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     if (newMomentText?.length > 0) {
  //       console.log("usefocus effect triggered rerender of home screen");
  //       setShowMomentScreenButton(true);
  //     } else {
  //       console.log("usefocus effect triggered rerender of home screen");
  //       setShowMomentScreenButton(false);
  //     }
  //     return () => {};
  //   }, [])
  // );

  const clearNewMomentText = () => {
    setNewMomentText("");
    setShowMomentScreenButton(false);
  };

  const navigateToAddMomentScreen = useCallback(() => {
    if (newMomentText?.length > 0) {
      navigateToMomentFocusWithText({
        screenCameFrom: 0,
        momentText: newMomentText,
      });
      clearNewMomentText();
    }
  }, [newMomentText, navigateToMomentFocusWithText, clearNewMomentText]);

  const navigateToAddImageScreen = useCallback(() => {
    navigation.navigate("AddImage", { imageUri });
  }, [navigation, imageUri]);

const handleFocusPress = () => {
  if (newMomentTextRef && newMomentTextRef.current) {
    newMomentTextRef.current.focus();
  }
};

  return (
    <>
      <LocalPeacefulGradientSpinner
        loading={autoSelectFriend?.customFriend === undefined}
      />
      <SafeViewAndGradientBackground
        friendColorLight={themeAheadOfLoading.lightColor}
        friendColorDark={themeAheadOfLoading.darkColor}
        screenname={`home`}
        backgroundOverlayColor={
          friendList?.length > 0
            ? lightDarkTheme.primaryBackground
            : lightDarkTheme.overlayBackground
        }
        friendId={selectedFriend?.id}
        backgroundOverlayHeight={
          selectedFriend?.id ? "" : isKeyboardVisible ? "100%" : ""
        }
        useSolidOverlay={selectedFriend?.id ? false : !isKeyboardVisible}
        useOverlayFade={true}
        includeBackgroundOverlay={true}
        backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
        backgroundOverlayBottomRadius={0}
        style={{ flex: 1 }}
      >
        {/* {((settings?.lock_in_next === false &&
          settings?.lock_in_custom_string === null) || 
          selectedFriend?.id) && ( */}
        <>
          {!friendListAndUpcomingIsSuccess && ( // isLoading is in FS Spinner
            <View
              style={[
                styles.loadingContainer,
                {
                  backgroundColor: manualGradientColors.lightColor,
                },
              ]}
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
              {friendListAndUpcomingIsSuccess &&
                settings?.id &&
                upcomingHelloes?.length && ( //&& !isLoading  is in FSSpinner
                  <View style={styles.mainContainer}>
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
                              paddingHorizontal={PADDING_HORIZONTAL}
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
                              primaryOverlayColor={
                                lightDarkTheme.overlayBackground
                              }
                              darkerOverlayBackgroundColor={
                                lightDarkTheme.darkerOverlayBackground
                              }
                              width={"100%"}
                              height={"100%"}
                              ref={newMomentTextRef}
                              value={newMomentText}
                              title={"Add a new moment?"}
                              iconColor={lightDarkTheme.primaryText}
                              mountingText={""}
                              onTextChange={updateNewMomentTextString}
                              onPress={navigateToAddMomentScreen}
                              multiline={isKeyboardVisible}
                              isKeyboardVisible={isKeyboardVisible}
                            />
                            <KeyboardCoasters
                              primaryColor={lightDarkTheme.primaryText}
                              isKeyboardVisible={isKeyboardVisible}
                              isFriendSelected={!!selectedFriend?.id}
                              showMomentScreenButton={(!!newMomentText?.length)}
                              onPress={navigateToAddMomentScreen}
                            />
                          </>
                        )}
                      </>
                    )}
                    {!isKeyboardVisible &&
                      // && !loadingDash
                      friendList?.length > 0 && ( // loadingDash internally spins the components between friend selects
                        <BelowKeyboardComponents
                          userId={user?.id}
                          lockInCustomString={settings?.lock_in_custom_string}
                          paddingHorizontal={PADDING_HORIZONTAL}
                          isLoading={isLoading}
                          friendStyle={themeAheadOfLoading}
                          getThemeAheadOfLoading={getThemeAheadOfLoading}
                          friendId={selectedFriend?.id}
                          friendName={selectedFriend?.name}
                          primaryOverlayColor={lightDarkTheme.overlayBackground}
                          primaryColor={lightDarkTheme.primaryText}
                          primaryBackgroundColor={
                            lightDarkTheme.primaryBackground
                          }
                          darkerOverlayBackgroundColor={
                            lightDarkTheme.darkerOverlayBackground
                          }
                          lighterOverlayBackgroundColor={
                            lightDarkTheme.lighterOverlayBackground
                          }
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
            />
          )}

          {selectedFriend?.id && upcomingHelloes?.length && (
            <SelectedFriendFooter
              userId={user?.id}
              friendName={selectedFriend?.name}
              lightDarkTheme={lightDarkTheme}
              overlayColor={lightDarkTheme.overlayBackground}
              resetTheme={resetTheme}
              themeAheadOfLoading={themeAheadOfLoading}
            />
          )}
        </>
        {/* )} */}
      </SafeViewAndGradientBackground>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    zIndex: 100000,
    elevation: 100000,
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
});

export default ScreenHome;
