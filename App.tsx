import React, { useEffect, createRef } from "react";
import { useFonts } from "expo-font";
import TopLevelNavigationHandler from "./TopLevelNavigationHandler"; // Adjust import path if necessary
import CustomStatusBar from "./app/components/appwide/statusbar/CustomStatusBar";
import {
  useShareIntentContext,
  ShareIntentProvider,
  ShareIntentModule,
  getScheme,
  getShareExtensionKey,
} from "expo-share-intent";

import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";

import Constants from "expo-constants";
import {
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
  getStateFromPath,
} from "@react-navigation/native";
import { Alert, useColorScheme, Platform } from "react-native";
import { MessageContextProvider } from "./src/context/MessageContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider, useUser } from "./src/context/UserContext";
import { GlobalStyleProvider } from "./src/context/GlobalStyleContext";
import { FriendListProvider } from "./src/context/FriendListContext";
import { HelloesProvider } from "./src/context/HelloesContext";
import { LocationsProvider } from "./src/context/LocationsContext";
import { UpcomingHelloesProvider } from "./src/context/UpcomingHelloesContext";
import { CapsuleListProvider } from "./src/context/CapsuleListContext";
import { SelectedFriendProvider } from "./src/context/SelectedFriendContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
// import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

import * as MediaLibrary from "expo-media-library";

import { useGlobalStyle } from "./src/context/GlobalStyleContext";
import ResultMessage from "./app/components/alerts/ResultMessage";
import FullScreenSpinner from "./app/components/appwide/spinner/FullScreenSpinner";

import ScreenOnboardingFlow from "./app/onboarding/ScreenOnboardingFlow";
import ScreenHome from "./app/screens/home/ScreenHome";
import ScreenFriendSettings from "./app/screens/friends/ScreenFriendSettings";
import ScreenPreAdded from "./app/screens/moments/ScreenPreAdded";
import ScreenFinalize from "./app/screens/moments/ScreenFinalize";
import ScreenMoments from "./app/screens/moments/ScreenMoments";
import ScreenImages from "./app/screens/images/ScreenImages";
import ScreenHelloes from "./app/screens/helloes/ScreenHelloes";
import ScreenLocations from "./app/screens/locations/ScreenLocations";
import ScreenLocationSearch from "./app/screens/locations/ScreenLocationSearch";
import ScreenMidpointLocationSearch from "./app/screens/locations/ScreenMidpointLocationSearch";
import ScreenCalculateTravelTimes from "./app/screens/locations/ScreenCalculateTravelTimes";
import ScreenWelcome from "./app/screens/authflow/ScreenWelcome";
import ScreenAuth from "./app/screens/authflow/ScreenAuth";
import ScreenRecoverCredentials from "./app/screens/authflow/ScreenRecoverCredentials";
import ScreenMomentFocus from "./app/screens/moments/ScreenMomentFocus";
import ScreenLocation from "./app/screens/locations/ScreenLocation";

import ScreenUserDetails from "./app/screens/home/ScreenUserDetails";

import ScreenLocationSend from "./app/screens/locations/ScreenLocationSend";
import ScreenLocationEdit from "./app/screens/locations/ScreenLocationEdit";

import ScreenAddFriend from "./app/screens/friends/ScreenAddFriend";
import ScreenAddImage from "./app/screens/images/ScreenAddImage";
import ScreenAddHello from "./app/screens/helloes/ScreenAddHello";
import ScreenAddLocation from "./app/screens/locations/ScreenAddLocation";

import ScreenMomentView from "./app/screens/moments/ScreenMomentView";

// import HellofriendHeader from "./app/components/headers/HellofriendHeader";
// //import HeaderBaseMainTheme from './components/HeaderBaseMainTheme';
// import HeaderHelloes from "./app/components/headers/HeaderHelloes";
// import HeaderImage from "./app/components/headers/HeaderImage";
// import HeaderFriendSettings from "./app/components/headers/HeaderFriendSettings";
// import HeaderUserDetails from "./app/components/headers/HeaderUserDetails";

import HeaderLocation from "./app/components/headers/HeaderLocation";
import HeaderBase from "./app/components/headers/HeaderBase";
import HeaderLocationSingle from "./app/components/headers/HeaderLocationSingle";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import SafeView from "./app/components/appwide/format/SafeView";

// import { RootStackParamList } from "./types";

const queryClient = new QueryClient();

import PhoneStatusBar from "./app/components/appwide/statusbar/PhoneStatusBar";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://59c9aeed4bccc9cfaf418f4733827937@o4509079411752960.ingest.us.sentry.io/4509293682360320",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const Stack = createNativeStackNavigator();

export default Sentry.wrap(function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./app/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./app/assets/fonts/Poppins-Bold.ttf"),
    "Roboto-Regular": require("./app/assets/fonts/Roboto-Regular.ttf"),
  });

  SplashScreen.preventAutoHideAsync();

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
        permissionsGranted = true;
      }
    }

    requestPermissions();
  }, [hasShareIntent, shareIntent]);

  useEffect(() => {
    // const fetchFonts = async () => {
    //   await loadFonts();
    //   setFontsLoaded(true);
    // };

    // fetchFonts();

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;

    //     (
    //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //     <Text style={{ fontSize: 20 }}>Loading...</Text>
    //   </View>
    // );
  }

  return (
    <ShareIntentProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <GlobalStyleProvider>
              <UpcomingHelloesProvider>
                <FriendListProvider>
                  <SelectedFriendProvider>
                    <LocationsProvider>
                      <PhoneStatusBar />
                      <CapsuleListProvider>
                        <HelloesProvider>
                          <MessageContextProvider>
                            <SafeAreaProvider>
                              {/* <SafeView  // in screen components instead
                                style={{
                                  flex: 1,
                                  backgroundColor: "transparent",
                                }}
                              > */}
                              <Layout />
                              {/* </SafeView> */}
                            </SafeAreaProvider>
                          </MessageContextProvider>
                        </HelloesProvider>
                      </CapsuleListProvider>
                    </LocationsProvider>
                  </SelectedFriendProvider>
                </FriendListProvider>
              </UpcomingHelloesProvider>
            </GlobalStyleProvider>
          </UserProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ShareIntentProvider>
  );
});

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
  const { isAuthenticated, user } = useUser();

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <ResultMessage />
      <CustomStatusBar />

      <TopLevelNavigationHandler>
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
          {isAuthenticated ? (
            user.app_setup_complete || !user.app_setup_complete ? (
              <>
                <Stack.Screen
                  name="hellofriend"
                  component={ScreenHome}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="UserDetails"
                  component={ScreenUserDetails}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="FriendFocus"
                  component={ScreenFriendSettings}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="MomentFocus"
                  component={ScreenMomentFocus}
                  options={{
                    gestureEnabled: false,
                    animation: "none",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Moments"
                  component={ScreenMoments}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="PreAdded"
                  component={ScreenPreAdded}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Finalize"
                  component={ScreenFinalize}
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="MomentView"
                  component={ScreenMomentView}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Images"
                  component={ScreenImages}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Helloes"
                  component={ScreenHelloes}
                  options={{
                    headerShown: false,
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
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="AddHello"
                  component={ScreenAddHello}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="AddFriend"
                  component={ScreenAddFriend}
                  options={{
                    headerShown: false,
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
                }}
              />

              <Stack.Screen
                name="Auth"
                component={ScreenAuth}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="RecoverCredentials"
                component={ScreenRecoverCredentials}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </TopLevelNavigationHandler>
    </NavigationContainer>
  );
};
