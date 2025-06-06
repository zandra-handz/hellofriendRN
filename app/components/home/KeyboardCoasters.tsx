import { View, Text, Keyboard } from "react-native";
import React from "react";
import KeyboardCoasterMomentOrFriend from "./KeyboardCoasterMomentOrFriend";
import KeyboardCoasterNotNow from "./KeyboardCoasterNotNow";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

interface KeyboardCoastersProps {
  isKeyboardVisible: boolean;
  isFriendSelected: boolean;
  showMomentScreenButton: boolean;
  onPress: () => void;
}

const KeyboardCoasters: React.FC<KeyboardCoastersProps> = ({
  isKeyboardVisible,
  isFriendSelected,
  showMomentScreenButton,
  onPress,
}) => {
  //console.log("KEYBOARD COASTERS RERENDERED");
  return (
    <>
      {isKeyboardVisible && (
        <KeyboardCoasterNotNow onPress={() => Keyboard.dismiss()} />
      )}
 
  
      <KeyboardCoasterMomentOrFriend  // can't put this inside of isKeyboardVisible too unstable to open modal correctly
        onPress={onPress}
        borderRadius={40}
        isFriendSelected={isFriendSelected}
        showMomentScreenButton={showMomentScreenButton}
        isKeyboardVisible={isKeyboardVisible}
      />
       
    </>
  );
};

export default KeyboardCoasters;
