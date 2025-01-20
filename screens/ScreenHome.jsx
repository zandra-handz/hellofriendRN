import { ShareIntentProvider, useShareIntentContext } from "expo-share-intent";


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

import { useMessage } from '../context/MessageContext';

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

import * as FileSystem from 'expo-file-system'; 
import * as Linking from 'expo-linking'; 

const ScreenHome = ({ navigation, incomingFileUri }) => {
  const { hasShareIntent, useShareIntent, shareIntent, resetShareIntent  } = useShareIntentContext();
  
  useGeolocationWatcher(); // Starts watching for location changes
  const { themeStyles, gradientColorsHome } = useGlobalStyle();
  const { authUserState, userAppSettings, incomingFile } = useAuthUser();
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

  const { showMessage } = useMessage();

  const newMomentTextRef = useRef(null);

  const [sharedFileFromOutsideOfApp, setSharedFileFromOutsideOfApp] = useState(null);

  useEffect(() => {
    if (incomingFileUri) {
      processSharedFile(incomingFileUri);
      showMessage(true, null, `incoming file: ${incomingFileUri}`);
    }
  }, [incomingFileUri]);


// useEffect(() => {
//   if (incomingFile) {
//     showMessage(true, null, `incoming file: ${incomingFile}`);
//     try {
//       processSharedFile(incomingFile);

//     } catch (error) {
//       showMessage(true, null, `Oops, couldn't catch incoming file: ${error}`);
//     }
//   }
//   if (!incomingFile) {
//     showMessage(true, null, `no incoming file stored in auth`);
//   }
    
  

// }, [incomingFile]);


const handleIncomingFileDetails = () => {
  if (hasShareIntent && shareIntent?.files?.length > 0) {
    // Log the shareIntent.files object to check its structure
    console.log('ShareIntent Files:', shareIntent.files);
 
  } else {
    showMessage(true, null, `No files found in shareIntent. incoming: ${incomingFileUri ? incomingFileUri : 'null'}`);
  }
}; 

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     const getInitialIntent = async () => {
  //       try {
  //         const initialUrl = await Linking.getInitialURL();
  //         if (initialUrl) {
  //           processSharedFile(initialUrl);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching initial intent:', error);
  //       }
  //     };
  
  //     getInitialIntent();
  
  //     // Listen for new intents while the app is running
  //     const subscription = Linking.addEventListener('url', (event) => {
  //       if (event.url) {
  //         processSharedFile(event.url);
  //       }
  //     });
  
  //     return () => {
  //       subscription.remove();
  //     };
  //   } 
  // }, []);
  
  const processSharedFile = async (url) => {
    console.log('Processing shared file:', url);
  
    if (url.startsWith('content://') || url.startsWith('file://')) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(url);
  
        if (fileInfo && fileInfo.exists) {
          console.log('Shared File Info:', fileInfo);
  
          // Validate that it's an image (optional)
          if (fileInfo.uri.match(/\.(jpg|jpeg|png|gif)$/)) {
            const resizedImage = await resizeImage(fileInfo.uri);  
            setSharedFileFromOutsideOfApp(resizedImage.uri);  
            navigation.navigate('AddImage', { imageUri: resizedImage.uri }); // Navigate with resized image URI
          } else {
            Alert.alert('Unsupported File', 'The shared file is not a valid image.');
          }
        } else {
          Alert.alert('Error', 'Could not process the shared file.');
        }
      } catch (error) {
        console.error('Error processing shared file:', error);
        Alert.alert('Error', 'An error occurred while processing the shared file.');
      }
    } else {
      // Handle URLs that are not file-based
      setSharedFileFromOutsideOfApp(url);
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
  const maxButtonHeight = 100;  // Remaining height for buttons  // Divide remaining height by the number of buttons (5 buttons + footer)
  const upcomingDatesTray = 100; 

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

  const navigateToAddImageScreenWithShared = () => {
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
      style={[styles.container, {height: isKeyboardVisible ? '200%' : '100%'}]}
    >
      
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
        {authUserState.authenticated &&
        authUserState.user &&
        userAppSettings ? (
          <View  style={{ flex: 1, paddingBottom: '1%', justifyContent: "space-between", flexDirection: 'column',   paddingHorizontal: '2%'}}>
            <View
              style={{
                height: isKeyboardVisible
                  ? '76%' //'Dimensions.get("window").height / 2.5'
                  : '32%' //Dimensions.get("window").height / 3,
              }}
            >

              <TouchableOpacity onPress={handleIncomingFileDetails} style={{zIndex: 6000, width: 50, height:30, backgroundColor: 'blue'}}></TouchableOpacity>
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
               <View style={{maxHeight: 80}}>
                
               <HomeButtonGenericAdd
                  label={"ADD FRIEND"}
                  onPress={navigateToAddFriendScreen}
                  borderRadius={40}
                  borderColor="black"
                  image={require("../assets/shapes/yellowleaves.png")}
                  height={'100%'}
                  maxHeight={maxButtonHeight}
                />

                
               </View>
              )}
              {/* </View> */}

              {!selectedFriend && (
                <HomeButtonUpNext
                  onPress={navigateToAddMomentScreen}
                  borderRadius={40}
                  height={'100%'}
                  borderColor="black"
                  maxHeight={190}
                />
              )}
              {selectedFriend && (
                  
                <HomeButtonSelectedFriend
                  onPress={navigateToAddMomentScreen}
                  borderRadius={40}
                  borderColor="black"
                  height={'100%'}  
                />
                 
              )}
              <HomeScrollSoon
                height={'20%'}
                maxHeight={140}
                borderRadius={40}
                borderColor="black"
              />
              {selectedFriend && ( 
                <HomeScrollCalendarLights
                  height={'5%'}
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
