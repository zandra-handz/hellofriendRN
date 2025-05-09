import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ItemGoogleAddress = ({ description, fetchDetails }) => {
  const handlePress = () => { 
    if (fetchDetails) {
      fetchDetails(description);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ItemGoogleAddress;
