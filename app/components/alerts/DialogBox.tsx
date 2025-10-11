import { View, Text } from "react-native";
import React from "react";
import Dialog from "react-native-dialog";

type Props = {
  onPress: () => void;
  onTextChange: () => void;
  isVisible: boolean;
  onClose: () => void;
  autoFocus: boolean;
  title: string;
  inputType: string;
};

const DialogBox = ({
  isVisible,
  onPress,
  onClose,
  autoFocus,
  onChangeText,
  value,
  title = "Add phone number",
  keyboardType = "phone-pad", //originally made this for quickly adding friend phone number
  maxLength = 15,
}: Props) => {


  
  return (
    <>
      {isVisible && (
        <View>
          <Dialog.Container
            contentStyle={{
              backgroundColor: "red",
              borderRadius: 20,
              width: 300,
            }}
            visible={isVisible}
          >
            <Dialog.Title style={{ color: ["green"] }}>{title}</Dialog.Title>
            <Dialog.Input
              value={value}
              autoFocus={isVisible}
              keyboardType={keyboardType} // shows only number pad with phone characters
              maxLength={maxLength}
              onChangeText={onChangeText}
            />
            <Dialog.Button label="Cancel" onPress={() => onClose(false)} />
            <Dialog.Button label="OK" onPress={onPress} />
          </Dialog.Container>
        </View>
      )}
    </>
  );
};

export default DialogBox;
