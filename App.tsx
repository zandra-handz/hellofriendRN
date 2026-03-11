import React, { useEffect, createRef, useRef } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFont } from "@shopify/react-native-skia";
import ScreenHistory from "./app/screens/helloes/ScreenHistory";
import { requestImagePermission } from "./src/hooks/util_requestImagePermissions";
import QuickActionsHandler from "./src/handlers/QuickActionsHandler";
import ShareIntentHandler from "./src/handlers/ShareIntentHandler";
import AutoSelectFriendHandler from "./src/handlers/AutoSelectFriendHandler";
import CustomStatusBar from "./app/components/appwide/statusbar/CustomStatusBar";

import { View, Text } from "react-native";
import {
  useShareIntentContext,
  ShareIntentProvider,
  ShareIntentModule,
  getScheme,
  getShareExtensionKey,
} from "expo-share-intent";

import {
  showSpinner,
  hideSpinner,
} from "./app/components/appwide/button/showSpinner";
import LocalSolidSpinner from "./app/components/appwide/spinner/LocalSolidSpinner";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";
import useNotificationsRegistration from "./src/hooks/useNotificationsRegistration";
import Constants from "expo-constants";
import {
  NavigationContainer,
  getStateFromPath,
} from "@react-navigation/native";

import { FriendCategoryColorsProvider } from "./src/context/FriendCategoryColorsContext";

import { RootSiblingParent } from "react-native-root-siblings";
import { Alert, Platform } from "react-native";
import { DeviceLocationProvider } from "./src/context/DeviceLocationContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import useTopLevelUserSettings from "./src/hooks/useTopLevelUserSettings";

import { LDThemeProvider } from "./src/context/LDThemeContext";

import { CategoryColorsProvider } from "./src/context/CategoryColorsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

import * as MediaLibrary from "expo-media-library";
import useUser from "./src/hooks/useUser";
import PeacefulGradientSpinner from "./app/components/appwide/spinner/PeacefulGradientSpinner";
import ScreenHome from "./app/screens/home/ScreenHome";
import ScreenCategories from "./app/screens/home/ScreenCategories";
import ScreenFriendHome from "./app/screens/home/ScreenFriendHome";
import ScreenPreAdded from "./app/screens/moments/ScreenPreAdded";
import ScreenFinalize from "./app/screens/moments/ScreenFinalize";
import ScreenReload from "./app/screens/helloes/ScreenReload";
import ScreenMoments from "./app/screens/moments/ScreenMoments";
import ScreenHelloes from "./app/screens/helloes/ScreenHelloes";
import ScreenLocationSearch from "./app/screens/locations/ScreenLocationSearch";
import ScreenMidpointLocationSearch from "./app/screens/locations/ScreenMidpointLocationSearch";

import ScreenWelcome from "./app/screens/authflow/ScreenWelcome";
import ScreenAuth from "./app/screens/authflow/ScreenAuth";
import ScreenRecoverCredentials from "./app/screens/authflow/ScreenRecoverCredentials";
import ScreenMomentFocus from "./app/screens/moments/ScreenMomentFocus";

import ScreenLocationCreate from "./app/screens/locations/ScreenLocationCreate";
import ScreenLocationEdit from "./app/screens/locations/ScreenLocationEdit";

import ScreenLocationSend from "./app/screens/locations/ScreenLocationSend";

import ScreenAddFriend from "./app/screens/friends/ScreenAddFriend";
import ScreenAddImage from "./app/screens/images/ScreenAddImage";
import ScreenAddHello from "./app/screens/helloes/ScreenAddHello";

import ScreenFidget from "./app/screens/fidget/ScreenFidget";

import ScreenGecko from "./app/screens/fidget/ScreenGecko";
import ScreenGeckoSelectSettings from "./app/screens/moments/ScreenGeckoSelectSettings";

import ScreenMomentView from "./app/screens/moments/ScreenMomentView";
import ScreenHelloView from "./app/screens/helloes/ScreenHelloView";
import ScreenImageView from "./app/screens/images/ScreenImageView";
import ScreenSelectFriend from "./app/screens/friends/ScreenSelectFriend";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import * as Sentry from "@sentry/react-native";
import ScreenQRCode from "./app/screens/fidget/ScreenQRCode";

Sentry.init({
  dsn: "https://59c9aeed4bccc9cfaf418f4733827937@o4509079411752960.ingest.us.sentry.io/4509293682360320",
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

const Stack = createNativeStackNavigator();
const navigationRef = createRef();


SplashScreen.preventAutoHideAsync(); // top of file, outside App()



export default Sentry.wrap(function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const skiaFontLarge = useFont(Poppins_400Regular, 34);
  const skiaFontSmall = useFont(Poppins_400Regular, 14);

  

  // SplashScreen.preventAutoHideAsync(); moved out of component

  // const { hasShareIntent, shareIntent } = useShareIntentContext();

  // useEffect(() => {
  //   async function requestPermissions() {
  //     if (Platform.OS === "android" && Platform.Version >= 33) {
  //       await MediaLibrary.requestPermissionsAsync();
  //     }
  //   }
  //   requestPermissions();
  // }, [hasShareIntent, shareIntent]);

  // useEffect(() => {
  //   async function requestPermissions() {
  //     if (Platform.OS === "android" && Platform.Version >= 33) {
  //       await MediaLibrary.requestPermissionsAsync();
  //     }
  //   }
  //   requestPermissions();
  // }, [hasShareIntent, shareIntent]);

  useEffect(() => {
    async function requestPermissions() {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        await MediaLibrary.requestPermissionsAsync();
      }
      await requestImagePermission();
    }
    requestPermissions();
  }, []);

  useEffect(() => {
    const notificationSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        Alert.alert(
          notification.request.content.title,
          notification.request.content.body,
        );
      });
    return () => notificationSubscription.remove();
  }, []);

  const allFontsLoaded = fontsLoaded && skiaFontLarge && skiaFontSmall;


  // inside useEffect:
useEffect(() => {
  if (allFontsLoaded) {
    SplashScreen.hideAsync();
  } else {
    // fallback: hide after 5s no matter what
    const t = setTimeout(() => SplashScreen.hideAsync(), 5000);
    return () => clearTimeout(t);
  }
}, [allFontsLoaded]);


  // useEffect(() => {
  //   if (allFontsLoaded) {
  //     console.log("all fonts loaded");
  //     SplashScreen.hideAsync();
  //   } else {
  //     console.log("fonts not loaded yet");
  //   }
  // }, [allFontsLoaded]);

  // if (!allFontsLoaded) {
  //   return null;
  // }

  return (
    <ShareIntentProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <DeviceLocationProvider>
              <LDThemeProvider>
                <RootSiblingParent>
                  <Layout
                    skiaFontLarge={skiaFontLarge}
                    skiaFontSmall={skiaFontSmall}
                  />
                </RootSiblingParent>
              </LDThemeProvider>
            </DeviceLocationProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ShareIntentProvider>
  );
});

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
  },
  config: {
    initialRouteName: "Home",
    screens: {
      Home: "home",
    },
  },
  getStateFromPath(path, config) {
    if (path.includes(`dataUrl=${getShareExtensionKey()}`)) {
      console.debug(
        "react-navigation[getStateFromPath] redirect to ShareIntent screen",
      );
      return {
        routes: [{ name: "home" }],
      };
    }
    return getStateFromPath(path, config);
  },
  subscribe(listener) {
    console.debug("react-navigation[subscribe]", PREFIX, PACKAGE_NAME);
    const onReceiveURL = ({ url }) => {
      if (url.includes(getShareExtensionKey())) {
        console.debug(
          "react-navigation[onReceiveURL] Redirect to ShareIntent-- NOW HOME-- Screen",
          url,
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
        console.debug(
          "react-navigation[subscribe] shareIntentStateListener",
          event.value,
        );
        if (event.value === "pending") {
          listener(`${getScheme()}://home`);
        }
      },
    );
    const shareIntentValueSubscription = ShareIntentModule?.addListener(
      "onChange",
      async (event) => {
        console.debug(
          "react-navigation[subscribe] shareIntentValueListener",
          event.value,
        );
        const url = await Linking.getInitialURL();
        if (url) {
          onReceiveURL({ url });
        }
      },
    );

    const urlEventSubscription = Linking.addEventListener("url", onReceiveURL);
    return () => {
      shareIntentStateSubscription?.remove();
      shareIntentValueSubscription?.remove();
      urlEventSubscription.remove();
    };
  },
  async getInitialURL() {
    console.debug("react-navigation[getInitialURL] ?");
    const needRedirect = ShareIntentModule?.hasShareIntent(
      getShareExtensionKey(),
    );
    console.debug(
      "react-navigation[getInitialURL] redirect to ShareIntent screen:",
      needRedirect,
    );
    if (needRedirect) {
      return `${Constants.expoConfig?.scheme}://home`;
    }
    const url = await Linking.getLinkingURL();
    return url;
  },
};

import { useLDTheme } from "./src/context/LDThemeContext";
import { useSelectedFriend } from "./src/context/SelectedFriendContext";

// const SelectedFriendNavigator = ({ skiaFontLarge, skiaFontSmall }) => {
//   const { selectedFriend } = useSelectedFriend();
//   const { lightDarkTheme } = useLDTheme();
//   const previousBranchRef = useRef<"home" | "friend" | null>(null);

//   // if (!selectedFriend?.isReady) {
//   //   showSpinner(lightDarkTheme.primaryBackground);
//   //   return null;
//   // }

// if (!selectedFriend?.isReady) {
//   showSpinner(lightDarkTheme.primaryBackground);
//   return (
//     <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>SPINNER MISSING</Text>
//     </View>
//   );
// }

//   const currentBranch: "home" | "friend" = selectedFriend?.id
//     ? "friend"
//     : "home";

//   const shouldDelayAnimation =
//     previousBranchRef.current === null ||
//     previousBranchRef.current !== currentBranch;

//   previousBranchRef.current = currentBranch;
 

//   if (selectedFriend.isReady) {
//     hideSpinner();
//   }

//   if (selectedFriend?.isReady && !selectedFriend?.id) {
//     hideSpinner();
//     return (
//       <FriendCategoryColorsProvider>
//         <Stack.Navigator
//           screenOptions={{
//             contentContainerStyle: { flexGrow: 1 },
//             cardStyle: { backgroundColor: "#000002" },
//           }}
//         >
//           <Stack.Screen name="hellofriend" options={{ headerShown: false }}>
//             {(props) => (
//               <ScreenHome
//                 {...props}
//                 skiaFontLarge={skiaFontLarge}
//                 skiaFontSmall={skiaFontSmall}
//                 shouldDelayAnimation={shouldDelayAnimation}
//               />
//             )}
//           </Stack.Screen>
//           <Stack.Screen
//             name="Categories"
//             component={ScreenCategories}
//             options={{ gestureEnabled: false, headerShown: false }}
//           />
//         </Stack.Navigator>
//       </FriendCategoryColorsProvider>
//     );
//   }

//   hideSpinner();
//   return (
//     <FriendCategoryColorsProvider>
//       <Stack.Navigator
//         screenOptions={{
//           contentContainerStyle: { flexGrow: 1 },
//           cardStyle: { backgroundColor: "#000002" },
//         }}
//       >
//         <Stack.Screen
//           name="FriendHome"
//           options={{ headerShown: false, animation: "none" }}
//         >
//           {(props) => (
//             <ScreenFriendHome
//               {...props}
//               skiaFontLarge={skiaFontLarge}
//               skiaFontSmall={skiaFontSmall}
//               shouldDelayAnimation={shouldDelayAnimation}
//             />
//           )}
//         </Stack.Screen>
//         <Stack.Screen
//           name="Gecko"
//           options={{ headerShown: false, gestureEnabled: false }}
//         >
//           {(props) => (
//             <ScreenGecko
//               {...props}
//               skiaFontLarge={skiaFontLarge}
//               skiaFontSmall={skiaFontSmall}
//             />
//           )}
//         </Stack.Screen>
//         <Stack.Screen
//           name="GeckoSelectSettings"
//           component={ScreenGeckoSelectSettings}
//           options={{ headerShown: false, gestureEnabled: false }}
//         />
//         <Stack.Screen
//           name="QRCode"
//           component={ScreenQRCode}
//           options={{ headerShown: false, gestureEnabled: false }}
//         />
//         <Stack.Screen
//           name="MomentFocus"
//           component={ScreenMomentFocus}
//           options={{ gestureEnabled: false, headerShown: false }}
//         />
//         <Stack.Screen
//           name="Moments"
//           component={ScreenMoments}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="PreAdded"
//           component={ScreenPreAdded}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Finalize"
//           component={ScreenFinalize}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Reload"
//           component={ScreenReload}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MomentView"
//           component={ScreenMomentView}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="ImageView"
//           component={ScreenImageView}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="History"
//           component={ScreenHistory}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Helloes"
//           component={ScreenHelloes}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HelloView"
//           component={ScreenHelloView}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="LocationSend"
//           component={ScreenLocationSend}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="LocationEdit"
//           component={ScreenLocationEdit}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="LocationCreate"
//           component={ScreenLocationCreate}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="LocationSearch"
//           component={ScreenLocationSearch}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MidpointLocationSearch"
//           component={ScreenMidpointLocationSearch}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="AddImage"
//           component={ScreenAddImage}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="AddHello"
//           component={ScreenAddHello}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="SelectFriend"
//           component={ScreenSelectFriend}
//           options={{
//             headerShown: false,
//             gestureEnabled: false,
//             animation: "none",
//           }}
//         />
//         <Stack.Screen
//           name="AddFriend"
//           component={ScreenAddFriend}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Fidget"
//           component={ScreenFidget}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </FriendCategoryColorsProvider>
//   );
// };

const SelectedFriendNavigator = ({ skiaFontLarge, skiaFontSmall }) => {
  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();
  const previousBranchRef = useRef<"home" | "friend" | null>(null);

  useEffect(() => {
    if (!selectedFriend?.isReady) {
      showSpinner(lightDarkTheme.primaryBackground);
    } else {
      hideSpinner();
    }
  }, [selectedFriend?.isReady]);

const spinnerShownRef = useRef(false);

if (!selectedFriend?.isReady) {
  if (!spinnerShownRef.current) {
    spinnerShownRef.current = true;
    // This is fine — showSpinner doesn't setState on *this* component
    showSpinner(lightDarkTheme.primaryBackground);
  }
  return (
    <View style={{ flex: 1, backgroundColor: lightDarkTheme.primaryBackground }} />
  );
}

spinnerShownRef.current = false;

  const currentBranch: "home" | "friend" = selectedFriend?.id ? "friend" : "home";

  const shouldDelayAnimation =
    previousBranchRef.current === null ||
    previousBranchRef.current !== currentBranch;

  previousBranchRef.current = currentBranch;

  if (!selectedFriend?.id) {
    return (
      <FriendCategoryColorsProvider>
        <Stack.Navigator
          screenOptions={{
            contentContainerStyle: { flexGrow: 1 },
            cardStyle: { backgroundColor: "#000002" },
          }}
        >
          <Stack.Screen name="hellofriend" options={{ headerShown: false }}>
            {(props) => (
              <ScreenHome
                {...props}
                skiaFontLarge={skiaFontLarge}
                skiaFontSmall={skiaFontSmall}
                shouldDelayAnimation={shouldDelayAnimation}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Categories"
            component={ScreenCategories}
            options={{ gestureEnabled: false, headerShown: false }}
          />
        </Stack.Navigator>
      </FriendCategoryColorsProvider>
    );
  }

  return (
    <FriendCategoryColorsProvider>
      <Stack.Navigator
        screenOptions={{
          contentContainerStyle: { flexGrow: 1 },
          cardStyle: { backgroundColor: "#000002" },
        }}
      >
        <Stack.Screen
          name="FriendHome"
          options={{ headerShown: false, animation: "none" }}
        >
          {(props) => (
            <ScreenFriendHome
              {...props}
              skiaFontLarge={skiaFontLarge}
              skiaFontSmall={skiaFontSmall}
              shouldDelayAnimation={shouldDelayAnimation}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Gecko"
          options={{ headerShown: false, gestureEnabled: false }}
        >
          {(props) => (
            <ScreenGecko
              {...props}
              skiaFontLarge={skiaFontLarge}
              skiaFontSmall={skiaFontSmall}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="GeckoSelectSettings"
          component={ScreenGeckoSelectSettings}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="QRCode"
          component={ScreenQRCode}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="MomentFocus"
          component={ScreenMomentFocus}
          options={{ gestureEnabled: false, headerShown: false }}
        />
        <Stack.Screen
          name="Moments"
          component={ScreenMoments}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PreAdded"
          component={ScreenPreAdded}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Finalize"
          component={ScreenFinalize}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reload"
          component={ScreenReload}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MomentView"
          component={ScreenMomentView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImageView"
          component={ScreenImageView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={ScreenHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Helloes"
          component={ScreenHelloes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HelloView"
          component={ScreenHelloView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocationSend"
          component={ScreenLocationSend}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocationEdit"
          component={ScreenLocationEdit}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocationCreate"
          component={ScreenLocationCreate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocationSearch"
          component={ScreenLocationSearch}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MidpointLocationSearch"
          component={ScreenMidpointLocationSearch}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddImage"
          component={ScreenAddImage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddHello"
          component={ScreenAddHello}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectFriend"
          component={ScreenSelectFriend}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="AddFriend"
          component={ScreenAddFriend}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Fidget"
          component={ScreenFidget}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </FriendCategoryColorsProvider>
  );
};

export const Layout = ({ skiaFontLarge, skiaFontSmall }) => {
  const { user, isInitializing, userIsPending, refetch } = useUser();
  const { settings } = useTopLevelUserSettings({
    userId: user?.id,
    isInitializing: isInitializing,
  });

  const { setManualDarkMode, lightDarkTheme } = useLDTheme();

  useEffect(() => {
    if (settings?.manual_dark_mode !== undefined) {
      setManualDarkMode(settings.manual_dark_mode);
    }
  }, [settings?.manual_dark_mode]);

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
      <CustomStatusBar manualDarkMode={settings?.manual_dark_mode} />

      {user?.id && !isInitializing ? (
        <>
          <QuickActionsHandler
            userId={user?.id}
            settings={settings}
            navigationRef={navigationRef}
          />

          <ShareIntentHandler />
          <CategoryColorsProvider>
            <AutoSelectFriendHandler userId={user?.id} settings={settings} />
            <SelectedFriendNavigator
              skiaFontLarge={skiaFontLarge}
              skiaFontSmall={skiaFontSmall}
            />
          </CategoryColorsProvider>
        </>
      ) : userIsPending ? (
        <PeacefulGradientSpinner />
      ) : (
        <Stack.Navigator
          screenOptions={{
            contentContainerStyle: { flexGrow: 1 },
            cardStyle: { backgroundColor: "#000002" },
          }}
        >
          <Stack.Screen
            name="Welcome"
            component={ScreenWelcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Auth" options={{ headerShown: false }}>
            {(props) => <ScreenAuth {...props} onAuthSuccess={refetch} />}
          </Stack.Screen>
          <Stack.Screen
            name="RecoverCredentials"
            component={ScreenRecoverCredentials}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
