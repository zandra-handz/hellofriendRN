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
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    height: 64,
    width: '100%',
    marginBottom: 0,
    padding: 10, 
    zIndex: 1,
  },
  button: { 
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 0,
  },
});

export default ItemViewFooter;
