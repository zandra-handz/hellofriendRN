import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import TestLottieAnimation from '../components/TestLottieAnimation';

const NextHello = () => {
  const { friendDashboardData } = useSelectedFriend();

  if (!friendDashboardData || friendDashboardData.length === 0) {
    return null;
  }

  const firstFriendData = friendDashboardData[0];

  return (
    <View style={styles.container}>
      <Text style={styles.titleBold}>next hello     </Text>
      <TestLottieAnimation />
      <Text style={styles.title}>      {firstFriendData.future_date_in_words}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', 
  },
  title: {
    fontSize: 13,
  },
  titleBold: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default NextHello;
