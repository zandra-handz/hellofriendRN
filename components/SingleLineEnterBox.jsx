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
const SingleLineEnterBox = forwardRef(
  //width and height are original settings being used in location notes
  (
    {
      title = "title",
      mountingText = "",
      onTextChange,
      helperText,
      autoFocus = true,
      width = "90%",
      height = "60%", 
      iconColor = 'transparent',
      onEnterPress = () => {}, //onCategorySelect(text) , sets text as the category in the parent
    },
    ref
  ) => {
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
    }));4

    const handleOnEnterPress = () => {
      if (ref && ref.current) {
        const currentText = ref.current.getText();
        onEnterPress(currentText);
      }
      

    };

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
        style={[
          styles.container,
          themeStyles.genericTextBackgroundShadeTwo,
          { width: width, height: height },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "auto",
            alignItems: 'center',
          }}
        >
          <View style={{flexDirection: 'row', height: '100%', alignItems: 'center'}}>
          <Text style={[styles.title, themeStyles.genericText]}>
            {title}
          </Text>
          </View>

          <View style={{ flex: 1 }}>

{helperText && (
    <Text style={[styles.helperText, themeStyles.genericText]}>
      {helperText}
    </Text>
  )}
  <TextInput
    ref={textInputRef}
    autoFocus={autoFocus}
    style={[
      styles.textInput,
      themeStyles.genericText,
      themeStyles.genericTextBackgroundShadeTwo,
    ]}
    onSubmitEditing={handleOnEnterPress}
    value={editedMessage}
    onChangeText={handleTextInputChange} // Update local state
    multiline={false}
  />
</View>

          <EditPencilOutlineSvg height={30} width={30} color={iconColor} />
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
    opacity: .5,
    //marginLeft: '6%'
    //textTransform: "uppercase",
  },
  textInput: {
    textAlignVertical: "center",
    justifyContent: 'center',
    backgroundColor: 'teal',
    borderRadius: 20,
    paddingVertical: 0,
    flex: 1,
  },
});

export default SingleLineEnterBox;
