import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';


const ButtonToActionMode = ({ 
  iconName = 'arrow-left', 
  navigateScreen = 'hellofriend', 
  iconOnly = false, 
  label = 'Back', 
  fAIcon = false 
}) => {
  const { themeStyles } = useGlobalStyle();
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
          style={themeStyles.footerIcon} 
        />
      );
    } else { 
      return (
        <FontAwesome 
          name={iconName} 
          size={28}  
          style={themeStyles.footerIcon}
        />
      );
    }
  };

  return (
    <TouchableOpacity onPress={navigateToScreen} style={styles.buttonContainer}>
      {renderIcon()}
      {!iconOnly && <Text style={themeStyles.footerText}>{label}</Text>}
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
