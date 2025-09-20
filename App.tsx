import React, { useEffect, createRef } from "react";
// import * as QuickActions from "expo-quick-actions";
import { useFonts } from "expo-font";
import TopLevelNavigationHandler from "./src/handlers/TopLevelNavigationHandler";
import QuickActionsHandler from "./src/handlers/QuickActionsHandler";
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
import useNotificationsRegistration from "./src/hooks/useNotificationsRegistration";
import Constants from "expo-constants";
import {
  NavigationContainer,
  getStateFromPath,
  useNavigation,
} from "@react-navigation/native";

import ScreenShareIntent from "./app/screens/authflow/ScreenShareIntent";
import ScreenNewAccount from "./app/screens/authflow/ScreenNewAccount";
import { RootSiblingParent } from "react-native-root-siblings";
import { Alert, useColorScheme, Platform } from "react-native";
import { DeviceLocationProvider } from "./src/context/DeviceLocationContext";
// import { MessageContextProvider } from "./src/context/MessageContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider, useUser } from "./src/context/UserContext";
import {
  UserSettingsProvider,
  useUserSettings,
} from "./src/context/UserSettingsContext";

import { UserStatsProvider } from "./src/context/UserStatsContext";

import { FriendListProvider } from "./src/context/FriendListContext";
import { FriendStyleProvider } from "./src/context/FriendStyleContext";
import { HelloesProvider } from "./src/context/HelloesContext";
import { LocationsProvider } from "./src/context/LocationsContext";
import { LDThemeProvider } from "./src/context/LDThemeContext";
// import { FriendLocationsProvider } from "./src/context/FriendLocationsContext";
import { UpcomingHelloesProvider } from "./src/context/UpcomingHelloesContext";
import { CategoriesProvider } from "./src/context/CategoriesContext";
import { CapsuleListProvider } from "./src/context/CapsuleListContext";
import { SelectedFriendProvider } from "./src/context/SelectedFriendContext";
import { FriendDashProvider } from "./src/context/FriendDashContext";
import { SelectedFriendStatsProvider } from "./src/context/SelectedFriendStatsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
// import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

import * as MediaLibrary from "expo-media-library";

// import { useGlobalStyle } from "./src/context/GlobalStyleContext";
// import { useLDTheme } from "./src/context/LDThemeContext";
// import ResultMessage from "./app/components/alerts/ResultMessage";

import FSMainSpinner from "./app/components/appwide/spinner/FSMainSpinner";
import ScreenHome from "./app/screens/home/ScreenHome";
import ScreenPreAdded from "./app/screens/moments/ScreenPreAdded";
import ScreenFinalize from "./app/screens/moments/ScreenFinalize";
import ScreenReload from "./app/screens/helloes/ScreenReload";
import ScreenMoments from "./app/screens/moments/ScreenMoments";
// import ScreenImages from "./app/screens/images/ScreenImages"; // REINSTATE
import ScreenHelloes from "./app/screens/helloes/ScreenHelloes";
// import ScreenLocationNav from "./app/screens/locations/ScreenLocationNav";
// import ScreenLocations from "./app/screens/locations/ScreenLocations";
import ScreenLocationSearch from "./app/screens/locations/ScreenLocationSearch";
import ScreenMidpointLocationSearch from "./app/screens/locations/ScreenMidpointLocationSearch";
import ScreenCalculateTravelTimes from "./app/screens/locations/ScreenCalculateTravelTimes";
import ScreenWelcome from "./app/screens/authflow/ScreenWelcome";
import ScreenAuth from "./app/screens/authflow/ScreenAuth";
import ScreenRecoverCredentials from "./app/screens/authflow/ScreenRecoverCredentials";
import ScreenMomentFocus from "./app/screens/moments/ScreenMomentFocus";

// Don't think I am using
// import ScreenUserDetails from "./app/screens/home/ScreenUserDetails";

import ScreenLocationCreate from "./app/screens/locations/ScreenLocationCreate";
import ScreenLocationEdit from "./app/screens/locations/ScreenLocationEdit";

import ScreenLocationSend from "./app/screens/locations/ScreenLocationSend";

import ScreenAddFriend from "./app/screens/friends/ScreenAddFriend";
import ScreenAddImage from "./app/screens/images/ScreenAddImage";
import ScreenAddHello from "./app/screens/helloes/ScreenAddHello";

import ScreenFidget from "./app/screens/fidget/ScreenFidget";

//DELETE
// import ScreenAddLocation from "./app/screens/locations/ScreenAddLocation";

import ScreenMomentView from "./app/screens/moments/ScreenMomentView";
import ScreenHelloView from "./app/screens/helloes/ScreenHelloView";
import ScreenImageView from "./app/screens/images/ScreenImageView";
import ScreenLocationView from "./app/screens/locations/ScreenLocationView";
import ScreenUnsavedLocationView from "./app/screens/locations/ScreenUnsavedLocationView";

import ScreenSelectFriend from "./app/screens/friends/ScreenSelectFriend";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
4;

import { NativeEventEmitter, NativeModules } from "react-native";

const queryClient = new QueryClient();

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
const navigationRef = createRef();

export default Sentry.wrap(function App() {
  // export default function App() {
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

  // useEffect(() => {
  //   // Define the home screen quick actions
  //   QuickActions.setItems([
  //     {
  //       id: "moments",
  //       title: "Next up",
  //       subtitle: "Go to ideas for next up",
  //       icon: "heart",
  //       params: { screen: "Moments" },
  //     },
  //     {
  //       id: "momentFocus",
  //       title: "Add idea",
  //       subtitle: "Add a new idea",
  //       icon: "star",
  //       params: { screen: "MomentFocus" },
  //     },
  //   ]);

  //   // Listen for quick action presses
  //   const subscription = QuickActions.addListener((action) => {
  //     if (!action) return;

  //     switch (action.id) {
  //       case "moments":
  //         navigationRef.current?.navigate("Moments");
  //         break;
  //       case "momentFocus":
  //         navigationRef.current?.navigate("MomentFocus");
  //         break;
  //     }
  //   });

  //   return () => subscription.remove();
  // }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ShareIntentProvider>

    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UserSettingsProvider>
          <FriendListProvider>
            <UpcomingHelloesProvider>
              <CategoriesProvider>
                <UserStatsProvider>
                  <SelectedFriendProvider>
                    <FriendDashProvider>
                      <CapsuleListProvider>
                        <LocationsProvider>
                          <HelloesProvider>
                            <SelectedFriendStatsProvider>
                              {/* <MessageContextProvider> */}
                              <GestureHandlerRootView style={{ flex: 1 }}>
                                <SafeAreaProvider>
                                  <LDThemeProvider>
                                    <RootSiblingParent>
                                      <DeviceLocationProvider>
                                        <FriendStyleProvider>
                                          <Layout />
                                        </FriendStyleProvider>
                                      </DeviceLocationProvider>
                                    </RootSiblingParent>
                                  </LDThemeProvider>
                                </SafeAreaProvider>
                              </GestureHandlerRootView>
                              {/* </MessageContextProvider> */}
                            </SelectedFriendStatsProvider>
                          </HelloesProvider>
                        </LocationsProvider>
                      </CapsuleListProvider>
                    </FriendDashProvider>
                  </SelectedFriendProvider>
                </UserStatsProvider>
              </CategoriesProvider>
            </UpcomingHelloesProvider>
          </FriendListProvider>
        </UserSettingsProvider>
      </UserProvider>
    </QueryClientProvider>
    </ShareIntentProvider>
  );
  // };
});

// Linking setup for deep linking and share intents
const PREFIX = Linking.createURL("/");

const PACKAGE_NAME =
  Constants.expoConfig?.android?.package ||
  Constants.expoConfig?.ios?.bundleIdentifier;

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

 
const emitter = new NativeEventEmitter(ShareIntentModule);
 
 

export const Layout = () => { 
  // const emitter = new NativeEventEmitter(ShareIntentModule);

  // useEffect(() => {
  //   const sub = emitter.addListener("onShareReceived", (data) => {
  //     console.log("Shared data:", data);
  //     // Navigate into your ShareIntent screen here
  //   });
  //   return () => sub.remove();
  // }, []);

  // useEffect(() => {
  //     const handleUrl = ({ url }: { url: string }) => {
  //       console.log("App opened via intent:", url);
  //       if (url.includes("share") && navigationRef.current?.isReady()) {
  //         navigationRef.current.navigate("ShareIntent", { sharedUrl: url });
  //       }
  //     };

  //     const subscription = Linking.addEventListener("url", handleUrl);

  //     Linking.getInitialURL().then((url) => {
  //       const tryNavigate = () => {
  //         if (url && navigationRef.current?.isReady()) {
  //           handleUrl({ url });
  //         } else {
  //           setTimeout(tryNavigate, 50);
  //         }
  //       };
  //       tryNavigate();
  //     });

  //     return () => subscription.remove();
  //   }, []);

  // ===== TEST NAVIGATION AFTER 5 SECONDS =====
  // const testTimeout = setTimeout(() => {
  //   const testUrl = "myapp://share/test"; // fake share URL
  //   console.log("Test: firing handleUrl with", testUrl);
  //   handleUrl({ url: testUrl });
  // }, 5000);

  //   return () => {
  //     subscription.remove();
  //     clearTimeout(testTimeout);
  //   };
  // }, []);

  // const { lightDarkTheme} = useLDTheme();
  const { user, isInitializing } = useUser();

  // console.warn('LAYOUT RERENDERED');
  const { settings } = useUserSettings();
  // const manualDarkMode = settings?.manual_dark_mode;

  const receiveNotifications =
    settings?.receive_notifications === true
      ? true
      : settings?.receive_notifications === false
        ? false
        : "not ready";

  const expoPushToken =
    settings?.expo_push_token === null
      ? null
      : settings?.expo_push_token === undefined
        ? "not ready"
        : settings.expo_push_token;

  useNotificationsRegistration({ receiveNotifications, expoPushToken });

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <FSMainSpinner isInitializing={isInitializing} />
      <CustomStatusBar manualDarkMode={settings?.manual_dark_mode} />
      <QuickActionsHandler navigationRef={navigationRef} />
      <TopLevelNavigationHandler
        userId={user?.id}
        isInitializing={isInitializing}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerMode: "screen",
            // headerStyle: lightDarkTheme.header,
            // headerTintColor: lightDarkTheme.headerTextColor,
            contentContainerStyle: { flexGrow: 1 },
            cardStyle: { backgroundColor: "#000002" },
          }}
        >
          {user?.id ? (
            // user.app_setup_complete || !user.app_setup_complete ? (
            <>
              <Stack.Screen
                name="hellofriend"
                component={ScreenHome}
                options={{
                  headerShown: false,
                }}
              />
              {/* <Stack.Screen
                name="UserDetails"
                component={ScreenUserDetails}
                options={{
                  headerShown: false,
                }}
              /> */}

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
                name="Reload"
                component={ScreenReload}
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
              {/* REINSTATE
               <Stack.Screen
                name="Images"
                component={ScreenImages}
                options={{
                  headerShown: false,
                }}
              /> */}
              <Stack.Screen
                name="ImageView"
                component={ScreenImageView}
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
                name="HelloView"
                component={ScreenHelloView}
                options={{
                  headerShown: false,
                }}
              />
              {/* <Stack.Screen
                name="Locations"
                component={ScreenLocations}
                options={{
                  headerMode: "screen",
                  headerShown: false,
                  // header: () => <HeaderLocation headerTitle="Locations" />,
                }}
              /> */}
              <Stack.Screen
                name="LocationView"
                component={ScreenLocationView}
                options={{
                  headerMode: "screen",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UnsavedLocationView"
                component={ScreenUnsavedLocationView}
                options={{
                  headerMode: "screen",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LocationSend"
                component={ScreenLocationSend}
                options={({ route }) => ({
                  headerShown: false,
                })}
              />
              <Stack.Screen
                name="LocationEdit"
                component={ScreenLocationEdit}
                options={() => ({
                  headerShown: false,
                })}
              />
              <Stack.Screen
                name="LocationCreate"
                component={ScreenLocationCreate}
                options={() => ({
                  headerShown: false,
                })}
              />
              {/* <Stack.Screen
                  name="LocationSave"
                  component={ScreenAddLocation}
                  options={() => ({
                    headerShown: true,
                    header: () => (
                      <HeaderBase
                        headerTitle="Save Location"
                        icon="heartbeat"
                        navigateTo="LocationSearch"
                      />
                    ),
                  })}
                /> */}
              <Stack.Screen
                name="LocationSearch"
                component={ScreenLocationSearch}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="MidpointLocationSearch"
                component={ScreenMidpointLocationSearch}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="CalculateTravelTimes"
                component={ScreenCalculateTravelTimes}
                options={{
                  headerShown: false,
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
                name="SelectFriend"
                component={ScreenSelectFriend}
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
              <Stack.Screen
                name="Fidget"
                component={ScreenFidget}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ShareIntent"
                component={ScreenShareIntent}
                options={{
                  headerShown: false,
                }}
              />
            </>
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
                name="NewAccount"
                component={ScreenNewAccount}
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
