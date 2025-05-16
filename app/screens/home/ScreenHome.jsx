import { useShareIntentContext } from "expo-share-intent";
import * as Sentry from "@sentry/react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Text,
  Keyboard,
  Animated,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import HellofriendHeader from "@/app/components/headers/HellofriendHeader";
import { useGeolocationWatcher } from "@/src/hooks/useCurrentLocationAndWatcher";

import { useUser } from "@/src/context/UserContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext"; //to check if any friends, don't render Up Next component or upcoming scroll if so

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import { useMessage } from "@/src/context/MessageContext";

import { LinearGradient } from "expo-linear-gradient";
import HomeScrollSoon from "@/app/components/home/HomeScrollSoon";

import HomeScrollCalendarLights from "@/app/components/home/HomeScrollCalendarLights";
import HomeScreenButton from "@/app/components/home/HomeScreenButton";
import HomeButtonMomentAddSmall from "@/app/components/home/HomeButtonMomentAddSmall";

import HomeButtonUpNext from "@/app/components/home/HomeButtonUpNext";
import HomeButtonSelectedFriend from "@/app/components/home/HomeButtonSelectedFriend";

import useCurrentLocation from "@/src/hooks/useCurrentLocation";

import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";

import TextMomentHomeScreenBox from "@/app/components/moments/TextMomentHomeScreenBox";

import HelloFriendFooter from "@/app/components/headers/HelloFriendFooter";

import * as FileSystem from "expo-file-system";

import SafeView from "@/app/components/appwide/format/SafeView";

const ScreenHome = ({ navigation }) => {
  const { hasShareIntent, shareIntent } = useShareIntentContext();

  useGeolocationWatcher(); // Starts watching for location changes
  const { themeStyles, gradientColorsHome } = useGlobalStyle();
  const { user, userAppSettings } = useUser();
  const { selectedFriend, friendLoaded } = useSelectedFriend();
  const { friendListLength } = useFriendList();
  const [showMomentScreenButton, setShowMomentScreenButton] = useState();
  const {
    requestPermission,
    imageUri,
    resizeImage,
    handleCaptureImage,
    handleSelectImage,
  } = useImageUploadFunctions();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { showMessage } = useMessage();

  const newMomentTextRef = useRef(null);

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
        //console.log('text length is 0');
        setShowMomentScreenButton(false);
      }
      if (text.length === 1) {
        setShowMomentScreenButton(true);
      }
    }
  };

  const showLastButton = true;
  const maxButtonHeight = 100; // Remaining height for buttons  // Divide remaining height by the number of buttons (5 buttons + footer)

  const { currentLocationDetails } = useCurrentLocation();
  useEffect(() => {
    if (currentLocationDetails) {
    }
  }, [currentLocationDetails]);

  // Animated values for slide-in effect
  const [slideAnim] = useState(new Animated.Value(1)); // Value for animating the button container

  // Trigger the slide-in animation when the screen mounts
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide in from the right
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const itemActions = [
    () => handleCaptureImage(),
    () => handleSelectImage(),
    () => navigateToAddHelloScreen(),
    () => navigateToAddLocationScreen(),
  ];

  const renderOptionButton = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          height: "auto",
          width: "auto",
          paddingHorizontal: 18,
          paddingVertical: 6,
          borderRadius: 30,
          marginRight: "6%",
          borderWidth: 1,
          borderColor: themeStyles.genericText.color,
          opacity: 0.8,
        }}
        onPress={itemActions[index]} // Use the index to match the corresponding action
      >
        <Text
          style={[
            themeStyles.genericText,
            { fontFamily: "Poppins-Regular", fontSize: 13 },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const clearNewMomentText = () => {
    if (newMomentTextRef && newMomentTextRef.current) {
      newMomentTextRef.current.setText("");
      setShowMomentScreenButton(false);
      console.log("Cleared new moment text.");
    }
  };

  const otherOptions = [
    "Add new photo",
    "Add upload",
    "Add hello",
    "Pick meet-up location",
  ];

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

  const navigateToAddHelloScreen = () => {
    navigation.navigate("AddHello");
  };

  const navigateToAddFriendScreen = () => {
    navigation.navigate("AddFriend");
  };

  const navigateToAddLocationScreen = () => {
    if (selectedFriend) {
      navigation.navigate("LocationSearch");
    }

    if (!selectedFriend) {
      Alert.alert(`I'm sorry!`, "Please select a friend first.", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
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
          {user.authenticated && user.user && userAppSettings ? (
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
                  height: isKeyboardVisible ? "84%" : "32%",
                }}
              >
                {/* <Button
                title="Try!"
                onPress={() => {
                  Sentry.captureException(new Error("First error"));
                }}
              /> */}
                <TextMomentHomeScreenBox
                  width={"100%"}
                  height={"100%"}
                  ref={newMomentTextRef}
                  title={"Add a new moment?"}
                  iconColor={themeStyles.genericText.color}
                  mountingText={""}
                  onTextChange={updateNewMomentTextString}
                  multiline={true}
                />

                {selectedFriend && showMomentScreenButton && (
                  <View
                    style={{
                      width: "30%",
                      height: 36,
                      position: "absolute",
                      bottom: 20,
                      right: 0,
                    }}
                  >
                    <HomeButtonMomentAddSmall
                      onPress={navigateToAddMomentScreen}
                      borderRadius={40}
                      borderColor="black"
                    />
                  </View>
                )}
              </View>
              {friendListLength > 0 && (
                <View style={{ height: "auto", width: "100%" }}>
                  <FlatList
                    data={otherOptions}
                    horizontal
                    keyExtractor={(item, index) => `satellite-${index}`}
                    renderItem={(
                      { item, index } // Correctly destructure the item and index
                    ) => renderOptionButton(item, index)}
                    ListFooterComponent={() => <View style={{ width: 140 }} />}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
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
                {!selectedFriend && !friendLoaded && showLastButton && (
                  <View style={{ height: 80, paddingVertical: 4 }}>
                    <HomeScreenButton
                      label={"ADD FRIEND"}
                      onPress={navigateToAddFriendScreen}
                      image={require("@/app/assets/shapes/yellowleaves.png")}
                    />
                  </View>
                )}

                {!selectedFriend && (
                  <HomeButtonUpNext
                    onPress={navigateToAddMomentScreen}
                    borderRadius={40}
                    height={"100%"}
                    borderColor="black"
                    maxHeight={190}
                  />
                )}
                {selectedFriend && (
                  <HomeButtonSelectedFriend
                    onPress={navigateToAddMomentScreen}
                    borderRadius={40}
                    borderColor="black"
                    height={"100%"}
                  />
                )}
                <HomeScrollSoon
                  height={"20%"}
                  maxHeight={140}
                  borderRadius={40}
                  borderColor="black"
                />
                {selectedFriend && (
                  <HomeScrollCalendarLights
                    height={"5%"}
                    borderRadius={40}
                    borderColor="black"
                  />
                )}
              </Animated.View>
            </View>
          ) : (
            <View style={styles.signInContainer}></View>
          )}

          <HelloFriendFooter />
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeView>
  );
};

export default ScreenHome;
