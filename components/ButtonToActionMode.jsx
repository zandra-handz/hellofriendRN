import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ButtonToActionMode = ({ 
  iconName = 'arrow-left', 
  navigateScreen = 'hellofriend', 
  iconOnly = false, 
  label = 'Back to Lite', 
  fAIcon = false 
}) => {
  const navigation = useNavigation();

  const navigateToScreen = () => {
    navigation.navigate(navigateScreen);
  };

  const renderIcon = () => {
    if (fAIcon) {
      return (
        <FontAwesome 
          name={iconName} 
          size={28} 
          color="black" 
          style={styles.icon} 
        />
      );
    } else {
      // Using MaterialIcons as default
      return (
        <FontAwesome 
          name={iconName} 
          size={28} 
          color="black" 
          style={styles.icon} 
        />
      );
    }
  };

  return (
    <TouchableOpacity onPress={navigateToScreen} style={styles.buttonContainer}>
      {renderIcon()}
      {!iconOnly && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ButtonToActionMode;
