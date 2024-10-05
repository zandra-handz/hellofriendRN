import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';
import ButtonColorBGSmall from '../components/ButtonColorBGSmall';
import { useSelectedFriend } from '../context/SelectedFriendContext';


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
  const { calculatedThemeColors } = useSelectedFriend();


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

    <View style={{justifyContent: 'flex-end', width: '100%', height: '100%', alignItems: 'flex-end', flexDirection: 'row'}}>   
    <TouchableOpacity onPress={!isSaving ? onToggleCheckboxes : null} style={[styles.controlButton, themeStyles.footerIcon]}>
      <Text style={[styles.controlButtonText, themeStyles.footerText, {color: calculatedThemeColors.fontColor}]}>{showCheckboxes ? "hello mode" : "hello mode"}</Text>
      <Icon name={showCheckboxes ? "check-square-o" : "square-o"} size={20} style={[styles.checkbox, themeStyles.footerIcon, {color: calculatedThemeColors.fontColor}]} />
    </TouchableOpacity>
    {!showCheckboxes && !noHello && (
      <View style={{paddingLeft: 10 }}>
          <ButtonColorBGSmall 
            onPress={handleGoToHelloScreenNoSave} 
            title="Go to Hello" 
            backgroundColor={buttonColor} 
            textStyle={[themeStyles.footerText]}
            textColor={calculatedThemeColors.fontColorSecondary}
          />
        </View>
        )}

        {showCheckboxes && (
          <View style={{paddingLeft: 10 }}>
          <ButtonColorBGSmall 
            onPress={handleGoToHelloScreen} 
            title="Go to Hello" 
            backgroundColor={buttonColor} 
            textStyle={themeStyles.footerText}
          />
          </View>
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
    height: '5.4%',
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
