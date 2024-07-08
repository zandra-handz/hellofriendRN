// App.js

import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthUserProvider, useAuthUser } from './context/AuthUserContext';
import { GlobalStyleProvider } from './context/GlobalStyleContext';
import { FriendListProvider } from './context/FriendListContext';
import { LocationListProvider } from './context/LocationListContext';
import { UpcomingHelloesProvider } from './context/UpcomingHelloesContext';
import { CapsuleListProvider } from './context/CapsuleListContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SelectedFriendProvider } from './context/SelectedFriendContext';
import * as Font from 'expo-font'; // Import expo-font

// Import screens and components
import SpeedFabView from './speeddial/SpeedFabView';
import FriendSelect from './data/FriendSelect';
import HelloFriendHeader from './components/HelloFriendHeader';
import ScreenOnboardingFlow from './onboarding/ScreenOnboardingFlow';
import ScreenDefaultActionMode from './screens/ScreenDefaultActionMode';
import Tabs from './components/Tabs';
import Signin from './screens/Signin';
import ScreenFriendFocus from './screens/ScreenFriendFocus'; // Import the new screen component
import { View, TextInput, Button, StyleSheet } from 'react-native';

// Load fonts asynchronously
async function loadFonts() {
  await Font.loadAsync({
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Pacifico-Regular': require('./assets/fonts/Pacifico-Regular.ttf'),
    // Add more fonts if needed
  });
}

const Stack = createNativeStackNavigator();

// App component
export default function App() {
  const { onSignOut } = useAuthUser();

  // Load fonts when component mounts
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthUserProvider>
        <GlobalStyleProvider>
          <UpcomingHelloesProvider>
            <FriendListProvider>
              <SelectedFriendProvider>
                <LocationListProvider>
                  <CapsuleListProvider>
                    <Layout />
                  </CapsuleListProvider>
                </LocationListProvider>
              </SelectedFriendProvider>
            </FriendListProvider>
          </UpcomingHelloesProvider>
        </GlobalStyleProvider>
      </AuthUserProvider>
    </GestureHandlerRootView>
  );
}


export const Layout = () => {
  const { authUserState, onSignOut } = useAuthUser();

  const handleSignOutPress = () => {
    console.log("Sign Out button pressed");
    onSignOut();
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide header by default
          cardStyle: { backgroundColor: 'transparent' }, // Set background to transparent for custom transition
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.7, 1],
              }),
              transform: [
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          }),
        }}
      >
        {authUserState?.authenticated && authUserState?.user ? (
          authUserState.user.app_setup_complete ? (
            <>
              <Stack.Screen
                name="hellofriend"
                component={ScreenDefaultActionMode}
                options={{
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="Home"
                component={Tabs}
                options={{
                  header: (props) => (
                    <HelloFriendHeader
                      {...props}
                      handleSignOutPress={handleSignOutPress}
                      additionalElements={[
                        <FriendSelect key="friendSelect" />,
                      ]}
                    />
                  ),
                }}
              /> 
              <Stack.Screen
                name="FriendFocus"
                component={ScreenFriendFocus}
                options={{
                  headerShown: true,
                  title: 'View friend', // Adjust the title as needed
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
          <Stack.Screen name="Signin" component={Signin} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
