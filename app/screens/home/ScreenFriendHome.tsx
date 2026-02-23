//import * as Sentry from "@sentry/react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Alert, StyleSheet } from "react-native";

import { useRoute } from "@react-navigation/native";

// app state
import useSelectFriend from "@/src/hooks/useSelectFriend";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useAutoSelector } from "@/src/context/AutoSelectorContext";

import useUserSettings from "@/src/hooks/useUserSettings";
import SelectedFriendFooter from "@/app/components/headers/SelectedFriendFooter";
import { useLDTheme } from "@/src/context/LDThemeContext";

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
import SafeViewFriendHome from "@/app/components/appwide/format/SafeViewFriendHome";

import SelectedFriendHome from "@/app/components/home/SelectedFriendHome";
import { useCategoryColors } from "@/src/context/CategoryColorsContext";

// import LoadingPage from "@/app/components/appwide/spinner/LoadingPage";
import manualGradientColors from "@/app/styles/StaticColors";
import useFriendListAndUpcoming from "@/src/hooks/usefriendListAndUpcoming";
import useCategories from "@/src/hooks/useCategories";
// import { useCategories } from "@/src/context/CategoriesContext";
import WriteButton from "@/app/components/home/WriteButton";

const ScreenFriendHome = ({ skiaFontLarge, skiaFontSmall }) => {
  const { user } = useUser();
  const { settings } = useUserSettings(); // MUST GO AT TOP OTHERWISE SOMETHING ELSE WILL RERENDER THE SCREEN FIRST AND THIS WILL HAVE OLD VALUES
  //FOR SOME REASON SETTINGS UPDATE DOESN'T GET BATCHED WITH OTHER THINGS RENDERING
  //MAYBE TOO MUCH ON THIS SCREEN TO RENDER???? ???????
  const route = useRoute();

  const idToSelect = route?.params?.idToSelect ?? null;
  console.log(idToSelect);
  const { friendListAndUpcoming, friendListAndUpcomingIsSuccess } =
    useFriendListAndUpcoming({ userId: user?.id });
  const friendList = friendListAndUpcoming?.friends;

  const { handleSelectFriend } = useSelectFriend({
    userId: user?.id,
    friendList,
  });

  // Select friend when screen mounts with idToSelect param
  useEffect(() => {
    if (idToSelect && friendList?.length && !selectedFriend?.id) {
      console.log("laaaaaaaaaaaaaaaaa");
      handleSelectFriend(idToSelect);
    }
  }, [idToSelect, friendList?.length, selectedFriend?.id]);

  // const { upcomingHelloes  } = useUpcomingHelloes();
  const { navigateToMomentFocus, navigateToHome } = useAppNavigations();
  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({ screenCameFrom: 1 });
  }, [navigateToMomentFocus]);

  const { autoSelectFriend } = useAutoSelector();
  const { userCategories } = useCategories({ userId: user?.id });

  const { selectedFriend, setToAutoFriend } = useSelectedFriend();
  const { categoryColors, handleSetCategoryColors } = useCategoryColors();

  const categoryIds = useMemo(
    () => userCategories.map((c) => c.id), // or c.category_id
    [userCategories],
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
        selectedFriend.darkColor,
      );
      handleSetCategoryColors(array);
    }
  }, [categoryIds, selectedFriend]);

  const upcomingHelloes = friendListAndUpcoming?.upcoming;

  const { hasShareIntent, shareIntent } = useShareIntentContext();

  const { lightDarkTheme } = useLDTheme();

  const { navigateToMomentFocusWithText, navigateToAddImage } =
    useAppNavigations();
  const { requestPermission, imageUri, resizeImage } =
    useImageUploadFunctions();

  const PADDING_HORIZONTAL = 6;

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
  //         2000,
  //       );
  //     }
  //   }
  // }, [shareIntent, hasShareIntent]);

  // const processSharedFile = async (url) => {
  //   if (url.startsWith("content://") || url.startsWith("file://")) {
  //     try {
  //       const file = new File(url);

  //       const fileInfo = await file.info();
  //       // const fileInfo = await FileSystem.getInfoAsync(url);

  //       if (fileInfo && fileInfo.exists) {
  //         // Validate that it's an image
  //         if (fileInfo.uri.match(/\.(jpg|jpeg|png|gif)$/)) {
  //           const resizedImage = await resizeImage(fileInfo.uri);
  //           navigateToAddImage({ imageUri: resizedImage.uri }); // Navigate with resized image URI
  //         } else {
  //           Alert.alert(
  //             "Unsupported File",
  //             "The shared file is not a valid image.",
  //           );
  //         }
  //       } else {
  //         Alert.alert("Error", "Could not process the shared file.");
  //       }
  //     } catch (error) {
  //       console.error("Error processing shared file:", error);
  //       Alert.alert(
  //         "Error",
  //         "An error occurred while processing the shared file.",
  //       );
  //     }
  //   }
  // };

  // DONT DELETE UNTIL WE KNOW SHARE INTENT WORKS

  // useEffect(() => {
  //   console.log("request permissions!!");
  //   requestPermission();
  // }, []);

  // MAKE SURE THIS WORKS BEFORE DELETING NAV TO ADD IMAGE SCREEN
  // useEffect(() => {
  //   if (imageUri) {
  //     // navigateToAddImageScreen();
  //     navigateToAddImage({ imageUri: imageUri });
  //   }
  // }, [imageUri]);

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
    ],
  );

  return (
    <>
      {
        autoSelectFriend?.customFriend !== "pending" &&   // not sure if need all this here
          autoSelectFriend?.nextFriend !== "pending" &&
          selectedFriend?.isReady &&
          // selectedFriend?.id &&
        friendListAndUpcomingIsSuccess &&
        <SafeViewFriendHome
          friendColorLight={selectedFriend.lightColor}
          friendColorDark={selectedFriend.darkColor}
          backgroundOverlayColor={lightDarkTheme.primaryBackground}
          friendId={selectedFriend?.id}
        >
          <View style={[{ flex: 1 }]}>
            {settings?.id && upcomingHelloes?.length && user?.id   && (
              <View style={styles.mainContainer}>
                <SelectedFriendHome
                  canvasKey={route.key}
                  primaryBackground={lightDarkTheme.primaryBackground}
                  darkGlassBackground={lightDarkTheme.darkGlassBackground}
                  darkerGlassBackground={lightDarkTheme.darkerGlassBackground}
                  categoryColorsArray={categoryColors}
                  skiaFontLarge={skiaFontLarge}
                  skiaFontSmall={skiaFontSmall}
                  paddingHorizontal={PADDING_HORIZONTAL}
                  userId={user?.id}
                  primaryColor={lightDarkTheme.primaryText}
                  primaryOverlayColor={lightDarkTheme.overlayBackground}
                  themeColors={themeColors}
                  selectedFriendId={selectedFriend?.id}
                  selectedFriendName={selectedFriend?.name}
                />
              </View>
            )}
          </View>
          {selectedFriend?.id && (
            <WriteButton
              onPress={handleNavigateToCreateNew}
              backgroundColor={manualGradientColors.lightColor}
              iconColor={manualGradientColors.homeDarkColor}
              spaceFromBottom={140}
            />
          )}

          <SelectedFriendFooter
            userId={user?.id}
            friendName={selectedFriend?.name}
            lightDarkTheme={lightDarkTheme}
            overlayColor={lightDarkTheme.overlayBackground}
            themeColors={themeColors}
          />
        </SafeViewFriendHome>
      }
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

export default ScreenFriendHome;
