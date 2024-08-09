import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import TextAreaMoment from '../speeddial/TextAreaMoment';

const EnterMoment = ({ 
  handleInputChange,
  textInput, 
  placeholderText,
  handleNextScreen,
  onScreenChange, // New prop for notifying parent of screen changes
}) => {
  const [isFirstScreen, setIsFirstScreen] = useState(true);

  // Notify parent of screen state changes
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
          />
          {textInput && (
          <View style={styles.nextButtonContainer}> 
            <TouchableOpacity style={styles.nextButton} onPress={handleNextScreenClick}>
              <Text style={styles.nextButtonText}>Finished</Text>
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
          />
          <View style={styles.editButtonContainer}> 
            <TouchableOpacity style={styles.nextButton} onPress={handleBackScreenClick}>
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
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  editButtonContainer: { 
    width: '100%', 
    position: 'absolute',
    zIndex: 1,
    top: 26,
    right: -132,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: 'limegreen',
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
