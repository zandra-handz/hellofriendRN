// Hint.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Hint = ({ message }) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="exclamation-circle" size={24} color="#000" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  message: {
    fontSize: 16,
    color: 'gray',
    fontStyle: 'italic',
  },
});

export default Hint;
