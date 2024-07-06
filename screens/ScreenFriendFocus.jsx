import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScreenFriendFocus = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Friend Focus Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adjust as per your design
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Adjust text color
  },
});

export default ScreenFriendFocus;
