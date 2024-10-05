import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';

import MaximizeOutlineSvg from '../assets/svgs/maximize-outline.svg';  
import ThoughtBubbleOutlineEditedSvg from '../assets/svgs/thought-bubble-outline-edited.svg'; // Import the SVG

import ModalMomentFocus from '../components/ModalMomentFocus'; // Import the new component
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const TextAreaMomentSimpler = ({ 
  onInputChange, 
  initialText, 
  placeholderText,  
  autoFocus, 
  width = '100%', 
  editMode = true,  
  resetText = false,   
}) => {
  const [textInput, setTextInput] = useState(initialText || '');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const textareaRef = useRef();
  const [resetAutoFocus, setAutoFocus] = useState(false);
  const { themeStyles } = useGlobalStyle();

  useEffect(() => {
    if (autoFocus || resetAutoFocus) {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      setAutoFocus(false);  
    }
  }, [autoFocus, resetAutoFocus]);

  useEffect(() => {
    if (!isModalVisible) {
      setAutoFocus(true); // Trigger focus when modal closes
    }
  }, [isModalVisible]);
 

  useEffect(() => {
    if (resetText) {
      console.log('reset text area text');
      setTextInput(''); 
      setAutoFocus(true);
    }
  }, [resetText]);  

  const handleInputChange = (text) => {
    setTextInput(text);
    onInputChange(text);
  }; 
 
  const dynamicInputStyle = textInput.length > 0 
    ? [styles.inputActive] 
    : styles.input;

  return ( 
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 40}  
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
       
        <View style={styles.inner}>  
          <View style={{width: '100%', flex: 1}}>
            <ThoughtBubbleOutlineEditedSvg color={!editMode ? themeStyles.modalIconColor.color : 'transparent'} width={430} height={510} />
          </View> 
          {editMode ? (
            <TextInput
              style={[dynamicInputStyle, themeStyles.genericText, { width: '100%' }]}
              multiline={true}
              value={textInput}
              onChangeText={handleInputChange}
              placeholder={placeholderText} 
              ref={textareaRef}
            />
          ) : (
            <Text
              style={[styles.input, themeStyles.genericText, { width: width }]}
              numberOfLines={8}
            >
              {textInput || placeholderText}
            </Text>
          )} 
        </View>
      </TouchableWithoutFeedback>
       
    </KeyboardAvoidingView> 
  );
};

const styles = StyleSheet.create({
  container: {   
    
  },
  inner: {       
    height: 400,  
    justifyContent: 'center',  
    }, 
  input: {
    position: 'absolute',
    zIndex: 2,
    top: 80,
    left: 38,  
    right: 14, 
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: 18, 
    height: '40%',
    textAlignVertical: 'top',  
    overflow: 'hidden',  
    maxWidth: '87%',  
  },
  inputActive: {
    zIndex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 18, 
    position: 'absolute',
    zIndex: 2,
    top: 20,
    left: 20,  
    right: 20, 
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: 18, 
    height: '68%',
    textAlignVertical: 'top',  
    overflow: 'hidden',  
    maxWidth: '87%', 
  },
  maxButtonContainer: {
    position: 'absolute',
    top: 30,
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

export default TextAreaMomentSimpler;
