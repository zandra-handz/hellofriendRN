// //import * as Sentry from "@sentry/react-native";
// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import {
//   View,
//   Alert,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
// } from "react-native";

// import { useRoute } from "@react-navigation/native";
// import { useIsFocused } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import LocalSolidSpinner from "@/app/components/appwide/spinner/LocalSolidSpinner";
// // app state
// // import { useUser } from "@/src/context/UserContext";
// import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
// import { useAutoSelector } from "@/src/context/AutoSelectorContext";
// // import { useUserSettings } from "@/src/context/UserSettingsContext";
// import useUserSettings from "@/src/hooks/useUserSettings";
// import useUpNextCache from "@/src/hooks/UpcomingHelloesCalls/useUpNextCache";
// import { useLDTheme } from "@/src/context/LDThemeContext";
// import LocalPeacefulGradientSpinner from "@/app/components/appwide/spinner/LocalPeacefulGradientSpinner";
// // app utils
// import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
// // import { logQueryCacheSize } from "@/src/utils/logQueryCacheSize";

// // app hooks
// import useUser from "@/src/hooks/useUser";
// import useAppNavigations from "@/src/hooks/useAppNavigations";
// import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

// // third party  RESTORE SHARE INTENT WHEN PACKAGE IS UPDATED
// import { useShareIntentContext } from "expo-share-intent";
// import { File } from "expo-file-system";

// // app components
// import SafeViewHome from "@/app/components/appwide/format/SafeViewHome";
// import WelcomeMessageUI from "@/app/components/home/WelcomeMessageUI";
// import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI";
// import AllHome from "@/app/components/home/AllHome";
// import QuickWriteMoment from "@/app/components/moments/QuickWriteMoment";
// import KeyboardCoasters from "@/app/components/home/KeyboardCoasters";
// import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";

// import { AppFontStyles } from "@/app/styles/AppFonts";
// import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";

// const ScreenHome = ({ skiaFontLarge, skiaFontSmall }) => {
//   const { user } = useUser();
//   const { settings } = useUserSettings(); // MUST GO AT TOP OTHERWISE SOMETHING ELSE WILL RERENDER THE SCREEN FIRST AND THIS WILL HAVE OLD VALUES
//   //FOR SOME REASON SETTINGS UPDATE DOESN'T GET BATCHED WITH OTHER THINGS RENDERING
//   //MAYBE TOO MUCH ON THIS SCREEN TO RENDER???? ???????
//   // const route = useRoute();
//   // const { upcomingHelloes  } = useUpcomingHelloes();
//   const { navigateToFriendHome } = useAppNavigations();
//   const isFocused = useIsFocused();

//   const { autoSelectFriend } = useAutoSelector();

//   const { selectedFriend } = useSelectedFriend();

//   console.log(
//     "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~HOMES SCREEN RERENDERED",
//   );

//   const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } =
//     useFriendListAndUpcoming({ userId: user.id });

//   const { setUpNextCache } = useUpNextCache({
//     userId: user.id,
//     friendListAndUpcoming: friendListAndUpcoming,
//   });
//   // if WEIRD BUGS AFTER 2/22 CHECK THIS
//   // BAD - runs on every render
//   // setUpNextCache();

//   // GOOD - move to useEffect
//   // useEffect(() => {
//   //   setUpNextCache();
//   // }, [friendListAndUpcoming]);

//   // Skip cache update when not focused
//   useEffect(() => {
//     if (!isFocused) return;
//     setUpNextCache();
//   }, [friendListAndUpcoming, isFocused]);

//   const isLoading =
//     autoSelectFriend?.nextFriend === "pending" ||
//     autoSelectFriend?.customFriend === "pending" ||
//     !selectedFriend?.isReady ||
//     !friendListAndUpcomingIsSuccess;

//   // Navigate to friend screen when loading finishes AND friend is selected
//   // useEffect(() => {
//   //   if (!isLoading && selectedFriend?.id) {

//   //     navigateToFriendHome();
//   //   }
//   // }, [isLoading, selectedFriend?.id]);

//   // Skip navigation when not focused
//   useEffect(() => {
//     if (!isFocused) return;
//     if (!isLoading && selectedFriend?.id) {
//       navigateToFriendHome();
//     }
//   }, [isLoading, selectedFriend?.id, isFocused]);

//   // logQueryCacheSize(queryClient);
//   const friendList = friendListAndUpcoming?.friends;
//   const friendListLength = friendList?.length || 0;
//   // console.log("friend list", friendListLength);
//   const upcomingHelloes = friendListAndUpcoming?.upcoming;

//   const { hasShareIntent, shareIntent } = useShareIntentContext();

//   const { lightDarkTheme } = useLDTheme();

//   const welcomeTextStyle = AppFontStyles.welcomeText;
//   // const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

//   const { navigateToMomentFocusWithText, navigateToAddImage } =
//     useAppNavigations();
//   const { requestPermission, imageUri, resizeImage } =
//     useImageUploadFunctions();

//   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
//   const [newMomentText, setNewMomentText] = useState();
//   const newMomentTextRef = useRef(null);

//   const userCreatedOn = user.created_on;
//   const isNewUser =
//     new Date(userCreatedOn).toDateString() === new Date().toDateString();

//   const PADDING_HORIZONTAL = 6;

//   console.log(selectedFriend);

//   useEffect(() => {
//     if (!hasShareIntent || !shareIntent) return;

//     if (hasShareIntent && shareIntent?.files?.length > 0) {
//       const file = shareIntent.files[0];
//       const uri = file?.path || file?.contentUri; // Support both iOS and Android URIs

//       if (uri) {
//         processSharedFile(uri);
//       } else {
//         console.warn("No valid URI found for the shared file.");
//       }
//     }

//     if (hasShareIntent && shareIntent?.text?.length > 0) {
//       const sharedText = shareIntent.text.replace(/^["']|["']$/g, "");
//       if (sharedText) {
//         navigateToMomentFocusWithText({
//           screenCameFrom: 0, //goes back to home screen that is now selected friend screen
//           momentText: sharedText,
//         });
//       } else {
//         showFlashMessage(
//           `length in shared text but data structure passed here is not valid`,
//           true,
//           2000,
//         );
//       }
//     }
//   }, [shareIntent, hasShareIntent]);

//   const processSharedFile = async (url) => {
//     if (url.startsWith("content://") || url.startsWith("file://")) {
//       try {
//         const file = new File(url);

//         const fileInfo = await file.info();
//         // const fileInfo = await FileSystem.getInfoAsync(url);

//         if (fileInfo && fileInfo.exists) {
//           // Validate that it's an image
//           if (fileInfo.uri.match(/\.(jpg|jpeg|png|gif)$/)) {
//             const resizedImage = await resizeImage(fileInfo.uri);
//             navigateToAddImage({ imageUri: resizedImage.uri }); // Navigate with resized image URI
//           } else {
//             Alert.alert(
//               "Unsupported File",
//               "The shared file is not a valid image.",
//             );
//           }
//         } else {
//           Alert.alert("Error", "Could not process the shared file.");
//         }
//       } catch (error) {
//         console.error("Error processing shared file:", error);
//         Alert.alert(
//           "Error",
//           "An error occurred while processing the shared file.",
//         );
//       }
//     }
//   };

//   useEffect(() => {
//     console.log("request permissions!!");
//     requestPermission();
//   }, []);

//   // MAKE SURE THIS WORKS BEFORE DELETING NAV TO ADD IMAGE SCREEN
//   useEffect(() => {
//     if (imageUri) {
//       // navigateToAddImageScreen();
//       navigateToAddImage({ imageUri: imageUri });
//     }
//   }, [imageUri]);

//   //   const navigateToAddImageScreen = useCallback(() => {
//   //   navigateToAddImage({ imageUri });
//   // }, [navigation, imageUri]);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       "keyboardDidShow",
//       () => setIsKeyboardVisible(true),
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       "keyboardDidHide",
//       () => setIsKeyboardVisible(false),
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const updateNewMomentTextString = (text) => {
//     //just passing in moment text length as a boolean now instead of setting this
//     // const textLengthPrev = newMomentText?.length;
//     setNewMomentText(text);
//   };

//   const clearNewMomentText = () => {
//     setNewMomentText("");
//   };

//   const navigateToAddMomentScreen = useCallback(() => {
//     if (newMomentText?.length > 0) {
//       navigateToMomentFocusWithText({
//         screenCameFrom: 0,
//         triggerReverseBackdrop: true,
//         momentText: newMomentText,
//       });
//       clearNewMomentText();
//     }
//   }, [newMomentText, navigateToMomentFocusWithText, clearNewMomentText]);

//   const handleFocusPress = () => {
//     if (newMomentTextRef && newMomentTextRef.current) {
//       newMomentTextRef.current.focus();
//     }
//   };

//   return (
//     <>
//       <LocalSolidSpinner
//       backgroundColor={'hotpink'}
//         loading={
//           autoSelectFriend?.nextFriend === "pending" ||
//           autoSelectFriend?.customFriend === "pending" ||
//           !selectedFriend?.isReady ||
//           !friendListAndUpcomingIsSuccess
//         }
//       />

//       {autoSelectFriend?.customFriend !== "pending" &&
//         autoSelectFriend?.nextFriend !== "pending" &&
//         selectedFriend?.isReady &&
//         friendListAndUpcomingIsSuccess && (
//           <SafeAreaView
//             style={{
//               flex: 1,
//               backgroundColor: lightDarkTheme.primaryBackground
//             }}
//           >
//             {settings?.id  && friendListLength < 1 && (
//               <View
//                style={styles.noFriendsView}>

//                 <NoFriendsMessageUI
//                   backgroundColor={lightDarkTheme.overlayBackground}
//                   primaryColor={lightDarkTheme.primaryText}
//                   welcomeTextStyle={welcomeTextStyle}
//                   username={user.username || ""}
//                   userCreatedOn={userCreatedOn || ""}
//                 />
//                          </View>
//             )}
//             <>
//               <>
//                 <KeyboardAvoidingView
//                   behavior={Platform.OS === "ios" ? "padding" : "height"}
//                   style={[{ flex: 1 }]}
//                 >
//                   {settings?.id &&
//                     //  upcomingHelloes?.length &&
//                  //   user?.id &&
//                     ( //&& !isLoading  is in FSSpinner
//                       <View style={styles.mainContainer}>
//                         {!selectedFriend?.id && (
//                           <>
//                             {friendListLength > 0 && (
//                               <>
//                                 <View style={styles.mainActionsWrapper}>
//                                   <WelcomeMessageUI
//                                     userId={user.id}
//                                     darkerGlassBackground={
//                                       lightDarkTheme.darkerGlassBackground
//                                     }
//                                     paddingHorizontal={PADDING_HORIZONTAL}
//                                     primaryColor={lightDarkTheme.primaryText}
//                                     primaryBackground={
//                                       lightDarkTheme.primaryBackground
//                                     }
//                                     username={user.username}
//                                     isNewUser={isNewUser}
//                                     friendId={selectedFriend?.id}
//                                     friendName={selectedFriend?.name}
//                                     backgroundColor={
//                                       lightDarkTheme.primaryBackground
//                                     }
//                                     borderBottomLeftRadius={0}
//                                     borderBottomRightRadius={0}
//                                     onPress={handleFocusPress}
//                                     isKeyboardVisible={isKeyboardVisible}
//                                   />
//                                 </View>

//                                 <QuickWriteMoment
//                                   focusMode={settings?.simplify_app_for_focus}
//                                   primaryColor={lightDarkTheme.primaryText}
//                                   primaryBackgroundColor={
//                                     lightDarkTheme.primaryBackground
//                                   }
//                                   primaryOverlayColor={
//                                     lightDarkTheme.overlayBackground
//                                   }
//                                   darkerOverlayBackgroundColor={
//                                     lightDarkTheme.darkerOverlayBackground
//                                   }
//                                   width={"100%"}
//                                   height={"100%"}
//                                   ref={newMomentTextRef}
//                                   value={newMomentText}
//                                   title={"Add a new moment?"}
//                                   iconColor={lightDarkTheme.primaryText}
//                                   mountingText={""}
//                                   onTextChange={updateNewMomentTextString}
//                                   onPress={navigateToAddMomentScreen}
//                                   multiline={isKeyboardVisible}
//                                   isKeyboardVisible={isKeyboardVisible}
//                                 />
//                                 <KeyboardCoasters
//                                   primaryColor={lightDarkTheme.primaryText}
//                                   isKeyboardVisible={isKeyboardVisible}
//                                   isFriendSelected={!!selectedFriend?.id}
//                                   showMomentScreenButton={
//                                     !!newMomentText?.length
//                                   }
//                                   onPress={navigateToAddMomentScreen}
//                                 />
//                               </>
//                             )}
//                           </>
//                         )}

//                         {!isKeyboardVisible &&
//                           friendListLength > 0 && ( // loadingDash internally spins the components between friend selects
//                             <View style={styles.allHomeWrapper}>
//                               <View
//                                 style={{
//                                   height: "100%",
//                                   paddingHorizontal: PADDING_HORIZONTAL,
//                                 }}
//                               >
//                                 {!selectedFriend?.id && (
//                                   <AllHome
//                                     userId={user.id}
//                                     friendId={selectedFriend?.id}
//                                     lockInCustomString={
//                                       settings?.lock_in_custom_string
//                                     }
//                                     lighterOverlayColor={
//                                       lightDarkTheme.lighterOverlayBackground
//                                     }
//                                     darkerOverlayColor={
//                                       lightDarkTheme.darkerOverlayBackground
//                                     }
//                                     isLoading={isLoading}
//                                     navigateToFriendHome={navigateToFriendHome}
//                                     borderRadius={10}
//                                     height={"100%"}
//                                     textColor={lightDarkTheme.primaryText}
//                                     overlayColor={
//                                       lightDarkTheme.overlayBackground
//                                     }
//                                     primaryBackground={
//                                       lightDarkTheme?.primaryBackground
//                                     }
//                                   />
//                                 )}
//                               </View>
//                             </View>
//                           )}
//                       </View>
//                     )}
//                 </KeyboardAvoidingView>
//               </>

//               <HelloFriendFooter
//                 userId={user.id}
//                 username={user.username}
//                 settings={settings}
//                 friendId={selectedFriend?.id}
//                 friendName={selectedFriend?.name}
//                 lightDarkTheme={lightDarkTheme}
//                 overlayColor={
//                   friendListLength > 0
//                     ? lightDarkTheme.overlayBackground
//                     : lightDarkTheme.primaryBackground
//                 }
//               />
//             </>
//           </SafeAreaView>
//         )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     zIndex: 100000,
//     elevation: 100000,
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     flex: 1,
//     top: 0,
//     bottom: 0,
//     right: 0,
//     left: 0,
//   },
//   mainActionsWrapper: {
//     // backgroundColor: 'pink',
//   },
//   noFriendsView: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     flex: 1,
//     paddingBottom: 60

//   },
//   mainContainer: {
//     flex: 1,
//     justifyContent: "space-between",
//     flexDirection: "column",
//   },
//   allHomeWrapper: {
//     alignItems: "center",
//     flex: 1,
//     width: "100%",
//   },
// });

// export default ScreenHome;

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

import { useRoute } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import LocalSolidSpinner from "@/app/components/appwide/spinner/LocalSolidSpinner";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";
import useUserSettings from "@/src/hooks/useUserSettings";
import useUpNextCache from "@/src/hooks/UpcomingHelloesCalls/useUpNextCache";
import { useLDTheme } from "@/src/context/LDThemeContext";
import LocalPeacefulGradientSpinner from "@/app/components/appwide/spinner/LocalPeacefulGradientSpinner";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

import useUser from "@/src/hooks/useUser";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

import { useShareIntentContext } from "expo-share-intent";
import { File } from "expo-file-system";

import SafeViewHome from "@/app/components/appwide/format/SafeViewHome";
import WelcomeMessageUI from "@/app/components/home/WelcomeMessageUI";
import NoFriendsMessageUI from "@/app/components/home/NoFriendsMessageUI";
import AllHome from "@/app/components/home/AllHome";
import QuickWriteMoment from "@/app/components/moments/QuickWriteMoment";
import KeyboardCoasters from "@/app/components/home/KeyboardCoasters";
import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";

import { AppFontStyles } from "@/app/styles/AppFonts";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";

const ScreenHome = ({ skiaFontLarge, skiaFontSmall }) => {
  // ─── all hooks first, no exceptions ────────────────────────────────────────
  const { user } = useUser();
  const { settings } = useUserSettings();
  const { navigateToFriendHome } = useAppNavigations();
  const isFocused = useIsFocused();
  const { autoSelectFriend } = useAutoSelector();
  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();
  const { hasShareIntent, shareIntent } = useShareIntentContext();
  const { navigateToMomentFocusWithText, navigateToAddImage } =
    useAppNavigations();
  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

  const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } =
    useFriendListAndUpcoming({ userId: user.id });

  const { setUpNextCache } = useUpNextCache({
    userId: user.id,
    friendListAndUpcoming,
  });

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [newMomentText, setNewMomentText] = useState();
  const newMomentTextRef = useRef(null);

  const isLoading =
    autoSelectFriend?.nextFriend === "pending" ||
    autoSelectFriend?.customFriend === "pending" ||
    !selectedFriend?.isReady ||
    !friendListAndUpcomingIsSuccess;


    useEffect(() => {
    if (!isFocused) return;
    if (!isLoading && selectedFriend?.id) {
      navigateToFriendHome();
    }
  }, [isLoading, selectedFriend?.id, isFocused]);

  // ─── all useEffects ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isFocused) return;
    setUpNextCache();
  }, [friendListAndUpcoming, isFocused]);



  console.log(`~~~~~~~~~~~~~~~~~~~home screen rerendered`);

  useEffect(() => {
    if (!hasShareIntent || !shareIntent) return;

    if (hasShareIntent && shareIntent?.files?.length > 0) {
      const file = shareIntent.files[0];
      const uri = file?.path || file?.contentUri;
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
          screenCameFrom: 0,
          momentText: sharedText,
        });
      } else {
        showFlashMessage(
          `length in shared text but data structure passed here is not valid`,
          true,
          2000,
        );
      }
    }
  }, [shareIntent, hasShareIntent]);

  useEffect(() => {
    console.log("request permissions!!");
    requestPermission();
  }, []);

  useEffect(() => {
    if (imageUri) {
      navigateToAddImage({ imageUri });
    }
  }, [imageUri]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false),
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // ─── callbacks ──────────────────────────────────────────────────────────────
  const processSharedFile = async (url) => {
    if (url.startsWith("content://") || url.startsWith("file://")) {
      try {
        const file = new File(url);
        const fileInfo = await file.info();
        if (fileInfo && fileInfo.exists) {
          if (fileInfo.uri.match(/\.(jpg|jpeg|png|gif)$/)) {
            const resizedImage = await resizeImage(fileInfo.uri);
            navigateToAddImage({ imageUri: resizedImage.uri });
          } else {
            Alert.alert(
              "Unsupported File",
              "The shared file is not a valid image.",
            );
          }
        } else {
          Alert.alert("Error", "Could not process the shared file.");
        }
      } catch (error) {
        console.error("Error processing shared file:", error);
        Alert.alert(
          "Error",
          "An error occurred while processing the shared file.",
        );
      }
    }
  };

  const updateNewMomentTextString = (text) => {
    setNewMomentText(text);
  };

  const clearNewMomentText = () => {
    setNewMomentText("");
  };

  const navigateToAddMomentScreen = useCallback(() => {
    if (newMomentText?.length > 0) {
      navigateToMomentFocusWithText({
        screenCameFrom: 0,
        triggerReverseBackdrop: true,
        momentText: newMomentText,
      });
      clearNewMomentText();
    }
  }, [newMomentText, navigateToMomentFocusWithText]);

  const handleFocusPress = () => {
    if (newMomentTextRef?.current) {
      newMomentTextRef.current.focus();
    }
  };

  // ─── derived values (after all hooks) ───────────────────────────────────────
  const friendList = friendListAndUpcoming?.friends;
  const friendListLength = friendList?.length || 0;
  const upcomingHelloes = friendListAndUpcoming?.upcoming;
  const userCreatedOn = user.created_on; 
 
  const welcomeTextStyle = AppFontStyles.welcomeText;

  // ─── early return: friend selected, just show spinner while nav effect fires ─
  if (!isLoading && selectedFriend?.id) {
    return <LocalSolidSpinner backgroundColor="hotpink" loading={true} />;
  }

  // ─── normal render ───────────────────────────────────────────────────────────
  return (
    <>
      {/* <LocalSolidSpinner
        backgroundColor="hotpink"
        loading={
          autoSelectFriend?.nextFriend === "pending" ||
          autoSelectFriend?.customFriend === "pending" ||
          !selectedFriend?.isReady ||
          !friendListAndUpcomingIsSuccess
        }
      /> */}

      {autoSelectFriend?.customFriend !== "pending" &&
        autoSelectFriend?.nextFriend !== "pending" &&
        selectedFriend?.isReady &&
        friendListAndUpcomingIsSuccess && (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: lightDarkTheme.primaryBackground,
            }}
          >
            {settings?.id && friendListLength < 1 && (
              <View style={styles.noFriendsView}>
                <NoFriendsMessageUI
                  backgroundColor={lightDarkTheme.overlayBackground}
                  primaryColor={lightDarkTheme.primaryText}
                  welcomeTextStyle={welcomeTextStyle}
                  username={user.username || ""}
                  userCreatedOn={userCreatedOn || ""}
                />
              </View>
            )}
            <>
              <>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={[{ flex: 1 }]}
                >
                  {settings?.id && (
                    <View style={styles.mainContainer}>
                      <>
                        {friendListLength > 0 && (
                          <>
                            <View style={styles.mainActionsWrapper}>
                              <WelcomeMessageUI 
                                darkerGlassBackground={
                                  lightDarkTheme.darkerGlassBackground
                                } 
                                primaryColor={lightDarkTheme.primaryText}
                                primaryBackground={
                                  lightDarkTheme.primaryBackground
                                } 
                                backgroundColor={
                                  lightDarkTheme.primaryBackground
                                } 
                                onPress={handleFocusPress}
                                isKeyboardVisible={isKeyboardVisible}
                              />
                            </View>

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
                              showMomentScreenButton={!!newMomentText?.length}
                              onPress={navigateToAddMomentScreen}
                            />
                          </>
                        )}
                      </>

                      {!isKeyboardVisible && friendListLength > 0 && (
                        <View style={styles.allHomeWrapper}>
                          <View
                            style={{
                              height: "100%", 
                            }}
                          >
                            <AllHome
                              userId={user.id}
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
                              navigateToFriendHome={navigateToFriendHome}
                              borderRadius={10}
                              height={"100%"}
                              textColor={lightDarkTheme.primaryText}
                              overlayColor={lightDarkTheme.overlayBackground}
                              primaryBackground={
                                lightDarkTheme?.primaryBackground
                              }
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </KeyboardAvoidingView>
              </>

              <HelloFriendFooter
                userId={user.id}
                username={user.username} 
                lightDarkTheme={lightDarkTheme}
      
              />
            </>
          </SafeAreaView>
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
  mainActionsWrapper: {},
  noFriendsView: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    paddingBottom: 60,
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
