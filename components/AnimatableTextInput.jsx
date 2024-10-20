import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable'; // Import animatable

const AnimatableTextInput = ({
  style,
  multiline,
  value,
  onChangeText,
  placeholder,
  autoFocus,
  refProp,
  loadingNewFriend,
  themeAheadOfLoading,
  calculatedThemeColors
}) => {
  
  // Create a ref for animating the input
  const inputRef = React.useRef(null);

  const handleTextChange = (text) => {
    if (inputRef.current) {
      inputRef.current.pulse(300); // Trigger 'pulse' animation every time text changes
    }
    onChangeText(text); // Call the passed in onChangeText handler to update the state
  };

  return (
    <Animatable.View ref={inputRef}> {/* Animatable wrapper for animations */}
      <TextInput
        style={[
          style, 
          {
            borderColor: loadingNewFriend 
              ? themeAheadOfLoading.darkColor 
              : calculatedThemeColors.darkColor,
            color: calculatedThemeColors.fontColor,
          }
        ]}
        multiline={multiline}
        value={value}
        onChangeText={handleTextChange} // Custom handler to trigger animation and pass text
        placeholder={placeholder}
        autoFocus={autoFocus}
        ref={refProp} // Pass the ref from props if needed
      />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles here
});

export default AnimatableTextInput;
