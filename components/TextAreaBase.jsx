import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import ModalHelloNotesFocus from '../components/ModalHelloNotesFocus';
import MaximizeOutlineSvg from '../assets/svgs/maximize-outline.svg';  

import { useGlobalStyle } from '../context/GlobalStyleContext';

const TextAreaBase = ({ 
    containerText='hi',
    onInputChange, 
    initialText='', 
    placeholderText='Please set placeholder text',   
    width='100%',
    editMode=true, 
    resetText=false,
 }) => {

    const { themeStyles } = useGlobalStyle();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [textInput, setTextInput] = useState(initialText || '');
    const [isEditMode, setIsEditMode] = useState(editMode);  
    const textareaRef = useRef();

    useEffect(() => {
        if (resetText) { 
          setTextInput('');  
        }
      }, [resetText]); 

    const handleInputChange = (text) => {
        setTextInput(text);
        onInputChange(text);
    };

    const dynamicInputStyle = textInput.length > 0 
        ? [styles.input, styles.inputActive, themeStyles.genericText] 
        : styles.input;

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);  // Toggle between edit and display mode
    };

    const handleKeyPress = (e) => {
        if (e.nativeEvent.key === 'Enter') {
            toggleEditMode();
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 40} 
        >
            <Text style={[styles.title, themeStyles.subHeaderText]}>
                {containerText}
            </Text>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.inner, themeStyles.genericTextBackgroundShadeTwo]}>
                    {isEditMode ? (
                    <TextInput
                        style={[dynamicInputStyle, { width: width }]}
                        multiline={true}
                        value={textInput}
                        onChangeText={handleInputChange}
                        placeholder={placeholderText}
                        ref={textareaRef}
                        onKeyPress={handleKeyPress} 
                    />
                    ) : (
                    <Text
                        style={[styles.displayText, { width: width }]}
                        numberOfLines={3}
                    >
                        {textInput || placeholderText}
                    </Text>
                    )}

                    {textInput && (  
                    <TouchableOpacity onPress={toggleEditMode} style={styles.toggleButton}>
                       
                        <Text style={styles.toggleButtonText}>
                            {isEditMode ? 'Done' : 'Edit'}
                        </Text>
                    </TouchableOpacity>
                  )}
                    {isEditMode && (
                    <TouchableOpacity onPress={handleOpenModal} style={styles.maxButtonContainer}>
                        <MaximizeOutlineSvg height={30} width={30} color={themeStyles.genericIcon.color} />
                    </TouchableOpacity>
                    )}

                </View>
            </TouchableWithoutFeedback>
          <ModalHelloNotesFocus
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
      width: '100%',
      height: 240,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        marginBottom: 4,
      },
    inner: {
        flex: 1,   
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'dimgray',
    },
    input: { 
      zIndex: 2, 
      backgroundColor: 'transparent',
      borderRadius: 20, 
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      color: 'black',  
      overflow: 'hidden',  
      paddingRight: 40,
        
    },
    inputActive: {
      zIndex: 1,
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      color: 'black',
    },
    displayText: {
      zIndex: 2, 
      backgroundColor: 'transparent',
      borderRadius: 20, 
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      color: 'black',  
      overflow: 'hidden',  
      paddingRight: 40,
    },
    maxButtonContainer: {
      position: 'absolute',
      top: -12,
      right: -12,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      zIndex: 2,
    },
    toggleButton: {
      position: 'absolute',
      top: 58,
      right: 8,
      padding: 10,
      paddingVertical: 8,
      backgroundColor: '#ddd',
      borderRadius: 20,
    },
    toggleButtonText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: 'black',
    
    },
  });
  
  export default TextAreaBase;
