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
      <Text style={styles.titleBold}>{firstFriendData.future_date_in_words}</Text>
      <TestLottieAnimation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: -50,
    marginRight: -86,
  },
  titleBold: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    paddingTop: 10,
    marginRight: -50, // Adjust spacing between animation and text as needed
  },
});

export default NextHello;
