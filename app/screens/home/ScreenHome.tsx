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
// import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";

// import { useUserSettings } from "@/src/context/UserSettingsContext";
import useUserSettings from "@/src/hooks/useUserSettings";
import useUpNextCache from "@/src/hooks/UpcomingHelloesCalls/useUpNextCache";
import SelectedFriendFooter from "@/app/components/headers/SelectedFriendFooter";
import { useLDTheme } from "@/src/context/LDThemeContext";
import LocalPeacefulGradientSpinner from "@/app/components/appwide/spinner/LocalPeacefulGradientSpinner";
// app utils
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
// import { logQueryCacheSize } from "@/src/utils/logQueryCacheSize";

// app hooks
import useUser from "@/src/hooks/useUser";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

// third party  RESTORE SHARE INTENT WHEN PACKAGE IS UPDATED
import { useShareIntentContext } from "expo-share-intent";
import { File } from "expo-file-system";

// import { useFocusEffect } from "@react-navigation/native";
import { generateGradientColors } from "@/src/hooks/GradientColorsUril";
// app components
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import SafeViewHome from "@/app/components/appwide/format/SafeViewHome";
import WelcomeMessageUI from "@/app/components/home/WelcomeMessageUI";
import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI";
import AllHome from "@/app/components/home/AllHome";
import SelectedFriendHome from "@/app/components/home/SelectedFriendHome";
// import TopBarHome from "@/app/components/home/TopBarHome";
import QuickWriteMoment from "@/app/components/moments/QuickWriteMoment";
import { useCategoryColors } from "@/src/context/CategoryColorsContext";
import KeyboardCoasters from "@/app/components/home/KeyboardCoasters";
import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";
// import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import manualGradientColors from "@/app/styles/StaticColors";
import { AppFontStyles } from "@/app/styles/AppFonts";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
// import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";

// import { generateGradientColorsMap } from "@/src/hooks/GenerateGradientColorsMapUtil";
// import useUpdateDefaultCategory from "@/src/hooks/SelectedFriendCalls/useUpdateDefaultCategory";
// import { QueryClient, useQueryClient } from "@tanstack/react-query";
import useCategories from "@/src/hooks/useCategories";
// import { useCategories } from "@/src/context/CategoriesContext";
import WriteButton from "@/app/components/home/WriteButton";

const ScreenHome = ({ skiaFontLarge, skiaFontSmall }) => {
  const { user } = useUser();
  const { settings } = useUserSettings(); // MUST GO AT TOP OTHERWISE SOMETHING ELSE WILL RERENDER THE SCREEN FIRST AND THIS WILL HAVE OLD VALUES
  //FOR SOME REASON SETTINGS UPDATE DOESN'T GET BATCHED WITH OTHER THINGS RENDERING
  //MAYBE TOO MUCH ON THIS SCREEN TO RENDER???? ???????

  // const { upcomingHelloes  } = useUpcomingHelloes();
  const { navigateToMomentFocus } = useAppNavigations();
  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({ screenCameFrom: 1 });
  }, [navigateToMomentFocus]);

  const { autoSelectFriend } = useAutoSelector();
  const { userCategories } = useCategories({ userId: user?.id });

  const { selectedFriend, setToAutoFriend } = useSelectedFriend();
  const { categoryColors, handleSetCategoryColors } = useCategoryColors();

  const categoryIds = useMemo(
    () => userCategories.map((c) => c.id), // or c.category_id
    [userCategories]
  );

  useEffect(() => {
    if (
      userCategories?.length > 0 &&
      selectedFriend?.lightColor &&
      selectedFriend?.darkColor
    ) {
      const array = generateGradientColors(
        categoryIds,
        selectedFriend.lightColor,
        selectedFriend.darkColor
      );
      handleSetCategoryColors(array);
    }
  }, [categoryIds, selectedFriend]);

  useEffect(() => {
    // does not need friendlist, autoselect friend object has the same data
    // friendist currently getting called async/around the same time but separately
    console.log("AUTOSELECTING FRIEND");

    if (autoSelectFriend?.customFriend !== "pending" && !selectedFriend?.id) {
      if (
        autoSelectFriend.customFriend?.id &&
        autoSelectFriend.customFriend?.id !== -1
      ) {
        setToAutoFriend({
          friend: autoSelectFriend.customFriend,
          preConditionsMet: autoSelectFriend.customFriend !== "pending",
        });
      } else if (
        autoSelectFriend.nextFriend?.id &&
        autoSelectFriend.nextFriend?.id !== -1
      ) {
        setToAutoFriend({
          friend: autoSelectFriend.nextFriend?.id,

          // preConditionsMet: autoSelectFriend.nextFriend !== undefined,
          preConditionsMet: autoSelectFriend.nextFriend !== "pending",
        });
      } else {
        setToAutoFriend({ friend: { id: null }, preConditionsMet: true });
      }
    } else {
      console.log("already set");
    }
  }, [autoSelectFriend]);

  const { friendListAndUpcoming, isLoading, friendListAndUpcomingIsSuccess } =
    useFriendListAndUpcoming({ userId: user?.id });

  const { setUpNextCache } = useUpNextCache({
    userId: user?.id,
    friendListAndUpcoming: friendListAndUpcoming,
  });

  setUpNextCache();

  // logQueryCacheSize(queryClient);
  const friendList = friendListAndUpcoming?.friends;
  const friendListLength = friendList?.length || 0;
  // console.log("friend list", friendListLength);
  const upcomingHelloes = friendListAndUpcoming?.upcoming;

  const { hasShareIntent, shareIntent } = useShareIntentContext();

  const { lightDarkTheme } = useLDTheme();

  const welcomeTextStyle = AppFontStyles.welcomeText;
  // const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

  const { navigateToMomentFocusWithText, navigateToAddImage } =
    useAppNavigations();
  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

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
            navigateToAddImage({ imageUri: resizedImage.uri }); // Navigate with resized image URI
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
    console.log("request permissions!!");
    requestPermission();
  }, []);

  // MAKE SURE THIS WORKS BEFORE DELETING NAV TO ADD IMAGE SCREEN
  useEffect(() => {
    if (imageUri) {
      // navigateToAddImageScreen();
      navigateToAddImage({ imageUri: imageUri });
    }
  }, [imageUri]);

  //   const navigateToAddImageScreen = useCallback(() => {
  //   navigateToAddImage({ imageUri });
  // }, [navigation, imageUri]);

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
    //just passing in moment text length as a boolean now instead of setting this
    // const textLengthPrev = newMomentText?.length;
    setNewMomentText(text);
  };

  const clearNewMomentText = () => {
    setNewMomentText(""); 
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

  const handleFocusPress = () => {
    if (newMomentTextRef && newMomentTextRef.current) {
      newMomentTextRef.current.focus();
    }
  };

  const themeColors = useMemo(
    () => ({
      lightColor: selectedFriend?.lightColor,
      darkColor: selectedFriend?.darkColor,
      fontColorSecondary: selectedFriend?.fontColorSecondary,
    }),
    [
      selectedFriend?.lightColor,
      selectedFriend?.darkColor,
      selectedFriend?.fontColorSecondary,
    ]
  );

  return (
    <>
      <LocalPeacefulGradientSpinner
        loading={
          autoSelectFriend?.nextFriend === "pending" ||
          autoSelectFriend?.customFriend === "pending" ||
          !selectedFriend?.isReady ||
          !friendListAndUpcomingIsSuccess
        }
      />

      {autoSelectFriend?.customFriend !== "pending" &&
        autoSelectFriend?.nextFriend !== "pending" &&
        selectedFriend?.isReady &&
        friendListAndUpcomingIsSuccess && (
          <SafeViewHome
            friendColorLight={selectedFriend.lightColor}
            friendColorDark={selectedFriend.darkColor}
            backgroundOverlayColor={
              friendListLength > 0
                ? lightDarkTheme.primaryBackground
                : lightDarkTheme.overlayBackground
            }
            friendId={selectedFriend?.id}
            backgroundOverlayHeight={
              selectedFriend?.id ? "" : isKeyboardVisible ? "100%" : ""
            }
            useSolidOverlay={selectedFriend?.id ? false : !isKeyboardVisible}
            backgroundTransparentOverlayColor={lightDarkTheme.overlayBackground}
            backgroundOverlayBottomRadius={0}
          >
            <>
              <>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={[{ flex: 1 }]}
                >
                  {
                    // friendListAndUpcomingIsSuccess &&
                    settings?.id &&
                      upcomingHelloes?.length &&
                      user?.id && ( //&& !isLoading  is in FSSpinner
                        <View style={styles.mainContainer}>
                          {!selectedFriend?.id && (
                            <>
                              {friendListLength < 1 && (
                                <NoFriendsMessageUI
                                  backgroundColor={
                                    lightDarkTheme.overlayBackground
                                  }
                                  primaryColor={lightDarkTheme.primaryText}
                                  welcomeTextStyle={welcomeTextStyle}
                                  username={user?.username || ""}
                                  userCreatedOn={userCreatedOn || ""}
                                />
                              )}

                              {friendListLength > 0 && (
                                <>
                                  <WelcomeMessageUI
                                    userId={user?.id}
                                    darkerGlassBackground={
                                      lightDarkTheme.darkerGlassBackground
                                    }
                                    paddingHorizontal={PADDING_HORIZONTAL}
                                    primaryColor={lightDarkTheme.primaryText}
                                    primaryBackground={
                                      lightDarkTheme.primaryBackground
                                    }
                                    username={user?.username}
                                    isNewUser={isNewUser}
                                    friendId={selectedFriend?.id}
                                    friendName={selectedFriend?.name}
                                    themeColors={themeColors}
                                    backgroundColor={
                                      lightDarkTheme.primaryBackground
                                    }
                                    borderBottomLeftRadius={0}
                                    borderBottomRightRadius={0} 
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
                                    showMomentScreenButton={
                                      !!newMomentText?.length
                                    }
                                    onPress={navigateToAddMomentScreen}
                                  />
                                </>
                              )}
                            </>
                          )}

                          {!isKeyboardVisible &&
                            !selectedFriend?.id &&
                            friendListLength > 0 && ( // loadingDash internally spins the components between friend selects
                              <View style={styles.allHomeWrapper}>
                                <View
                                  style={{
                                    height: "100%",
                                    paddingHorizontal: PADDING_HORIZONTAL,
                                  }}
                                >
                                  <AllHome
                                    userId={user?.id}
                                    friendId={selectedFriend?.id}
                                    lockInCustomString={
                                      settings?.lock_in_custom_string
                                    }
                                    lighterOverlayColor={
                                      lightDarkTheme.lighterOverlayBackground
                                    }
                                    darkerOverlayColor={
                                      lightDarkTheme.darkerOverlayBackground
                                    }
                                    isLoading={isLoading}
                                    onPress={navigateToAddMomentScreen}
                                    borderRadius={10}
                                    height={"100%"}
                                    primaryColor={lightDarkTheme.primaryText}
                                    overlayColor={
                                      lightDarkTheme.overlayBackground
                                    }
                                    primaryBackground={
                                      lightDarkTheme?.primaryBackground
                                    }
                                  />
                                </View>
                              </View>
                            )}

                          {selectedFriend?.id && (
                            <SelectedFriendHome
                              primaryBackground={
                                lightDarkTheme.primaryBackground
                              }
                              darkGlassBackground={
                                lightDarkTheme.darkGlassBackground
                              }
                              darkerGlassBackground={
                                lightDarkTheme.darkerGlassBackground
                              }
                              categoryColorsArray={categoryColors}
                              skiaFontLarge={skiaFontLarge}
                              skiaFontSmall={skiaFontSmall}
                              paddingHorizontal={PADDING_HORIZONTAL}
                              userId={user?.id}
                              primaryColor={lightDarkTheme.primaryText}
                              primaryOverlayColor={
                                lightDarkTheme.overlayBackground
                              }
                              themeColors={themeColors}
                              selectedFriendId={selectedFriend?.id}
                              selectedFriendName={selectedFriend?.name}
                            />
                          )}
                        </View>
                      )
                  }
                </KeyboardAvoidingView>
                {selectedFriend?.id && (
                  <WriteButton
                    onPress={handleNavigateToCreateNew}
                    backgroundColor={manualGradientColors.lightColor}
                    iconColor={manualGradientColors.homeDarkColor}
                    spaceFromBottom={98}
                  />
                )}
              </>
              {!selectedFriend?.id && (
                <HelloFriendFooter
                  userId={user?.id}
                  username={user?.username}
                  settings={settings}
                  friendId={selectedFriend?.id}
                  friendName={selectedFriend?.name}
                  themeColors={themeColors} 
                  lightDarkTheme={lightDarkTheme}
                  friendListLength={friendListLength}
                  overlayColor={
                    friendListLength > 0
                      ? lightDarkTheme.overlayBackground
                      : lightDarkTheme.primaryBackground
                  }
                />
              )}

              {selectedFriend?.id && upcomingHelloes?.length && (
                <SelectedFriendFooter
                  userId={user?.id}
                  friendName={selectedFriend?.name}
                  lightDarkTheme={lightDarkTheme}
                  overlayColor={lightDarkTheme.overlayBackground}
                  themeColors={themeColors}
                />
              )}
            </>
          </SafeViewHome>
        )}
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
  allHomeWrapper: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
});

export default ScreenHome;
