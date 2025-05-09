// Hint.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Hint = ({ message, icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FontAwesome name={icon} size={24} color="#000" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'top',
    width: '100%',
    paddingTop: 0,
  },
  icon: {
    marginRight: 0,
  },
  message: {
    marginLeft: 6,
    fontSize: 15,
    color: 'gray',
    fontStyle: 'italic',
    width: '100%',
  },
});

export default Hint;
