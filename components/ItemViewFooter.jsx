import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ItemViewFooter = ({ buttons, maxButtons, showLabels }) => {
  
  const { themeStyles } = useGlobalStyle(); 

  const displayedButtons = maxButtons ? buttons.slice(0, maxButtons) : buttons;

  return (
    <View style={[styles.container, themeStyles.footerContainer]}>
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
