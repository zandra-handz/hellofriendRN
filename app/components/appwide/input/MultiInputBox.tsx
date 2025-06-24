import { View, Text, TextInput } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

interface Props {
  value: string;
  onChangeText: () => void;

  autoFocus: boolean; //triggers autofocus when outer modal is visible
}

const MultiInputBox: React.FC<Props> = ({ value, onChangeText, autoFocus }) => {
  const { themeStyles } = useGlobalStyle();

  const textInputRef = useRef(value);

  const [triggerAutoFocus, setTriggerAutoFocus] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      const timeout = setTimeout(() => {
        setTriggerAutoFocus(true);
        console.log("autofocus triggered");
        if (textInputRef && textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 100); // adjust delay (in ms) as needed

      return () => clearTimeout(timeout); // cleanup if autoFocus changes early
    }
  }, [autoFocus]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        ref={textInputRef}
        autoFocus={triggerAutoFocus}
        style={[
          themeStyles.genericText, 
        ]}
        value={value}
        onChangeText={onChangeText}
        multiline
      />
    </View>
  );
};

export default MultiInputBox;
