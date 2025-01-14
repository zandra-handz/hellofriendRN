import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Text,
  Keyboard,
  Dimensions,
  Animated,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  useCurrentLocationManual,
  useGeolocationWatcher,
} from "../hooks/useCurrentLocationAndWatcher";

import { useAuthUser } from "../context/AuthUserContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useFriendList } from "../context/FriendListContext"; //to check if any friends, don't render Up Next component or upcoming scroll if so

import { useUpcomingHelloes } from "../context/UpcomingHelloesContext";
import { useGlobalStyle } from "../context/GlobalStyleContext";

import { LinearGradient } from "expo-linear-gradient";
import HomeScrollSoon from "../components/HomeScrollSoon";
import HomeScrollCalendarLights from "../components/HomeScrollCalendarLights";
import HomeButtonGenericAdd from "../components/HomeButtonGenericAdd";
import HomeButtonMomentAddSmall from "../components/HomeButtonMomentAddSmall";
import HomeButtonUpNext from "../components/HomeButtonUpNext";
import HomeButtonSelectedFriend from "../components/HomeButtonSelectedFriend";
import useCurrentLocation from "../hooks/useCurrentLocation";

import useImageUploadFunctions from "../hooks/useImageUploadFunctions";

import TextMomentHomeScreenBox from "../components/TextMomentHomeScreenBox";

import HelloFriendFooter from "../components/HelloFriendFooter";

const ScreenHome = ({ navigation }) => {
  useGeolocationWatcher(); // Starts watching for location changes
  const { themeStyles, gradientColorsHome } = useGlobalStyle();
  const { authUserState, userAppSettings } = useAuthUser();
  const { selectedFriend, friendLoaded } = useSelectedFriend();
  const { friendListLength } = useFriendList();
  const { isLoading } = useUpcomingHelloes();
  const [showMomentScreenButton, setShowMomentScreenButton] = useState();
  const {
    requestPermission,
    imageUri,
    resizeImage,
    handleCaptureImage,
    handleSelectImage,
  } = useImageUploadFunctions();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const newMomentTextRef = useRef(null);

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

  // useFocusEffect(
  //   useCallback(() => {
  //     if (newMomentTextRef.current) {
  //       newMomentTextRef.current.focus();
  //     }
  //   }, [])
  // );

  const updateNewMomentTextString = (text) => {
    if (newMomentTextRef && newMomentTextRef.current) {
      newMomentTextRef.current.setText(text);
      if (text.length === 0) {
        //console.log('text length is 0');
        setShowMomentScreenButton(false);
      }
      if (text.length === 1) {
        //console.log('text length is 1');
        setShowMomentScreenButton(true);
      }

      // console.log("new moment in home screen", newMomentTextRef.current.getText());
    }
  };

  const { data, isLoadingCurrentLocation, error } = useCurrentLocationManual();

  const showLastButton = true;
  const screenHeight = Dimensions.get("window").height;
  const maxButtonHeight = 100;
  const footerHeight = screenHeight * 0.082; // Footer height
  const buttonContainerHeight = screenHeight - footerHeight; // Remaining height for buttons
  const buttonHeight = buttonContainerHeight / 6; // Divide remaining height by the number of buttons (5 buttons + footer)
  const upcomingDatesTray = buttonHeight * 0.9;
  const headerHeight = buttonHeight * 1.4;

  const { currentLocationDetails, currentRegion } = useCurrentLocation();
  useEffect(() => {
    if (currentLocationDetails) {
      console.log("data in home screen", currentLocationDetails);
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

    //Don't need -- it's already checking this at a higher level
    // if (friendListLength < 1) {
    //   Alert.alert(
    //     `I'm sorry!`,
    //     'You need to add friends before you can search and add locations.',
    //     [
    //       { text: 'OK', onPress: () => console.log('OK Pressed') }
    //     ]
    //   );
    // }
  };

  return (
    <LinearGradient
      colors={[gradientColorsHome.darkColor, gradientColorsHome.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, {height: isKeyboardVisible ? Dimensions.get("window").height : 'auto'}]}
    >
      
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
        {authUserState.authenticated &&
        authUserState.user &&
        userAppSettings ? (
          <View  style={{ flex: 1, flexDirection: 'column',   paddingHorizontal: '2%', paddingBottom: '2%' }}>
            <View
              style={{
                height: isKeyboardVisible
                  ? '68%' //'Dimensions.get("window").height / 2.5'
                  : '33%' //Dimensions.get("window").height / 3,
              }}
            >
              <TextMomentHomeScreenBox
                width={"100%"}
                height={"100%"}
                ref={newMomentTextRef}
                title={"Add a new moment?"}
                // helperText={    not in use in child component
                // 'Enter a future note, anecdote, joke, or whatever else you would like to share with your friend here:'
                //   !isKeyboardVisible ? null : "Press enter to exit"
                //}
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
                    height={buttonHeight}
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
                />
              </View>
            )}
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  paddingBottom: footerHeight,
                  paddingTop: 10,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              {/* <View style={{flex: 1}}>  */}

              {/* <HomeButtonGenericAdd label={'ADD IMAGE'}  onPress={navigateToAddImageScreen} borderRadius={40} borderColor="black" height={buttonHeight}/>
               */}

              {/* <HomeButtonGenericAdd label={'ADD HELLO'} onPress={navigateToAddHelloScreen} borderRadius={40} borderColor="black" image={require("../assets/shapes/coffeecupnoheart.png")} height={buttonHeight}/>
               */}

              {/* {(selectedFriend || friendLoaded) && showLastButton && (
                  <HomeButtonGenericAdd label={'ADD MEETUP SPOT'}   onPress={navigateToAddLocationScreen} borderRadius={40} borderColor="black" image={require("../assets/shapes/hillylandscape.png")} height={buttonHeight} />
                )} */}

              {!selectedFriend && !friendLoaded && showLastButton && (
                <HomeButtonGenericAdd
                  label={"ADD FRIEND"}
                  onPress={navigateToAddFriendScreen}
                  borderRadius={40}
                  borderColor="black"
                  image={require("../assets/shapes/yellowleaves.png")}
                  height={buttonHeight}
                  maxHeight={maxButtonHeight}
                />
              )}
              {/* </View> */}

              {!selectedFriend && (
                <HomeButtonUpNext
                  onPress={navigateToAddMomentScreen}
                  borderRadius={40}
                  height={headerHeight}
                  borderColor="black"
                  maxHeight={200}
                />
              )}
              {selectedFriend && (
                <HomeButtonSelectedFriend
                  onPress={navigateToAddMomentScreen}
                  borderRadius={40}
                  borderColor="black"
                  height={headerHeight}
                  maxHeight={200}
                />
              )}
              <HomeScrollSoon
                height={upcomingDatesTray}
                borderRadius={40}
                borderColor="black"
              />
              {selectedFriend && (
                <HomeScrollCalendarLights
                  height={upcomingDatesTray}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,  
    justifyContent: "space-between",
  },
  buttonContainer: {
    height: "100%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    marginHorizontal: 0,
    flex: 1,
  },
  loadingWrapper: {
    flex: 1,
    width: "100%",
  },
});

export default ScreenHome;
