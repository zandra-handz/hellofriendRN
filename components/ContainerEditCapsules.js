import React from 'react';
import { View, StyleSheet } from 'react-native';

const ContainerEditCapsules = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default ContainerEditCapsules;
