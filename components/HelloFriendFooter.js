import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HelloFriendFooter() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.footerText}>
        All rights reserved by hellofriend, 2024{' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginBottom: '0px',
    padding: '10px', 
  },
  footerText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontStyle: 'bold',
  },
});