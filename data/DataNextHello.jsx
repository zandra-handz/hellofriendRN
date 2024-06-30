// DataNextHello.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const DataNextHello = () => {
  const { friendDashboardData } = useSelectedFriend();

  if (!friendDashboardData || friendDashboardData.length === 0) {
    return null;
  }

  const firstFriendData = friendDashboardData[0];

  return (
    <View> 
      <Text style={styles.titleBold}>{firstFriendData.future_date_in_words}</Text>
       
    </View>
  );
};

export default DataNextHello;
