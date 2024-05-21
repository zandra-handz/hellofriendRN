import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpeedFabView from '../speeddial/SpeedFabView';
import HelloFriendFooter from '../components/HelloFriendFooter';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import CardGen from '../components/CardGen'; // Import the CardGen component

const Tab = createMaterialTopTabNavigator();

// Dummy data for cards
const dummyData = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  title: `Card ${index + 1}`,
  description: 'This is a dummy description for the card. This is a dummy description for the card.',
}));

// Function to interpolate between two colors
const interpolateColor = (startColor, endColor, factor) => {
  const result = startColor.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (endColor[i] - startColor[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
};

const endColor = [25, 90, 25]; // Darker Forest Green
const startColor = [190, 255, 0]; // More Vibrant Yellow-Green


// Function to get gradient color based on index
const getGradientColor = (index, total) => {
  // Adjust the factor to be twice as much towards the end color
  const factor = (index / (total - 1)) * 2;
  // Clamp the factor to a maximum of 1
  const clampedFactor = Math.min(factor, 1);
  return interpolateColor(startColor, endColor, clampedFactor);
};

const TabScreen = ({ data }) => (
  <FlatList
    data={data}
    renderItem={({ item, index }) => (
      <CardGen
        key={item.id}
        title={item.title}
        description={item.description}
        showIcon={true}
        iconColor={getGradientColor(index, data.length)}
      />
    )}
    keyExtractor={item => item.id.toString()}
    contentContainerStyle={styles.tabContent}
  />
);

// Define specific data for each tab screen
const tabScreenData = [
  { name: 'TabScreen1', data: dummyData },
  { name: 'TabScreen2', data: dummyData },
  { name: 'TabScreen3', data: dummyData },
  { name: 'TabScreen4', data: dummyData },
];

// Create TabScreen components for each tab
const TabScreens = tabScreenData.reduce((screens, { name, data }) => {
  screens[name] = () => <TabScreen data={data} />;
  return screens;
}, {});

const Tabs = () => {
  const { selectedFriend } = useSelectedFriend();

  return (
    <>
      <View style={styles.container}>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarActiveTintColor: 'hotpink',
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', textTransform: 'none' },
            tabBarItemStyle: { width: 210 },
            tabBarIndicatorStyle: { backgroundColor: 'hotpink' },
            tabBarStyle: { backgroundColor: 'white' },
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
                name="Home"
                component={TabScreens.TabScreen1}
                options={{ tabBarLabel: 'Up next', tabBarAccessibilityLabel: 'Home' }}
              />
              <Tab.Screen
                name="Updates"
                component={TabScreens.TabScreen2}
                options={{ tabBarLabel: 'Places', tabBarAccessibilityLabel: 'Updates' }}
              />
            </Tab.Group>
          )}
          {selectedFriend && (
            <Tab.Group screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}>
              <Tab.Screen
                name="Capsules"
                component={TabScreens.TabScreen3}
                options={{ tabBarLabel: 'Capsules', tabBarAccessibilityLabel: 'Capsules' }}
              />
              <Tab.Screen
                name="Past"
                component={TabScreens.TabScreen4}
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
    flex: 1,
    width: 'auto',
    backgroundColor: 'white',
  },
  tabContent: {
    padding: 0,
  },
  footerContainer: { backgroundColor: '#333333', marginBottom: 0 },
});

export default Tabs;
