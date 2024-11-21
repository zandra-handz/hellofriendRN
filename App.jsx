
import React, { useEffect, useState } from 'react';

import TopLevelNavigationHandler from './TopLevelNavigationHandler'; // Adjust import path if necessary
import { Alert, View, Text, useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { MessageContextProvider } from './context/MessageContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthUserProvider, useAuthUser } from './context/AuthUserContext';
import { GlobalStyleProvider } from './context/GlobalStyleContext';
import { FriendListProvider } from './context/FriendListContext';
import { UpcomingHelloesProvider } from './context/UpcomingHelloesContext';
import { CapsuleListProvider } from './context/CapsuleListContext';
import { SelectedFriendProvider } from './context/SelectedFriendContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font'; 
import * as Notifications from 'expo-notifications'; 
import { useGlobalStyle } from './context/GlobalStyleContext';
import { useMessage } from './context/MessageContext';
import ResultMessage from './components/ResultMessage';

import ScreenOnboardingFlow from './onboarding/ScreenOnboardingFlow';
import ScreenHome from './screens/ScreenHome';
import ScreenFriendSettings from './screens/ScreenFriendSettings';
import ScreenMoments from './screens/ScreenMoments';
import ScreenImages from './screens/ScreenImages';
import ScreenHelloes from './screens/ScreenHelloes';
import ScreenLocations from './screens/ScreenLocations';
import ScreenLocationSearch from './screens/ScreenLocationSearch';
import ScreenMidpointLocationSearch from './screens/ScreenMidpointLocationSearch';
import Signin from './screens/Signin'; 
import ScreenMomentFocus from './screens/ScreenMomentFocus'; 
import ScreenLocation from './screens/ScreenLocation';

 
import ScreenAddFriend from './screens/ScreenAddFriend';
import ScreenAddImage from './screens/ScreenAddImage';
import ScreenAddHello from './screens/ScreenAddHello';
 

import HellofriendHeader from './components/HellofriendHeader';
//import HeaderBaseMainTheme from './components/HeaderBaseMainTheme';
import HeaderWriteMoment from './components/HeaderWriteMoment';
//import HeaderPickCategory from './components/HeaderPickCategory';
//import HeaderFriendFocus from './components/HeaderFriendFocus';
import HeaderFriendSettings from './components/HeaderFriendSettings';
import HeaderBase from './components/HeaderBase';  
import HeaderLocations from './components/HeaderLocations';
import HeaderHelloes from './components/HeaderHelloes';
import HeaderLocationSingle from './components/HeaderLocationSingle';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import PhoneStatusBar from './components/PhoneStatusBar';

async function loadFonts() {
  await Font.loadAsync({
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Pacifico-Regular': require('./assets/fonts/Pacifico-Regular.ttf'),
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

 


      const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received in foreground:', notification);
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      <Stack.Navigator
        screenOptions={{
          headerShown: true, 
          
          headerStyle: themeStyles.header,  
          headerTintColor: themeStyles.headerTextColor, 
          contentContainerStyle: { flexGrow: 1 }, 
          cardStyle: { backgroundColor: '#000002' }, 
          

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
                  header: () => <HellofriendHeader />
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
                  header: () => <HeaderWriteMoment />
                }}
              />
              <Stack.Screen
                name="Moments"
                component={ScreenMoments}
                options={{
                  headerShown: true,
                  header: () => <HeaderBase headerTitle='Moments' />,
                }}
              />
              <Stack.Screen
                name="Images"
                component={ScreenImages}
                options={{
                  headerShown: true,
                  header: () => <HeaderBase headerTitle='Images' />,
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
                  headerShown: true, 
                  header: () => <HeaderLocations />,
                }}
              />
              <Stack.Screen
                name="Location"
                component={ScreenLocation}
                options={{
                  headerShown: true, 
                  header: () => <HeaderLocationSingle />,
                }}
              />
              <Stack.Screen
                name="LocationSearch"
                component={ScreenLocationSearch}
                options={{
                  headerShown: true,
                  header: () => <HeaderBase headerTitle='Search locations' />,
                }}
              />
              <Stack.Screen
                name="MidpointLocationSearch"
                component={ScreenMidpointLocationSearch}
                options={{
                  headerShown: true,
                  header: () => <HeaderBase headerTitle='Find midpoint locations' />,
                }}
              />

          
              <Stack.Screen
                name="AddImage"
                component={ScreenAddImage}
                options={{
                  headerShown: true,
                  header: () => <HeaderBase headerTitle='Upload' navigateTo='Images' />,
                }}
              />
              <Stack.Screen
                name="AddHello"
                component={ScreenAddHello}
                options={{
                  headerShown: true,
                  header: () => <HeaderBase headerTitle='Add hello' icon='heartbeat' navigateTo='Helloes' />,
                }}
              />
              <Stack.Screen
                name="AddFriend"
                component={ScreenAddFriend}
                options={{
                  headerShown: true,
                  header: () => <HeaderBase headerTitle='Add new friend' />,
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
            }} />
        )}
      </Stack.Navigator>
      </TopLevelNavigationHandler>
    </NavigationContainer>
  );
};
