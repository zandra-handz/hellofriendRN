//import * as Sentry from "@sentry/react-native";
import React, {
  useEffect,
  useLayoutEffect,
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
} from "react-native";

// app state
import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
//import { useFriendDash } from "@/src/context/FriendDashContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import useSelectFriend from "@/src/hooks/useSelectFriend";
import useDeselectFriend from "@/src/hooks/useDeselectFriend";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import useUpdateSettings from "@/src/hooks/SettingsCalls/useUpdateSettings";
import SelectedFriendFooter from "@/app/components/headers/SelectedFriendFooter";
import { useLDTheme } from "@/src/context/LDThemeContext";
import LocalPeacefulGradientSpinner from "@/app/components/appwide/spinner/LocalPeacefulGradientSpinner";
// app utils
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

// app hooks
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

// third party  RESTORE SHARE INTENT WHEN PACKAGE IS UPDATED
import { useShareIntentContext } from "expo-share-intent";
import * as FileSystem from "expo-file-system";
import { File, Directory, Paths } from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

import { useFocusEffect } from "@react-navigation/native";

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
import manualGradientColors from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";
 
const ScreenHome = () => {
  const { user } = useUser();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { friendList, friendListFetched, loadingFriendList } = useFriendList();
  const { themeAheadOfLoading, getThemeAheadOfLoading, resetTheme } =
    useFriendStyle();

  const { updateSettings } = useUpdateSettings({ userId: user?.id });
 
  const { selectedFriend, selectFriend } = useSelectedFriend();
  const { handleSelectFriend } = useSelectFriend({
    friendList,
    resetTheme,
    getThemeAheadOfLoading,
    selectFriend,
  });

  const { settings } = useUserSettings();

  // const upcomingId = useMemo(() => {
  //   if (!upcomingHelloes?.[0]) {
  //     return;
  //   }
  //   return upcomingHelloes[0].friend.id;
  // }, [upcomingHelloes]);

  const lockInCustom = useMemo(
    () => settings?.lock_in_custom_string ?? null,
    [settings]
  );

  const { hasShareIntent, shareIntent } = useShareIntentContext();

  const { lightDarkTheme } = useLDTheme();

  const navigation = useNavigation();

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
 

  const { navigateToMomentFocusWithText, navigateToSelectFriend } =
    useAppNavigations();
  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

 

const [screenReady, setScreenReady] = useState(false);


useEffect(() => {
  console.log('SETTINGS TRIGGERED A USEEFFECT IN SCREENHOME', settings?.lock_in_next);

}, [settings]);
useEffect(() => { 
  console.log('useEffect runs!');
  if (!friendListFetched || !settings?.id || !upcomingHelloes?.length) return;

  if (selectedFriend?.id) {
    setScreenReady(true);
    return;
  }

  // calculate lockedFriendId here instead of useMemo
  let lockedFriendId = null;
  if (settings?.lock_in_custom_string) {
    lockedFriendId = Number(settings.lock_in_custom_string);
  } else if (settings?.lock_in_next) {
    lockedFriendId = upcomingHelloes[0]?.friend?.id ?? null;
  }

  if (lockedFriendId) {
    console.log('SELECTING FRIEND:', lockedFriendId);
    handleSelectFriend(lockedFriendId);
  } else {
    setScreenReady(true);
  }
}, [
  friendListFetched,
  settings,
  upcomingHelloes,
  selectedFriend,
  handleSelectFriend,
]);

  const { handleDeselectFriend } = useDeselectFriend({
    resetTheme,
    selectFriend,
    updateSettings,
    lockIns,
  });

  const [showMomentScreenButton, setShowMomentScreenButton] = useState(false);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [newMomentText, setNewMomentText] = useState();
  const newMomentTextRef = useRef(null);

  const userCreatedOn = user?.created_on;
  const isNewUser =
    new Date(userCreatedOn).toDateString() === new Date().toDateString();

  const PADDING_HORIZONTAL = 6;


      const lockIns = useMemo(() => ({
      next: settings?.lock_in_next ?? null,
      customString: settings?.lock_in_custom_string ?? null,
    }), [settings]);
  

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
    console.log(text);

    const textLengthPrev = newMomentText?.length;
    setNewMomentText(text);
    if (textLengthPrev === 0) {
      if (text.length - textLengthPrev > 1) {
        setShowMomentScreenButton(true);
      }
    }
    if (text.length === 0) {
      setShowMomentScreenButton(false);
    }
    if (text.length === 1) {
      setShowMomentScreenButton(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (newMomentText?.length > 0) {
        setShowMomentScreenButton(true);
      } else {
        setShowMomentScreenButton(false);
      }
      return () => {};
    }, [])
  );

  const clearNewMomentText = () => {
    setNewMomentText("");
    setShowMomentScreenButton(false);
  };

  const navigateToAddMomentScreen = () => {
    if (newMomentText?.length > 0) {
      navigateToMomentFocusWithText({
        screenCameFrom: 0, //goes back to home screen that is now selected friend screen
        momentText: newMomentText,
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
    <>
      <LocalPeacefulGradientSpinner loading={!screenReady} />

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
        {((settings?.lock_in_next === false &&
          settings?.lock_in_custom_string === null) ||
          // (settings?.lock_in_next === true &&
          //   settings?.lock_in_custom_string === null) ||
          selectedFriend?.id) && (
          <>
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
                {friendListFetched &&
                  settings?.id &&
                  upcomingHelloes?.length && ( //&& !isLoading  is in FSSpinner
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "space-between",
                        flexDirection: "column",
                        paddingHorizontal: 0,
                      }}
                    >
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
                                backgroundColor={
                                  lightDarkTheme.primaryBackground
                                }
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
                                showMomentScreenButton={showMomentScreenButton}
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
                            friendId={selectedFriend?.id}
                            friendName={selectedFriend?.name}
                            primaryOverlayColor={
                              lightDarkTheme.overlayBackground
                            }
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

            {selectedFriend?.id && (
              <SelectedFriendFooter
                userId={user?.id}
                upNextId={upcomingHelloes[0]?.friend?.id}
                username={user?.username}
                settings={settings}
                lockedInNext={settings?.lock_in_next}
                friendId={selectedFriend?.id}
                friendName={selectedFriend?.name}
                lightDarkTheme={lightDarkTheme}
                overlayColor={lightDarkTheme.overlayBackground}
                dividerStyle={lightDarkTheme.divider}
                handleDeselectFriend={handleDeselectFriend}
              />
            )}
          </>
        )}
      </SafeViewAndGradientBackground>
    </>
  );
};

export default ScreenHome;
