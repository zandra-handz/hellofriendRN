import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const StyledPlaceholder = ({
  placeholder = "Enter text...",
  placeholderStyle,
  inputStyle,
  value,
  onChangeText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {!value && !isFocused && (
        <Text style={[styles.placeholder, placeholderStyle]}>
          {placeholder}
        </Text>
      )}
      <TextInput
        style={[styles.textInput, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 16,
    color: 'gray', // Default placeholder color
  },
  textInput: {
    fontSize: 16,
    color: 'black', // Default text color
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});

export default StyledPlaceholder;
