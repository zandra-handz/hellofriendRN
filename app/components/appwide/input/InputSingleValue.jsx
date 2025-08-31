import React, { useState, forwardRef } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
 
const InputSingleValue = forwardRef(
  (
    {
      handleValueChange,
      label = "label",
      placeholder = "placeholder",
      onSubmitEditing,
      inline = false,
      primaryColor='orange',
      primaryBackground='red',
      underlineColor='red',
    },
    ref
  ) => {
    const [value, setValue] = useState(""); 

    const onChangeText = (newValue) => {
      setValue(newValue);
      handleValueChange(newValue);
    };

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.title, {color: primaryColor}]}>{label}</Text>
        )}
        <View style={[styles.inputContainer]}>
          <TextInput
            ref={ref} // Attach the forwarded ref here
            style={[
              styles.textInput,
             
              { color: primaryColor, borderColor: underlineColor},
            ]}
            value={value}
            onSubmitEditing={onSubmitEditing || null}
            placeholder={placeholder}
            placeholderTextColor={"darkgray"}
            onChangeText={onChangeText} // Update internal state and notify parent
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  textInput: {
    borderBottomWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    fontFamily: "Poppins-Regular",
  },
});

export default InputSingleValue;
