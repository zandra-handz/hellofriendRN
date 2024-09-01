import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import TextAreaMoment from '../speeddial/TextAreaMoment';

const EnterMoment = ({ 
  handleInputChange,
  textInput, 
  placeholderText,
  buttonBackgroundColor='black', 
  onScreenChange, 
  resetText=false, 
}) => {
  const [isFirstScreen, setIsFirstScreen] = useState(true);
  const [resetTextAreaText, setResetTextAreaText] = useState(false);

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
            <TouchableOpacity style={[styles.nextButton, {backgroundColor: buttonBackgroundColor}]} onPress={handleNextScreenClick}>
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
            <TouchableOpacity style={[styles.nextButton, {backgroundColor: buttonBackgroundColor}]} onPress={handleBackScreenClick}>
              <Text style={styles.nextButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', 
    height: 300,
    flexDirection: 'row',
  }, 
  enteredTextContainer: {
    width: '100%',
    padding: 10, 
  },
  enteredText: { 
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
    width: '100%', 
  },
  nextButtonContainer: { 
    width: '100%', 
    position: 'absolute',
    zIndex: 1,
    bottom: 4,
    right: -154,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
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
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    width: 'auto',
  },
  nextButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});

export default EnterMoment;
