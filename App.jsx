import React, { useEffect, useState, createRef } from "react";

import TopLevelNavigationHandler from "./TopLevelNavigationHandler"; // Adjust import path if necessary

import {
  useShareIntentContext,
  ShareIntentProvider,
  ShareIntentModule,
  getScheme,
  getShareExtensionKey,
} from "expo-share-intent";

import Constants from "expo-constants";
import {
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
  getStateFromPath,
} from "@react-navigation/native";
import { Alert, View, Text, useColorScheme, Platform } from "react-native";
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
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

import * as MediaLibrary from "expo-media-library";

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
import ScreenRecoverCredentials from "./screens/ScreenRecoverCredentials";
import ScreenMomentFocus from "./screens/ScreenMomentFocus";
import ScreenLocation from "./screens/ScreenLocation";

import ScreenUserDetails from "./screens/ScreenUserDetails";

import ScreenLocationSend from "./screens/ScreenLocationSend";
import ScreenLocationEdit from "./screens/ScreenLocationEdit";

import ScreenAddFriend from "./screens/ScreenAddFriend";
import ScreenAddImage from "./screens/ScreenAddImage";
import ScreenAddHello from "./screens/ScreenAddHello";
import ScreenAddLocation from "./screens/ScreenAddLocation";

import ScreenMomentView from './screens/ScreenMomentView';

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

import HeaderUserDetails from "./components/HeaderUserDetails";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RootStackParamList } from "./types";

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

  const { hasShareIntent, shareIntent, resetShareIntent, error } =
    useShareIntentContext();

  useEffect(() => {
    let permissionsGranted = false;

    async function requestPermissions() {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const { status } = await MediaLibrary.requestPermissionsAsync(); // Request media library permissions

        if (status === "granted") {
          console.log("Media permissions granted!");
          permissionsGranted = true;
         // handleShareIntent(); // Process the share intent if permissions are granted
        } else {
          console.warn("Media permissions denied.");
          permissionsGranted = false;
        }
      } else {
        permissionsGranted = true; // Assume permissions are not required for other cases
        //handleShareIntent();
      }
    }

    // function handleShareIntent() {
    //   if (permissionsGranted && hasShareIntent && shareIntent?.files?.length > 0) {
    //     const file = shareIntent.files[0]; // assuming the first file is the image
    //     const uri = file.path || file.contentUri; // Use either path (iOS) or contentUri (Android)
    //     setImageUri(uri);
    //     Alert.alert("Shared Image", `Image URI: ${uri}`);
    //   } else if (!permissionsGranted) {
    //     console.warn("Cannot process share intent without permissions.");
    //   }
    // }

    requestPermissions();
  }, [hasShareIntent, shareIntent]);

  useEffect(() => {
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
    return () => notificationSubscription.remove();
  }, []);

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
                            <Layout />
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

// Linking setup for deep linking and share intents
const PREFIX = Linking.createURL("/");

const PACKAGE_NAME =
  Constants.expoConfig?.android?.package ||
  Constants.expoConfig?.ios?.bundleIdentifier;

const navigationRef = createRef();

const linking = {
  prefixes: [
    `${Constants.expoConfig?.scheme}://`,
    `${PACKAGE_NAME}://`,
    PREFIX,
  ],
  screens: {
    Welcome: "first-screen",
    hellofriend: "home",
    UserDetails: "user-details",
    FriendFocus: "friend-settings",
    Moments: "moments",
    Images: "images",
    Locations: "locations",
    // Add other screens as needed
  },
  config: {
    initialRouteName: "Home",
    screens: {
      Home: "home",
      ShareIntent: "shareintent",
    },
  },
  getStateFromPath(path, config) {
    // REQUIRED FOR iOS FIRST LAUNCH
    if (path.includes(`dataUrl=${getShareExtensionKey()}`)) {
      // redirect to the ShareIntent Screen to handle data with the hook
      console.debug(
        "react-navigation[getStateFromPath] redirect to ShareIntent screen"
      );
      return {
        routes: [
          {
            name: "ShareIntent",
          },
        ],
      };
    }
    return getStateFromPath(path, config);
  },
  subscribe(listener) {
    console.debug("react-navigation[subscribe]", PREFIX, PACKAGE_NAME);
    const onReceiveURL = ({ url }) => {
      if (url.includes(getShareExtensionKey())) {
        // REQUIRED FOR iOS WHEN APP IS IN BACKGROUND
        console.debug(
          "react-navigation[onReceiveURL] Redirect to ShareIntent Screen",
          url
        );
        listener(`${getScheme()}://home`);
      } else {
        console.debug("react-navigation[onReceiveURL] OPEN URL", url);
        listener(url);
      }
    };
    const shareIntentStateSubscription = ShareIntentModule?.addListener(
      "onStateChange",
      (event) => {
        // REQUIRED FOR ANDROID WHEN APP IS IN BACKGROUND
        console.debug(
          "react-navigation[subscribe] shareIntentStateListener",
          event.value
        );
        if (event.value === "pending") {
          listener(`${getScheme()}://home`);
        }
      }
    );
    const shareIntentValueSubscription = ShareIntentModule?.addListener(
      "onChange",
      async (event) => {
        // REQUIRED FOR IOS WHEN APP IS IN BACKGROUND
        console.debug(
          "react-navigation[subscribe] shareIntentValueListener",
          event.value
        );
        const url = await Linking.getInitialURL();
        if (url) {
          onReceiveURL({ url });
        }
      }
    );
    const urlEventSubscription = Linking.addEventListener("url", onReceiveURL);
    return () => {
      // Clean up the event listeners
      shareIntentStateSubscription?.remove();
      shareIntentValueSubscription?.remove();
      urlEventSubscription.remove();
    };
  },
  // https://reactnavigation.org/docs/deep-linking/#third-party-integrations
  async getInitialURL() {
    console.debug("react-navigation[getInitialURL] ?");
    // REQUIRED FOR ANDROID FIRST LAUNCH
    const needRedirect = ShareIntentModule?.hasShareIntent(
      getShareExtensionKey()
    );
    console.debug(
      "react-navigation[getInitialURL] redirect to ShareIntent screen:",
      needRedirect
    );
    if (needRedirect) {
      return `${Constants.expoConfig?.scheme}://home`;
    }
    // As a fallback, do the default deep link handling
    const url = await Linking.getLinkingURL();
    return url;
  },
};

export const Layout = () => {
  const { themeStyles } = useGlobalStyle();
  const { authUserState } = useAuthUser();
 
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
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
                  component={ScreenHome}
                  options={{
                    headerShown: true,
                    header: () => <HellofriendHeader />,
                  }}
                />
                <Stack.Screen
                  name="UserDetails"
                  component={ScreenUserDetails}
                  options={{
                    headerShown: true,
                    header: () => <HeaderUserDetails />,
                  }}
                />
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
                  name="MomentView"
                  component={ScreenMomentView}
                  options={{
                    headerShown: true,
                    header: () => <HeaderMoment writeView={false} />,
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
                      <HeaderBase
                        headerTitle="Upload"
                        navigateTo="Images"
                        icon="image"
                      />
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
                        icon="coffee"
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
                component={ScreenWelcome}
                options={{
                  headerShown: false,
                  header: () => <HeaderBlank />,
                }}
              />

              <Stack.Screen
                name="Auth"
                component={ScreenAuth}
                options={{
                  headerShown: false,
                  header: () => <HeaderBlank />,
                }}
              />
              <Stack.Screen
                name="RecoverCredentials"
                component={ScreenRecoverCredentials}
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
