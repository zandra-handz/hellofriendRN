import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootNavigator from "./navigators/RootNavigator";
import { AuthUserProvider } from './context/AuthUserContext';
import { useAuthUser } from './context/AuthUserContext';
import { FriendListProvider } from './context/FriendListContext';
import { LocationListProvider } from './context/LocationListContext';
import { UpcomingHelloesProvider } from './context/UpcomingHelloesContext';
import { CapsuleListProvider } from './context/CapsuleListContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SelectedFriendProvider } from './context/SelectedFriendContext';
import SpeedFabView from './speeddial/SpeedFabView';
import FriendSelect from './data/FriendSelect';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import HelloFriendHeader from './components/HelloFriendHeader';
import ScreenOnboardingFlow from './onboarding/ScreenOnboardingFlow';
 

import Tabs from './components/Tabs';

// import Home from './screens/Home';
import Signin from './screens/Signin';

const Stack = createNativeStackNavigator();


// App.js is already setup by wrapping NavigationContainer around Root Navigator
export default function App() {

  const { onSignOut } = useAuthUser();
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthUserProvider>
        <UpcomingHelloesProvider>
          <FriendListProvider>
            <SelectedFriendProvider>
              <LocationListProvider> 
                <CapsuleListProvider> 
                  <Layout></Layout>
                </CapsuleListProvider>
              </LocationListProvider>
            </SelectedFriendProvider>
          </FriendListProvider>
        </UpcomingHelloesProvider>
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
      <Stack.Navigator>
        {authUserState?.authenticated && authUserState?.user ? (
          authUserState.user.app_setup_complete ? (
            <Stack.Screen
              name="Home"
              component={Tabs}
              options={{
                header: (props) => (
                  <HelloFriendHeader
                    {...props}
                    handleSignOutPress={handleSignOutPress}
                    additionalElements={[
                      <FriendSelect />
                    ]}
                  />
                ),
              }}
            />
          ) : (
            <Stack.Screen
              name="Setup"
              component={ScreenOnboardingFlow}
              options={{
                headerShown: false // Optionally, you can hide the header for the setup screen
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