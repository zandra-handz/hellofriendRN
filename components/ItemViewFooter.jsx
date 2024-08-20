import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const ItemViewFooter = ({ buttons, maxButtons, showLabels }) => {
  // Limit the number of buttons displayed based on maxButtons prop
  const displayedButtons = maxButtons ? buttons.slice(0, maxButtons) : buttons;

  return (
    <View style={styles.container}>
      {displayedButtons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={button.onPress}
        >
          <View style={styles.iconContainer}>
            {button.icon}
          </View>
          {showLabels !== false && <Text>{button.label}</Text>}
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
    alignContent: 'center', 
    height: 40,
    width: '100%', 
    paddingHorizontal: 10, 
    zIndex: 1,
  },
  button: { 
    alignItems: 'center', 
  },
  iconContainer: {
    marginHorizontal: 0,
  },
});

export default ItemViewFooter;
