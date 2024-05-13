import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpeedFabView from '../speeddial/SpeedFabView';
import HelloFriendFooter from '../components/HelloFriendFooter';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const Tab = createMaterialTopTabNavigator();

const TabScreen1 = () => (
  <View style={styles.tabContent}>
    <Text>Tab Screen 111111</Text>
  </View>
);

const TabScreen2 = () => (
  <View style={styles.tabContent}>
    <Text>Tab Screen 2</Text>
  </View>
);

const TabScreen3 = () => (
    <View style={styles.tabContent}>
      <Text>Tab Screen 111111</Text>
    </View>
  );
  
  const TabScreen4 = () => (
    <View style={styles.tabContent}>
      <Text>Tab Screen 2</Text>
    </View>
  );

const Tabs = () => {

  const { selectedFriend } = useSelectedFriend();

  return (
    <>
    <View style={styles.container}>
    <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
            tabBarActiveTintColor: '#e91e63',
            tabBarLabelStyle: { fontSize: 14 },
            tabBarItemStyle: { width: 210},
            tabBarStyle: { backgroundColor: 'black' },
            tabBarGap: 0,
            tabBarAllowFontScaling: true,
            tabBarAndroidRipple: { borderless: true },
            tabBarPressColor: 'red',
            tabBarBounces: true,
        }}
        >
            {!selectedFriend && (
            <Tab.Group
                screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}>
                <Tab.Screen
                    name="Home"
                    component={TabScreen1}
                    options={{ tabBarLabel: 'Up next', tabBarAccessibilityLabel: 'Home' }}
                />
                <Tab.Screen
                    
                    name="Updates"
                    component={TabScreen2}
                    options={{ tabBarLabel: 'Places', tabBarAccessibilityLabel: 'Updates' }}
                />
            </Tab.Group>
            )}
            {selectedFriend && (
            <Tab.Group
                screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}>
                <Tab.Screen
                    name="Capsules"
                    component={TabScreen3}
                    options={{ tabBarLabel: 'Capsules', tabBarAccessibilityLabel: 'Capsules' }}
                />
                <Tab.Screen
                    
                    name="Past"
                    component={TabScreen4}
                    options={{ tabBarLabel: 'Past', tabBarAccessibilityLabel: 'Past' }}
                />
            </Tab.Group>
            )}
      </Tab.Navigator>
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
    flex: 1
    ,
    width: 'auto',
    backgroundColor: 'white',
  },
  message: {
    fontSize: 20,
    marginBottom: 0,
  },
  tabContent: {
    color: 'black',
  },
  footerContainer: { backgroundColor: '#333333', marginBottom: 0, },
  message: {
      fontSize: 60,
      top: '26%',
      textAlign: "center",
      justifyContent: "center",
      width: "100%",
      padding: 28,

  },
});

export default Tabs;
