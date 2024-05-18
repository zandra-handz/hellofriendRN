// Untested

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AlertGen = ({ message, buttonText, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  message: {
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonText: {
    color: 'blue',
  },
});

export default AlertGen;
