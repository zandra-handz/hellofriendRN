import React from "react";
import { TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import { useFriendList } from "@/src/context/FriendListContext";

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
}) => {
  const { themeAheadOfLoading } = useFriendList();

  const inputRef = React.useRef(null);

  const handleTextChange = (text) => {
    if (inputRef.current) {
      inputRef.current.pulse(300);
    }
    onChangeText(text);
  };

  return (
    <Animatable.View ref={inputRef}>
      <TextInput
        style={[
          style,
          {
            borderColor: loadingNewFriend
              ? themeAheadOfLoading.darkColor
              : themeAheadOfLoading.darkColor,
            color: themeAheadOfLoading.fontColor,
          },
        ]}
        multiline={multiline}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        ref={refProp}
      />
    </Animatable.View>
  );
};

export default AnimatableTextInput;
