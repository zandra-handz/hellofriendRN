import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const SaveButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.saveButton}>
      
      <Text style={styles.saveButtonText}>UPDATE</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4cd137', // Green color matching the ToggleButton 'on' state
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    width: '100%',
  },
  saveButtonText: {
    marginLeft: 5,
    color: 'white',
    fontSize: 20, 
  },
});

export default SaveButton;
