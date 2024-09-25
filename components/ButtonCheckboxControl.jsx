import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';
import ButtonColorBGSmall from '../components/ButtonColorBGSmall';


const ButtonCheckboxControl = ({ 
  onToggleCheckboxes, 
  showCheckboxes,
  selectedMoments, 
  isSaving,
  onSave,
  buttonColor,
}) => {
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();


  const noHello = true;


  useEffect(() => {
    console.log('In buttoncheckboxcontrol', selectedMoments);
  }, [selectedMoments]); 

  const handleGoToHelloScreen = () => {
    onSave();
    navigation.navigate('AddHello');
  };
  const handleGoToHelloScreenNoSave = () => {
    onSave();
    navigation.navigate('AddHello');
  }; 

  return ( 
    <View style={styles.controlPanel}>

    <View style={{justifyContent: 'space-between', width: '100%', height: '100%', alignItems: 'flex-end', flexDirection: 'column'}}>   
    <TouchableOpacity onPress={!isSaving ? onToggleCheckboxes : null} style={[styles.controlButton, themeStyles.footerIcon]}>
      <Text style={[styles.controlButtonText, themeStyles.footerText]}>{showCheckboxes ? "hello mode" : "hello mode"}</Text>
      <Icon name={showCheckboxes ? "check-square-o" : "square-o"} size={20} style={[styles.checkbox, themeStyles.footerIcon]} />
    </TouchableOpacity>
    {!showCheckboxes && !noHello && (
          <ButtonColorBGSmall 
            onPress={handleGoToHelloScreenNoSave} 
            title="Go to Hello" 
            backgroundColor={buttonColor} 
            textStyle={themeStyles.footerText}
          />
        )}

        {showCheckboxes && (
          <ButtonColorBGSmall 
            onPress={handleGoToHelloScreen} 
            title="Go to Hello" 
            backgroundColor={buttonColor} 
            textStyle={themeStyles.footerText}
          />
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlPanel: { 
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center', 
    height: '7.8%',
    marginBottom: 20,
    borderRadius: 30,
    paddingTop: 16,
    paddingHorizontal: 2,
    backgroundColor: 'transparent',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {  
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 20,
    justifyContent: 'center',
  },
  checkbox: {
    paddingLeft: 10,  
    paddingBottom: 2,
    paddingRight: 1,
  },
  controlButtonText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular', 
    justifyContent: 'center',
    alignItems: 'center', 
    alignContent: 'center',
  },
});

export default ButtonCheckboxControl;
