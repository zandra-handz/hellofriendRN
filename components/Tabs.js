import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpeedFabView from '../speeddial/SpeedFabView';
import HelloFriendFooter from '../components/HelloFriendFooter';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import TabScreen from './TabScreen'; 
import NextHello from '../data/FriendDashboardData';  
import { Flow, Grid } from 'react-native-animated-spinkit';
import TabScreenNext from './TabScreenNext';
import TabScreenPlaces from './TabScreenPlaces';
import DaysSince from '../data/FriendDaysSince';  
import TabScreenFriend from './TabScreenFriend'; 
import TabScreenHelloes from './TabScreenHelloes';

const Tab = createMaterialTopTabNavigator();

// Dummy data for cards
const dummyData = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  title: `Card ${index + 1}`,
  description: 'This is a dummy description for the card.',
}));

// Define specific data for each tab screen
const tabScreenData = [
  { name: 'TabScreen1', data: dummyData, showStatusCard: false },
  { name: 'TabScreen2', data: dummyData, showStatusCard: false },
  { name: 'TabScreen3', data: dummyData, showStatusCard: true }, // Show status card here
  { name: 'TabScreen4', data: dummyData, showStatusCard: false },
];

// Create TabScreen components for each tab
const TabScreens = tabScreenData.reduce((screens, { name, data, showStatusCard }) => {
  if (name === 'TabScreen3') {
    screens[name] = () => (
      <TabScreenFriend 
        data={data} 
        showStatusCard={showStatusCard} 
        leftContent={<NextHello />} 
        rightContent={<DaysSince />} 
      />
    );
  } else if (name === 'TabScreen1') {
    screens[name] = () => (
      <TabScreenNext />
    );

  } else if (name === 'TabScreen2') {
    screens[name] = () => (
      <TabScreenPlaces />
    );

  } else if (name === 'TabScreen4') {
    screens[name] = () => (
      <TabScreenHelloes />
    );

  } else {
    screens[name] = () => (
      <TabScreen 
        data={data} 
        showStatusCard={showStatusCard} 
        leftContent={<NextHello />} 
        rightContent={<DaysSince />} 
      />
    );
  }
  return screens;
}, {});

const Tabs = () => {
  const { selectedFriend } = useSelectedFriend();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
    

  return (
    <>
      <View style={styles.container}>
      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <Flow size={60} color='hotpink'/>
        </View>

      ):(
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarActiveTintColor: 'hotpink',
            tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', textTransform: 'none' },
            tabBarItemStyle: { width: 'auto', alignItems: 'flex-start' }, // Align items to the left
            tabBarIndicatorStyle: { backgroundColor: 'hotpink' },
            tabBarStyle: { backgroundColor: 'white' },
            tabBarContentContainerStyle: { alignItems: 'flex-start' }, // Ensure the container is aligned left
            tabBarGap: 0,
            tabBarAllowFontScaling: true,
            tabBarAndroidRipple: { borderless: true },
            tabBarPressColor: 'transparent',
            tabBarBounces: true,
          }}
        >
          {!selectedFriend && (
            <Tab.Group screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}>
              <Tab.Screen
                name="Up next"
                component={TabScreens.TabScreen1}
                options={{ tabBarLabel: 'Up next', tabBarAccessibilityLabel: 'Home' }}
              />
            </Tab.Group>
          )}
          {selectedFriend && (
            <Tab.Group screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}>
              <Tab.Screen
                name="Capsules"
                component={TabScreens.TabScreen3}
                options={{ tabBarLabel: 'Moments', tabBarAccessibilityLabel: 'Capsules' }}
              />
              <Tab.Screen
                name="Past"
                component={TabScreens.TabScreen4}
                options={{ tabBarLabel: 'Past helloes', tabBarAccessibilityLabel: 'Past' }}
              />
            </Tab.Group>

          )}
            <Tab.Screen
              name="Updates"
              component={TabScreens.TabScreen2}
              options={{ tabBarLabel: 'Places to go', tabBarAccessibilityLabel: 'Updates' }}
            />

        </Tab.Navigator>
      )}
      </View>
      <SpeedFabView />
      <View style={styles.footerContainer}>
        <HelloFriendFooter />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 'auto',
    backgroundColor: 'white',
  },
  tabContent: {
    padding: 0,
  },
  spinnerContainer: { 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  footerContainer: {
    backgroundColor: '#333333',
    marginBottom: 0,
  },
});

export default Tabs;


/*
screenOptions={{
  tabBarActiveTintColor: 'hotpink',
  tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', textTransform: 'none' },
  tabBarItemStyle: { width: 210 }, // Centered tab item style
  tabBarIndicatorStyle: { backgroundColor: 'hotpink' },
  tabBarStyle: { backgroundColor: 'white' },
  tabBarGap: 0,
  tabBarAllowFontScaling: true,
  tabBarAndroidRipple: { borderless: true },
  tabBarPressColor: 'transparent',
  tabBarBounces: true,
}}
*/
