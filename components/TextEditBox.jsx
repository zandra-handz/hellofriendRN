import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import EditPencilOutlineSvg from "../assets/svgs/edit-pencil-outline.svg";

// Forwarding ref to the parent to expose the TextInput value
const TextEditBox = forwardRef(
  //width and height are original settings being used in location notes
  ({ title = "title", mountingText = "", onTextChange, autoFocus=true, width='90%', height='60%', multiline=true }, ref) => {
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
        <View
          style={[styles.container, themeStyles.genericTextBackgroundShadeTwo, {width: width, height: height}]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              height: "auto",
            }}
          >
            <Text style={[styles.previewTitle, themeStyles.genericText]}>
              {title}
            </Text>
            <EditPencilOutlineSvg
              height={30}
              width={30}
              color={'red'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              ref={textInputRef}
              autoFocus={autoFocus}
              style={[
                styles.textInput,
                themeStyles.genericText,
                themeStyles.genericTextBackgroundShadeTwo,
              ]}
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
    borderRadius: 30,  
    alignSelf: 'center', 
    padding: 20, 
  },
  previewTitle: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  textInput: {
    textAlignVertical: "top",
    borderRadius: 20,
    padding: 10,
    flex: 1,
  },
});

export default TextEditBox;
