import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const TextAreaMoment = ({ onInputChange, initialText, placeholderText, autoFocus }) => {
  const [textInput, setTextInput] = useState(initialText || '');
  const textareaRef = useRef();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (text) => {
    setTextInput(text);
    onInputChange(text);
  };

  return (
    <TextInput
      style={styles.input}
      multiline={true}
      value={textInput}
      onChangeText={handleInputChange}
      placeholder={placeholderText}
      ref={textareaRef}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%', // Take up full width of parent container
    borderWidth: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: 'black',
  },
});

export default TextAreaMoment;
