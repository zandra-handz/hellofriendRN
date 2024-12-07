import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

// Forwarding ref to the parent to expose the TextInput value
const TextEditBox = forwardRef(({ title = 'title', mountingText = '', onTextChange }, ref) => {
  const { themeStyles } = useGlobalStyle();
  const [editedMessage, setEditedMessage] = useState(mountingText); // Use the starting text passed as prop
  const textInputRef = useRef();


  useEffect(() => { 
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({ text: mountingText });
      setEditedMessage(mountingText);
    }
  }, []);

  // Expose the current value of the TextInput via the ref
  useImperativeHandle(ref, () => ({
    setText: (text) => {
      if (textInputRef.current) {
        textInputRef.current.setNativeProps({ text });
        setEditedMessage(text); 
      }
    }, 
    clearText: () => {
      if (textInputRef.current) {
        textInputRef.current.clear();
        setEditedMessage(''); 
      }
    },
    getText: () => editedMessage,
  }));
 

  useEffect(() => {
    setEditedMessage(mountingText); // Reset to starting text if it changes
  }, [mountingText]);


  const handleTextInputChange = (text) => {
    console.log(text);
    setEditedMessage(text);
    onTextChange(text);
  }

  return ( 
      <View style={styles.previewContainer}>
        <Text style={[styles.previewTitle, themeStyles.genericText]}>{title}</Text>
        <TextInput
          ref={textInputRef}
          autoFocus={true}
          style={[styles.textInput, themeStyles.genericText, themeStyles.genericTextBackgroundShadeTwo]}
          value={editedMessage}
          onChangeText={handleTextInputChange} // Update local state
          multiline
        />
      </View> 
  );
});

const styles = StyleSheet.create({
  previewContainer: {
    padding: 20,
  },
  previewTitle: {
    fontSize: 16,
    marginBottom: '4%',
  },
  textInput: {
    textAlign: 'top',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    height: 100,
  },
});

export default TextEditBox;
