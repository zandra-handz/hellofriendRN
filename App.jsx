import React, { useEffect, useState } from "react";

import TopLevelNavigationHandler from "./TopLevelNavigationHandler"; // Adjust import path if necessary
import { Alert, View, Text, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MessageContextProvider } from "./context/MessageContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthUserProvider, useAuthUser } from "./context/AuthUserContext";
import { GlobalStyleProvider } from "./context/GlobalStyleContext";
import { FriendListProvider } from "./context/FriendListContext";
import { HelloesProvider } from "./context/HelloesContext";
import { UpcomingHelloesProvider } from "./context/UpcomingHelloesContext";
import { CapsuleListProvider } from "./context/CapsuleListContext";
import { SelectedFriendProvider } from "./context/SelectedFriendContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
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
import Signin from "./screens/Signin";
import ScreenMomentFocus from "./screens/ScreenMomentFocus";
import ScreenLocation from "./screens/ScreenLocation";

import ScreenLocationSend from "./screens/ScreenLocationSend";
import ScreenLocationEdit from "./screens/ScreenLocationEdit";
import ScreenLocationSave from "./screens/ScreenLocationSave";

import ScreenAddFriend from "./screens/ScreenAddFriend";
import ScreenAddImage from "./screens/ScreenAddImage";
import ScreenAddHello from "./screens/ScreenAddHello";

import HellofriendHeader from "./components/HellofriendHeader";
//import HeaderBaseMainTheme from './components/HeaderBaseMainTheme';
import HeaderWriteMoment from "./components/HeaderWriteMoment";
import HeaderFriendSettings from "./components/HeaderFriendSettings";
import HeaderBase from "./components/HeaderBase";
import HeaderBaseSolid from "./components/HeaderBaseSolid";
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthUserProvider>
          <GlobalStyleProvider>
            <UpcomingHelloesProvider>
              <FriendListProvider>
                <SelectedFriendProvider>
                  <PhoneStatusBar />
                  <CapsuleListProvider>
                    <MessageContextProvider>
                      <Layout />
                    </MessageContextProvider>
                  </CapsuleListProvider>
                </SelectedFriendProvider>
              </FriendListProvider>
            </UpcomingHelloesProvider>
          </GlobalStyleProvider>
        </AuthUserProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export const Layout = () => {
  const { themeStyles } = useGlobalStyle();
  const { authUserState } = useAuthUser();

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
            authUserState.user.app_setup_complete ? (
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
                    header: () => <HeaderWriteMoment />,
                  }}
                />
                <Stack.Screen
                  name="Moments"
                  component={ScreenMoments}
                  options={{
                    headerShown: true,
                    header: () => <HeaderBase headerTitle="Moments" />,
                  }}
                />
                <Stack.Screen
                  name="Images"
                  component={ScreenImages}
                  options={{
                    headerShown: true,
                    header: () => <HeaderBase headerTitle="Images" />,
                  }}
                />
                <Stack.Screen
                  name="Helloes"
                  component={ScreenHelloes}
                  options={{
                    headerShown: true,
                    header: () => <HeaderBaseSolid headerTitle="Helloes" />,
                  }}
                />
                <Stack.Screen
                  name="Locations"
                  component={ScreenLocations}
                  options={{
                    headerMode: "screen",
                    headerShown: true,
                    header: () => <HeaderBaseSolid headerTitle="Locations" />,
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
                  component={ScreenLocationSave}
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
            <Stack.Screen
              name="Signin"
              component={Signin}
              options={{
                headerShown: false,
              }}
            />
          )}
        </Stack.Navigator>
      </TopLevelNavigationHandler>
    </NavigationContainer>
  );
};
