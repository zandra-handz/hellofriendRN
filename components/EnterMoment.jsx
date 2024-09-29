import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import TextAreaMoment from '../speeddial/TextAreaMoment';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const EnterMoment = ({ 
  handleInputChange,
  textInput, 
  placeholderText, 
  onScreenChange, 
  resetText=false, 
}) => {
  const [isFirstScreen, setIsFirstScreen] = useState(true);
  const [resetTextAreaText, setResetTextAreaText] = useState(false);
  const { themeStyles } = useGlobalStyle();
  const { calculatedThemeColors } = useSelectedFriend();

  useEffect(() => {
    if (onScreenChange) {
      onScreenChange(isFirstScreen);
    }
  }, [isFirstScreen]);

  const handleNextScreenClick = () => {
    setIsFirstScreen(false);
  };

  const handleBackScreenClick = () => {
    setIsFirstScreen(true);
  }; 

  useEffect(() => {
    if (resetText) {
      setResetTextAreaText(true); 
      console.log('reset text in EnterMoment');
     
    }
  }, [resetText]);

  useEffect(() => {
    if (resetTextAreaText) {
      setIsFirstScreen(true);
      setResetTextAreaText(false); 
    }
  }, [resetTextAreaText]);

  return (
    <View style={styles.container}>
      {isFirstScreen ? (
        <View>
          <TextAreaMoment
            onInputChange={handleInputChange}
            initialText={textInput}
            placeholderText={placeholderText}
            autoFocus={true}
            closeModal={onScreenChange}
            resetText={resetTextAreaText} // Pass resetTextAreaText instead of resetText
          />
          {textInput && (
          <View style={styles.nextButtonContainer}> 
            <TouchableOpacity style={[styles.nextButton, {backgroundColor: calculatedThemeColors.darkColor}]} onPress={handleNextScreenClick}>
              <Text style={styles.nextButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
           )}
        </View>
      ) : (
        <View>
          <TextAreaMoment
            onInputChange={handleInputChange}
            initialText={textInput}
            placeholderText={placeholderText}
            autoFocus={false}
            editMode={false}
            resetText={resetTextAreaText} // Pass resetTextAreaText instead of resetText
          />
          <View style={styles.editButtonContainer}> 
            <TouchableOpacity style={[styles.nextButton, themeStyles.genericTextBackgroundShadeTwo]} onPress={handleBackScreenClick}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {   
    justifyContent: 'center',   
    flexDirection: 'row',
  },  
  nextButtonContainer: { 
    width: '100%', 
    position: 'absolute',
    zIndex: 1,
    bottom: 80,
    right: -158,
    alignItems: 'center', 
  },
  editButtonContainer: { 
    width: '100%', 
    position: 'absolute',
    zIndex: 1,
    top: 48,
    right: -154,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 0,
    width: 'auto',
  },
  editButtonText: {
    color: 'darkgray',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
  nextButtonText: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
});

export default EnterMoment;
