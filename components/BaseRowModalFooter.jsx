import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import your context hook
import ToggleButton from '../components/ToggleButton';

const BaseRowModalFooter = ({ 
    iconName, 
    iconSize,
    label, 
    useToggle=true, 
    value, 
    onTogglePress, 
    useAltButton=false, 
    onAltButtonPress, 
    altIsSimpleText=false,
    altButtonText='Alt Bt Txt',
    altButtonOther,
    altButtonComplete,
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
        {useAltButton && !useToggle && (
          <>
          {altIsSimpleText && altButtonText && (
           <TouchableOpacity onPress={onAltButtonPress} style={styles.customButton}>
              <Text>{altButtonText}</Text>
            </TouchableOpacity>
          )}
          {!altIsSimpleText && altButtonOther && (
            <TouchableOpacity onPress={onAltButtonPress} style={[styles.altButton, themeStyles.modalIconColor]}>
              {altButtonOther ? <View>{altButtonOther}</View> : null}
            </TouchableOpacity>
          )}

          {!altIsSimpleText && altButtonComplete  && (
            <View>{altButtonComplete ? altButtonComplete : null}</View>
          )}


          </>
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
    paddingTop: 2,
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

  altButton: {
    borderRadius: 15, 
    paddingVertical: 4, 
    alignContent: 'center',
    paddingHorizontal: 10,
  },
});

export default BaseRowModalFooter;
