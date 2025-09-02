import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";  

// Forwarding ref to the parent to expose the TextInput value
const TextEditBox = forwardRef(
  //width and height are original settings being used in location notes
  (
    {
      title = "title",
      mountingText = "Start typing",
      onTextChange,
      helperText,
      autoFocus = true,
      width = "90%",
      height = "60%",
      multiline = true,
      iconColor = "red",
      primaryColor = "orange",
    },
    ref
  ) => {
 
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
          setEditedMessage("");
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
    };

    return (
      <View style={[styles.container, { width: width, height: height }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "auto",
            alignItems: "center",
          }}
        >
          {/* <EditPencilOutlineSvg height={20} width={20} color={iconColor} /> */}
          <View
            style={{
              flexDirection: "row",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Text style={[styles.title, { color: primaryColor }]}>{title}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {helperText && (
            <Text style={[styles.helperText, { color: primaryColor }]}>
              {helperText}
            </Text>
          )}
          <TextInput
            ref={textInputRef}
            autoFocus={autoFocus}
            style={[styles.textInput, { color: primaryColor }]}
            value={editedMessage}
            onChangeText={handleTextInputChange} // Update local state
            multiline={multiline}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: "4%",
  },
  container: {
    borderRadius: 10,
    alignSelf: "center",
    padding: 0,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  helperText: {
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.5,
    //marginLeft: '6%'
    //textTransform: "uppercase",
  },
  textInput: {
    textAlignVertical: "top",
    borderRadius: 20,
    paddingVertical: 10,
    flex: 1,
  },
});

export default TextEditBox;
