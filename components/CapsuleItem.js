import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

const CapsuleItem = ({ capsule, selected, onPress }) => {
  return (
    <View style={styles.container}>
      <CheckBox 
        containerStyle={styles.checkboxContainer}
        checked={selected}
        onPress={onPress}
      />
      <Text style={styles.text}>{capsule}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  checkboxContainer: {
    margin: 0,
    padding: 0,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    flexWrap: 'wrap',
  },
});

export default CapsuleItem;
