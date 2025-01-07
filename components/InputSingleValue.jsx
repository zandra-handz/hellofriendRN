import React, { useState, forwardRef } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const InputSingleValue = forwardRef(
  ({ handleValueChange, label = 'label', placeholder = 'placeholder', onSubmitEditing, inline = false }, ref) => {
    const [value, setValue] = useState('');
    const { themeStyles } = useGlobalStyle();

    const onChangeText = (newValue) => {
      setValue(newValue);
      handleValueChange(newValue);
    };

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.title, themeStyles.subHeaderText]}>
            {label}
          </Text>
        )}
        <View style={[styles.inputContainer]}>
          <TextInput
            ref={ref} // Attach the forwarded ref here
            style={[
              styles.textInput,
              themeStyles.genericText,
              themeStyles.genericTextBackgroundShadeTwo,
              { borderColor: themeStyles.genericTextBackground },
            ]}
            value={value}
            onSubmitEditing={onSubmitEditing || null}
            placeholder={placeholder}
            placeholderTextColor={'darkgray'}
            onChangeText={onChangeText} // Update internal state and notify parent
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  textInput: {
    borderBottomWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
});

export default InputSingleValue;
