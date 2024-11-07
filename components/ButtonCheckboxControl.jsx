import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useNavigation } from '@react-navigation/native';
import ButtonColorBGSmall from '../components/ButtonColorBGSmall';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { useFriendList } from '../context/FriendListContext';


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
  const { themeAheadOfLoading } = useFriendList();


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

    <View style={{justifyContent: 'flex-end', width: '100%', alignItems: 'center', flexDirection: 'row'}}>   
    <TouchableOpacity onPress={!isSaving ? onToggleCheckboxes : null} style={[styles.controlButton, themeStyles.footerIcon]}>
      <Text style={[styles.controlButtonText, themeStyles.footerText, {color: themeAheadOfLoading.fontColorSecondary}]}>{showCheckboxes ? "CLOSE" : "SAVE TO HELLO"}</Text>
      <Icon name={showCheckboxes ? "check-square-o" : "square-o"} size={20} style={[styles.checkbox, themeStyles.footerIcon, {color: themeAheadOfLoading.fontColorSecondary}]} />
    </TouchableOpacity>
    {!showCheckboxes && !noHello && (
      <View style={{paddingLeft: 10 }}>
          <ButtonColorBGSmall 
            onPress={handleGoToHelloScreenNoSave} 
            title="Go to Hello" 
            backgroundColor={buttonColor} 
            textStyle={[themeStyles.footerText]}
            textColor={themeAheadOfLoading.fontColor}
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
    alignContent: 'center',
    height: '100%', 
    borderRadius: 30, 
    paddingHorizontal: 2,  
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {  
    paddingHorizontal: 10, 
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
