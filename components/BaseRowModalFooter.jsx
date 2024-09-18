import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import your context hook
import ToggleButton from '../components/ToggleButton';

const BaseRowModalFooter = ({ 
    iconName, 
    iconSize,
    label, 
    useToggle, 
    value, 
    onTogglePress, 
    useAltButton=false, 
    onAltButtonPress, 
    useCustom=false,
    customLabel, 
    onCustomPress  }) => {

  const { themeStyles } = useGlobalStyle();

  return (
    <View style={styles.row}>
      <View style={{flexDirection: 'row'}}>
        <FontAwesome5 name={iconName} size={iconSize} style={[styles.icon, themeStyles.modalIconColor]} />
        <Text style={[styles.label, themeStyles.modalText]}>{label}</Text>
        {useCustom && onCustomPress && (
        <TouchableOpacity onPress={onCustomPress} style={styles.customButton}>
            <Text>{customLabel}</Text>
        </TouchableOpacity>
        )}
      </View>
      <>
        {useToggle && !useAltButton && (
          <ToggleButton value={value} onToggle={onTogglePress} />
        )}
        {useAltButton && onAltPress && (
          <></>
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  customButton:  { 
    marginLeft: 6, 
    borderRadius: 15, 
    backgroundColor: '#ccc', 
    paddingVertical: 4, 
    paddingHorizontal: 8,
  },
});

export default BaseRowModalFooter;
