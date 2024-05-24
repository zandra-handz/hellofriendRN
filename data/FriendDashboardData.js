import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const NextHello = () => {
  const { friendDashboardData } = useSelectedFriend(); 

 
  if (!friendDashboardData || friendDashboardData.length === 0) { 
    return null;  
  }

  const firstFriendData = friendDashboardData[0];  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{firstFriendData.future_date_in_words}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: 'white',  // Adjust based on your design
    alightItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  date: { 
  },
});

export default NextHello;


