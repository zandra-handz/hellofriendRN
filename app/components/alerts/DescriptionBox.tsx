import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Dialog from "react-native-dialog";
import DialogContainer from "react-native-dialog/lib/Container";
import { AppFontStyles } from "@/app/styles/AppFonts";

type Props = {
  isVisible: boolean;
  closeDescription: () => void;
  title: string;
  display: string;
  fontColor: string;
  backgroundColor: string;
  onEdit: () => void;
  onClose: () => void;
};

const DescriptionBox = ({
  title = `title here`,
  display,
  isVisible,
  fontColor,
  backgroundColor,
  onEdit,
  onClose,
}: Props) => {

const flattenedButtonTextStyle = StyleSheet.flatten([AppFontStyles.subWelcomeText, { transform: 'lowercase'}])
    const flattenedContainerStyle = StyleSheet.flatten([styles.container, {backgroundColor: backgroundColor}])
  return (
    <>
      {isVisible && (
        <View style={{ justifyContent: "flex-end", backgroundColor: "red" }}>
          <DialogContainer contentStyle={flattenedContainerStyle} visible={isVisible}>
            <Dialog.Title style={{ color: fontColor }}>{title}</Dialog.Title>
            <Dialog.Description style={{ color: fontColor }}>
              {display}
            </Dialog.Description>

            <Dialog.Button
              label="Close"
              style={flattenedButtonTextStyle}
              onPress={() => onClose(false)}
            />
            <Dialog.Button label="Edit" onPress={onEdit} />
          </DialogContainer>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    borderRadius: 20,
    width: 380,
  },
});

export default DescriptionBox;
