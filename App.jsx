import React, { useEffect, useState } from "react";

import TopLevelNavigationHandler from "./TopLevelNavigationHandler"; // Adjust import path if necessary

import { useShareIntentContext, ShareIntentProvider } from "expo-share-intent";


import { Alert, View, Text, useColorScheme, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MessageContextProvider } from "./context/MessageContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthUserProvider, useAuthUser } from "./context/AuthUserContext";
import { GlobalStyleProvider } from "./context/GlobalStyleContext";
import { FriendListProvider } from "./context/FriendListContext";
import { HelloesProvider } from "./context/HelloesContext";
import { LocationsProvider } from "./context/LocationsContext";
import { UpcomingHelloesProvider } from "./context/UpcomingHelloesContext";
import { CapsuleListProvider } from "./context/CapsuleListContext";
import { SelectedFriendProvider } from "./context/SelectedFriendContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import * as FileSystem from 'expo-file-system'; 
import * as Linking from 'expo-linking'; 

import * as Permissions from 'expo-permissions';

import { useGlobalStyle } from "./context/GlobalStyleContext";
import ResultMessage from "./components/ResultMessage";
import FullScreenSpinner from "./components/FullScreenSpinner";

import ScreenOnboardingFlow from "./onboarding/ScreenOnboardingFlow";
import ScreenHome from "./screens/ScreenHome";
import ScreenFriendSettings from "./screens/ScreenFriendSettings";
import ScreenMoments from "./screens/ScreenMoments";
import ScreenImages from "./screens/ScreenImages";
import ScreenHelloes from "./screens/ScreenHelloes";
import ScreenLocations from "./screens/ScreenLocations";
import ScreenLocationSearch from "./screens/ScreenLocationSearch";
import ScreenMidpointLocationSearch from "./screens/ScreenMidpointLocationSearch";
import ScreenCalculateTravelTimes from "./screens/ScreenCalculateTravelTimes";
import ScreenWelcome from "./screens/ScreenWelcome";
import ScreenAuth from "./screens/ScreenAuth";
import ScreenMomentFocus from "./screens/ScreenMomentFocus";
import ScreenLocation from "./screens/ScreenLocation";

import ScreenLocationSend from "./screens/ScreenLocationSend";
import ScreenLocationEdit from "./screens/ScreenLocationEdit"; 

import ScreenAddFriend from "./screens/ScreenAddFriend";
import ScreenAddImage from "./screens/ScreenAddImage";
import ScreenAddHello from "./screens/ScreenAddHello";
import ScreenAddLocation from "./screens/ScreenAddLocation";

import HellofriendHeader from "./components/HellofriendHeader";
//import HeaderBaseMainTheme from './components/HeaderBaseMainTheme';
import HeaderMoment from "./components/HeaderMoment";
import HeaderHelloes from "./components/HeaderHelloes";
import HeaderImage from "./components/HeaderImage";
import HeaderLocation from "./components/HeaderLocation";
import HeaderFriendSettings from "./components/HeaderFriendSettings";
import HeaderBase from "./components/HeaderBase";
import HeaderBlank from "./components/HeaderBlank"; //can make a SignIn one in future if want to put info on top

import HeaderLocationSingle from "./components/HeaderLocationSingle";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import PhoneStatusBar from "./components/PhoneStatusBar";

async function loadFonts() {
  await Font.loadAsync({
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
    "Pacifico-Regular": require("./assets/fonts/Pacifico-Regular.ttf"),
  });
}


const Stack = createNativeStackNavigator();

export default function App() { 
 
  const [fontsLoaded, setFontsLoaded] = useState(false);
  

const [incomingFileUri, setIncomingFileUri] = useState(null);

const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntentContext();
const [imageUri, setImageUri] = useState(null);


useEffect(() => {
  let permissionsGranted = false;

  async function requestPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const { status } = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY // For images, videos, and audio
      );

      if (status === 'granted') {
        console.log('Media permissions granted!');
        permissionsGranted = true;
        handleShareIntent(); // Process the share intent if permissions are granted
      } else {
        console.warn('Media permissions denied.');
        permissionsGranted = false;
      }
    } else {
      permissionsGranted = true; // Assume permissions are not required for other cases
      handleShareIntent();
    }
  }

  function handleShareIntent() {
    if (permissionsGranted && hasShareIntent && shareIntent?.files?.length > 0) {
      const file = shareIntent.files[0]; // assuming the first file is the image
      const uri = file.path || file.contentUri; // Use either path (iOS) or contentUri (Android)
      setImageUri(uri);
      Alert.alert("Shared Image", `Image URI: ${uri}`);
    } else if (!permissionsGranted) {
      console.warn("Cannot process share intent without permissions.");
    }
  }

  requestPermissions();
}, [hasShareIntent, shareIntent]);




  useEffect(() => { 
    // Load fonts and set loading status
    const fetchFonts = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };

    fetchFonts();


    

    const notificationSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received in foreground:", notification);
        Alert.alert(
          notification.request.content.title,
          notification.request.content.body
        );
      });
    // Clean up subscription on unmount
    return () => notificationSubscription.remove();
  }, []);

//  useEffect(() => {
//     // Function to handle incoming file URI
//     const handleFileUri = async (uri) => {
//       if (uri && uri.startsWith('file://')) {
//         setIncomingFileUri(uri);  // Store file URI in state
//       }
//     };

//     // Get the initial URL that launched the app
//     const getInitialFileUri = async () => {
//       const url = await Linking.getInitialURL();
//       handleFileUri(url);  // Handle the URI if it's a file URI
//     };

//     // Add listener for incoming URLs while the app is running
//     const urlListener = Linking.addEventListener('url', ({ url }) => {
//       handleFileUri(url);  // Handle the incoming file URI
//     });

//     // Call the function to handle the initial file URI when the app launches
//     getInitialFileUri();

//     // Cleanup the listener on component unmount
//     return () => {
//       urlListener.remove();
//     };
//   }, []);


  const colorScheme = useColorScheme();

  // If fonts or other resources are not ready, show a loading placeholder
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ShareIntentProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthUserProvider>
          <GlobalStyleProvider>
            <UpcomingHelloesProvider>
              <FriendListProvider>
                <SelectedFriendProvider>
                  <LocationsProvider>
                    <PhoneStatusBar />
                    <CapsuleListProvider>
                      <HelloesProvider>
                        <MessageContextProvider>
                          <Layout imageUri={imageUri || null} />
                        </MessageContextProvider>
                      </HelloesProvider>
                    </CapsuleListProvider>
                  </LocationsProvider>
                </SelectedFriendProvider>
              </FriendListProvider>
            </UpcomingHelloesProvider>
          </GlobalStyleProvider>
        </AuthUserProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
    
      
    </ShareIntentProvider>
  );
}

export const Layout = ({imageUri}) => {//{incomingFileUri}
  const { themeStyles} = useGlobalStyle();
  const { authUserState, incomingFile, setIncomingFile  } = useAuthUser();


  // useEffect(() => {
  //   if (incomingFileUri) {
  //     setIncomingFile(incomingFileUri);
  //   }


  // }, [incomingFileUri]);

  return (
    <NavigationContainer>
      <ResultMessage />

      <TopLevelNavigationHandler>
        <FullScreenSpinner />
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerMode: "screen",
            headerStyle: themeStyles.header,
            headerTintColor: themeStyles.headerTextColor,
            contentContainerStyle: { flexGrow: 1 },
            cardStyle: { backgroundColor: "#000002" },
          }}
        >
          {authUserState?.authenticated && authUserState?.user ? (
            authUserState.user.app_setup_complete ||
            !authUserState.user.app_setup_complete ? (
              <>
                <Stack.Screen
                  name="hellofriend"
                  //component={ScreenHome}
                  options={{
                    headerShown: true,
                    header: () => <HellofriendHeader />,
                  }}
                  >
                  {(props) => <ScreenHome {...props} incomingFileUri={null} />}
                  </Stack.Screen>
                <Stack.Screen
                  name="FriendFocus"
                  component={ScreenFriendSettings}
                  options={{
                    headerShown: true,
                    header: () => <HeaderFriendSettings />,
                  }}
                />
                <Stack.Screen
                  name="MomentFocus"
                  component={ScreenMomentFocus}
                  options={{
                    headerShown: true,
                    header: () => <HeaderMoment writeView={true} />,
                  }}
                />
                <Stack.Screen
                  name="Moments"
                  component={ScreenMoments}
                  options={{
                    headerShown: true,
                    header: () => <HeaderMoment title={"MOMENTS"} />,
                  }}
                />
                <Stack.Screen
                  name="Images"
                  component={ScreenImages}
                  options={{
                    headerShown: true,
                    header: () => <HeaderImage headerTitle="Images" />,
                  }}
                />
                <Stack.Screen
                  name="Helloes"
                  component={ScreenHelloes}
                  options={{
                    headerShown: true,
                    header: () => <HeaderHelloes />,
                  }}
                />
                <Stack.Screen
                  name="Locations"
                  component={ScreenLocations}
                  options={{
                    headerMode: "screen",
                    headerShown: true,
                    header: () => <HeaderLocation headerTitle="Locations" />,
                  }}
                />
                <Stack.Screen
                  name="Location"
                  component={ScreenLocation}
                  options={({ route }) => ({
                    headerShown: true,
                    header: () => (
                      <HeaderLocationSingle
                        location={route.params?.location}
                        favorite={route.params?.favorite}
                      />
                    ),
                  })}
                />
                <Stack.Screen
                  name="LocationSend"
                  component={ScreenLocationSend}
                  options={({ route }) => ({
                    headerShown: true,
                    header: () => (
                      <HeaderBase
                        headerTitle="Send Directions & Hrs"
                        icon="clock"
                        navigateTo="LocationSearch"
                      />
                    ),
                  })}
                />
                <Stack.Screen
                  name="LocationEdit"
                  component={ScreenLocationEdit}
                  options={({ route }) => ({
                    headerShown: true,
                    header: () => (
                      <HeaderBase
                        headerTitle="Edit Location details"
                        icon="edit"
                        navigateTo="LocationSearch"
                      />
                    ),
                  })}
                />
                <Stack.Screen
                  name="LocationSave"
                  component={ScreenAddLocation}
                  options={({ route }) => ({
                    headerShown: true,
                    header: () => (
                      <HeaderBase
                        headerTitle="Save Location"
                        icon="heartbeat"
                        navigateTo="LocationSearch"
                      />
                    ),
                  })}
                />
                <Stack.Screen
                  name="LocationSearch"
                  component={ScreenLocationSearch}
                  options={{
                    headerShown: false,
                    header: () => <HeaderBase headerTitle="Search locations" />,
                  }}
                />
                <Stack.Screen
                  name="MidpointLocationSearch"
                  component={ScreenMidpointLocationSearch}
                  options={{
                    headerShown: true,
                    header: () => (
                      <HeaderBase headerTitle="Find midpoint locations" />
                    ),
                  }}
                />
                <Stack.Screen
                  name="CalculateTravelTimes"
                  component={ScreenCalculateTravelTimes}
                  options={{
                    headerShown: true,
                    header: () => (
                      <HeaderBase
                        headerTitle="Compare driving times"
                        icon="distanceZigZag"
                      />
                    ),
                  }}
                />

                <Stack.Screen
                  name="AddImage"
                  component={ScreenAddImage}
                  options={{
                    headerShown: true,
                    header: () => (
                      <HeaderBase headerTitle="Upload" navigateTo="Images" />
                    ),
                  }}
                />
                <Stack.Screen
                  name="AddHello"
                  component={ScreenAddHello}
                  options={{
                    headerShown: true,
                    header: () => (
                      <HeaderBase
                        headerTitle="Add hello"
                        icon="heartbeat"
                        navigateTo="Helloes"
                      />
                    ),
                  }}
                />
                <Stack.Screen
                  name="AddFriend"
                  component={ScreenAddFriend}
                  options={{
                    headerShown: true,
                    header: () => <HeaderBase headerTitle="Add new friend" />,
                  }}
                />
              </>
            ) : (
              <Stack.Screen
                name="Setup"
                component={ScreenOnboardingFlow}
                options={{
                  headerShown: false,
                }}
              />
            )
          ) : (
            <>
<Stack.Screen
  name="Welcome"
  //component={ScreenWelcome}
  options={{
    headerShown: false,
    header: () => <HeaderBlank />,
  }}> 
                    {(props) => <ScreenWelcome {...props} incomingFileUri={null} />}
                
                </Stack.Screen> 

              <Stack.Screen
                name="Auth"
                component={ScreenAuth}
                options={{
                  headerShown: false,
                  header: () => <HeaderBlank />,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </TopLevelNavigationHandler>
    </NavigationContainer>
  );
};
