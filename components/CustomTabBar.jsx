import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useGlobalStyle } from '../context/GlobalStyleContext';

import { useFriendList } from '../context/FriendListContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {

  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const underlinePosition = useSharedValue(0);
  const tabWidth = width / state.routes.length; // Calculate the width of each tab

  React.useEffect(() => {
    underlinePosition.value = withTiming(state.index * tabWidth, { duration: 200 });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlinePosition.value }],
  }));

  return (
    <View style={[styles.tabBar, {backgroundColor: themeAheadOfLoading.darkColor}]}>
      <Animated.View style={[styles.underline, animatedStyle, { width: tabWidth, backgroundColor: themeAheadOfLoading.fontColor }]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
          >
            {options.tabBarIcon({ focused: isFocused })} 
            <Text style={{ fontFamily: 'Poppins-Bold', color: isFocused ? themeAheadOfLoading.fontColor : themeAheadOfLoading.fontColor, marginTop: 4, marginLeft: 7 }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'transparent', // Set to your desired background
    top: 0,
    width: '100%',
    height: 60,
  },
  tabButton: {
    flex: 1,
    paddingBottom: 0,
    paddingTop: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: '100%', // Ensure full height is taken
  },
  underline: {
    position: 'absolute',
    height: 3, 
    bottom: 0,
  },
});

export default CustomTabBar;
