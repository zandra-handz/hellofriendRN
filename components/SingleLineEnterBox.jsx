import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import QuickSaveButton from "../components/QuickSaveButton";
// Forwarding ref to the parent to expose the TextInput value
const SingleLineEnterBox = forwardRef(
  //width and height are original settings being used in location notes
  (
    {
      title = "title",
      mountingText = "",
      onTextChange,
      onSave,
      helperText,
      autoFocus = true,
      width = "100%",
      height = "100%",
      iconColor = "transparent",
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
    }));

    const handleOnEnterPress = () => {
      if (ref && ref.current) {
        const currentText = ref.current.getText();
        onEnterPress(currentText);
      }
    };

    const handleQuickSave = () => {
      if (ref && ref.current) {
        const currentText = ref.current.getText();
        onSave(currentText);
      }
    };

    useEffect(() => {
      setEditedMessage(mountingText); // Reset to starting text if it changes
    }, [mountingText]);

    const handleTextInputChange = (text) => {
     // console.log(text);
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
            height: "100%",
            alignItems: "center", 
          }}
        >
          <View
            style={{
              flexDirection: "row",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Text style={[styles.title, themeStyles.genericText]}>{title}</Text>
          </View>
          <View
            style={{
              width: "100%",
              flexShrink: 1,
              height: "100%",
              alignContent: "center",
              justifyContent: "center", 
            }}
          >
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
          {editedMessage.length > 0 && (
            <View
              style={{
                height: "100%", 
                width: 80, 
                justifyContent: 'center',
                //position: "absolute",
              }}
            >
              <QuickSaveButton
                isDisabled={!editedMessage}
                label="Save"
                height='70%'
                onPress={handleQuickSave}
              />
            </View>
          )}
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
    alignItems: "center",
    textTransform: "uppercase",
    height: "auto",
  },
  helperText: {
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.5,
    //marginLeft: '6%'
    //textTransform: "uppercase",
  },
  textInput: {
    fontSize: 15,
    textAlignVertical: "center",
    justifyContent: "center",
    backgroundColor: "teal",
    borderRadius: 20,
    paddingVertical: 0,
    flex: 1,
    //flex: 1,
  },
});

export default SingleLineEnterBox;
