import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HelloFriendFooter() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.footerText}>
        {' '}
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