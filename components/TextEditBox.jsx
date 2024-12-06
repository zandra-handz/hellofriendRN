import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

// Forwarding ref to the parent to expose the TextInput value
const TextEditBox = forwardRef(({ title = 'title', startingText = '' }, ref) => {
  const { themeStyles } = useGlobalStyle();
  const [editedMessage, setEditedMessage] = useState(startingText); // Use the starting text passed as prop

  // Expose the current value of the TextInput via the ref
  useImperativeHandle(ref, () => ({
    get value() {
      return editedMessage; // Return the latest value when accessed
    },
    set value(newValue) {
      setEditedMessage(newValue); // Optionally allow setting the value externally
    }
  }));

  useEffect(() => {
    setEditedMessage(startingText); // Reset to starting text if it changes
  }, [startingText]);

  return ( 
      <View style={styles.previewContainer}>
        <Text style={[styles.previewTitle, themeStyles.genericText]}>{title}</Text>
        <TextInput
          autoFocus={true}
          style={[styles.textInput, themeStyles.genericText, themeStyles.genericTextBackgroundShadeTwo]}
          value={editedMessage}
          onChangeText={setEditedMessage} // Update local state
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
