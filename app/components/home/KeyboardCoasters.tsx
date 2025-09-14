import { View, Text, Keyboard, StyleSheet } from "react-native";
import React from "react";
import KeyboardCoasterNotNow from "./KeyboardCoasterNotNow";
import ActionUnlockedButton from "../appwide/button/ActionUnlockedButton";
import manualGradientColors  from "@/src/hooks/StaticColors";
interface KeyboardCoastersProps {
  isKeyboardVisible: boolean;
  isFriendSelected: boolean;
  showMomentScreenButton: boolean;
  primaryColor: string;
  onPress: () => void;
}

const KeyboardCoasters: React.FC<KeyboardCoastersProps> = ({
  isKeyboardVisible,
 
  showMomentScreenButton,
  primaryColor,
  onPress,
}) => {
  //console.log("KEYBOARD COASTERS RERENDERED");
  return (
    <>
      {isKeyboardVisible && (
        <KeyboardCoasterNotNow
          primaryColor={primaryColor}
          onPress={() => Keyboard.dismiss()}
        />
      )}

      <View style={styles.absoluteContainer}>
        {showMomentScreenButton && (
          <ActionUnlockedButton
            onPress={onPress}
               primaryColor={primaryColor}
               manualGradientColors={manualGradientColors}
            label={"Pick category"}
            isUnlocked={true}
            includeArrow={true}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    // this button is only used on the home screen and features a unique option toggle
    width: "50%",
    height: 36,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 10,
    bottom: 10,
    right: 0,
  },
  container: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    alignContent: "center",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
});

export default KeyboardCoasters;
