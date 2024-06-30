import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

import { useSelectedFriend } from '../context/SelectedFriendContext';

const DaysSince = () => {
  const { friendDashboardData } = useSelectedFriend();
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    pulse();

    // Clean up animation on unmount
    return () => pulseAnimation.stopAnimation();
  }, [pulseAnimation]);

  const renderIcon = () => {
    if (!friendDashboardData || !friendDashboardData.length) return null;

    const firstFriendData = friendDashboardData[0];
    switch (firstFriendData.time_score) {
      case 1:
        return '❤️';
      case 2:
        return '😊';
      case 3:
        return '☹️';
      case 4:
        return '😐';
      case 5:
        return '☹️';
      case 6:
        return '😢';
      default:
        return null;
    }
  };

  if (!friendDashboardData || !friendDashboardData.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.daysSinceContainer}> 
      <Text style={styles.daysSinceText}>{friendDashboardData[0].days_since} days</Text>
      <Animated.Text
        style={[
          styles.icon,
          {
            transform: [{ scale: pulseAnimation }],
          },
        ]}
      >
        {renderIcon()}
      </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginBottom: 0, 
    width: '60%',
    height: 18,
    alignContent: 'left',  
  },
  daysSinceContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'left',
    padding: 0,
    
  },
  daysSinceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 4,
  },
  icon: {
    fontSize: 14,
  },
});

export default DaysSince;
