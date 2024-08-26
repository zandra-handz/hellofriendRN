
import React, { useEffect } from 'react';
import TopLevelNavigationHandler from './TopLevelNavigationHandler'; // Adjust import path if necessary

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthUserProvider, useAuthUser } from './context/AuthUserContext';
import { GlobalStyleProvider } from './context/GlobalStyleContext';
import { FriendListProvider } from './context/FriendListContext';
import { LocationListProvider } from './context/LocationListContext';
import { UpcomingHelloesProvider } from './context/UpcomingHelloesContext';
import { CapsuleListProvider } from './context/CapsuleListContext';
import { ImageListProvider } from './context/ImageListContext';
import { SelectedFriendProvider } from './context/SelectedFriendContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font'; 
import { useGlobalStyle } from './context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';

 
import ScreenOnboardingFlow from './onboarding/ScreenOnboardingFlow';
import ScreenDefaultActionMode from './screens/ScreenDefaultActionMode';
import ScreenMoments from './screens/ScreenMoments';
import ScreenImages from './screens/ScreenImages';
import ScreenHelloes from './screens/ScreenHelloes';
import ScreenLocations from './screens/ScreenLocations';
import ScreenLocationSearch from './screens/ScreenLocationSearch';
import ScreenMidpointLocationSearch from './screens/ScreenMidpointLocationSearch';
import Signin from './screens/Signin';
import ScreenFriendFocus from './screens/ScreenFriendFocus'; 

import ScreenAddMoment from './screens/ScreenAddMoment';
import ScreenAddFriend from './screens/ScreenAddFriend';
import ScreenAddImage from './screens/ScreenAddImage';
import ScreenAddHello from './screens/ScreenAddHello';

async function loadFonts() {
  await Font.loadAsync({
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Pacifico-Regular': require('./assets/fonts/Pacifico-Regular.ttf'),
  });
}

const Stack = createNativeStackNavigator();

export default function App() {
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
                <CapsuleListProvider>
                  <ImageListProvider>
                    <LocationListProvider>
                      <Layout />
                    </LocationListProvider>
                  </ImageListProvider> 
                </CapsuleListProvider>
              </SelectedFriendProvider>
            </FriendListProvider>
          </UpcomingHelloesProvider>
        </GlobalStyleProvider>
      </AuthUserProvider>
    </GestureHandlerRootView>
  );
}

export const Layout = () => {
  const { themeStyles } = useGlobalStyle(); 
  const { authUserState, onSignOut } = useAuthUser();


  const handleSignOutPress = () => {
    console.log("Sign Out button pressed");
    onSignOut();
  };
 

  return (
    <NavigationContainer>
      <TopLevelNavigationHandler>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: themeStyles.header,  
          headerTintColor: themeStyles.headerTextColor,  
          cardStyle: { backgroundColor: 'transparent' }, 
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
                name="FriendFocus"
                component={ScreenFriendFocus}
                options={{
                  headerShown: true,
                  title: 'View friend',
                }}
              />
              <Stack.Screen
                name="Moments"
                component={ScreenMoments}
                options={{
                  headerShown: true,
                  title: 'All moments',
                }}
              />
              <Stack.Screen
                name="Images"
                component={ScreenImages}
                options={{
                  headerShown: true,
                  title: 'All images',
                }}
              />
              <Stack.Screen
                name="Helloes"
                component={ScreenHelloes}
                options={{
                  headerShown: true,
                  title: 'Archived helloes',
                }}
              />
              <Stack.Screen
                name="Locations"
                component={ScreenLocations}
                options={{
                  headerShown: true,
                  title: 'All locations',
                }}
              />
              <Stack.Screen
                name="LocationSearch"
                component={ScreenLocationSearch}
                options={{
                  headerShown: true,
                  title: 'Search locations',
                }}
              />
              <Stack.Screen
                name="MidpointLocationSearch"
                component={ScreenMidpointLocationSearch}
                options={{
                  headerShown: true,
                  title: 'Find midpoint locations',
                }}
              />
              <Stack.Screen
                name="AddMoment"
                component={ScreenAddMoment}
                options={{
                  headerShown: true,
                  title: 'Add new moment',
                }}
              />
              <Stack.Screen
                name="AddImage"
                component={ScreenAddImage}
                options={{
                  headerShown: true,
                  title: 'Upload memes and photos',
                }}
              />
              <Stack.Screen
                name="AddHello"
                component={ScreenAddHello}
                options={{
                  headerShown: true,
                  title: 'Record new hello',
                }}
              />
              <Stack.Screen
                name="AddFriend"
                component={ScreenAddFriend}
                options={{
                  headerShown: true,
                  title: 'Add new friend',
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
            component={Signin} />
        )}
      </Stack.Navigator>
      </TopLevelNavigationHandler>
    </NavigationContainer>
  );
};
