import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome5 } from 'react-native-vector-icons';

const ItemViewFooter = ({ buttons }) => {
  return (
    <View style={styles.container}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={button.onPress}
        >
          <FontAwesome5 name={button.icon} size={24} color={button.color || 'black'} style={styles.icon} />
          <Text>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 64,
    width: '100%',
    marginBottom: 0,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  button: {
    marginLeft: 10,
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default ItemViewFooter;
