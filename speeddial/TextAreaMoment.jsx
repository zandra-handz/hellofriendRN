import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import SpeechRectCartoonishSvg from '../assets/svgs/speech-rect-cartoonish.svg';//height={360} width={360}
import MaximizeSquareSolidSvg from '../assets/svgs/maximize-square-solid.svg';  
import ThoughtBalloonLightBlueSvg from '../assets/svgs/thought-balloon-light-blue.svg';

import ModalMomentFocus from '../components/ModalMomentFocus'; // Import the new component
import { useGlobalStyle } from '../context/GlobalStyleContext';

const TextAreaMoment = ({ onInputChange, initialText, placeholderText, autoFocus, width = '100%', editMode = true, onScreenChange }) => {
  const [textInput, setTextInput] = useState(initialText || '');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const textareaRef = useRef();
  const { themeStyles } = useGlobalStyle();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (text) => {
    setTextInput(text);
    onInputChange(text);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Determine the style based on whether textInput is empty or not
  const dynamicInputStyle = textInput.length > 0 
    ? [styles.input, styles.inputActive] 
    : styles.input;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 40} // Adjust this value as needed
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.backgroundSvgContainer}>
            <ThoughtBalloonLightBlueSvg color='lightgray' height={410} width={410} />
          </View>
          {editMode ? (
            <TextInput
              style={[dynamicInputStyle, { width: width }]}
              multiline={true}
              value={textInput}
              onChangeText={handleInputChange}
              placeholder={placeholderText}
              ref={textareaRef}
            />
          ) : (
            <Text
              style={[styles.input, { width: width }]}
              numberOfLines={4}
            >
              {textInput || placeholderText}
            </Text>
          )}
          {editMode && (
            <TouchableOpacity onPress={handleOpenModal} style={styles.maxButtonContainer}>
              <MaximizeSquareSolidSvg height={30} width={30} color='limegreen' />
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
      
      <ModalMomentFocus
        isModalVisible={isModalVisible}
        handleCloseModal={handleCloseModal}
        textInput={textInput}
        handleInputChange={handleInputChange}
        placeholderText={placeholderText}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40, // Increased padding to ensure space above the keyboard
  },
  backgroundSvgContainer: {
    width: '100%',  
    marginTop: 90,
    marginLeft: 14,
  },
  input: {
    position: 'absolute', 
    zIndex: 2,
    top: 30, 
    backgroundColor: 'transparent',
    borderRadius: 20,    
    paddingLeft: 94, 
    paddingRight: 30,
    borderWidth: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'black',
    height: '70%',
  },
  inputActive: {
    zIndex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'black',
  },
  maxButtonContainer: {
    position: 'absolute', 
    top: 10,
    right: 14, 
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    zIndex: 2,
  },
  maxButton: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});

export default TextAreaMoment;
