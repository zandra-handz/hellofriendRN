import React from "react";
import { StyleSheet, View, Modal, Text, Pressable } from "react-native";

import SvgIcon from "@/app/styles/SvgIcons";
import PlainSafeView from "../appwide/format/PlainSafeView";

interface Props {
  isVisible: boolean;
  isFullscreen: boolean;
  headerIcon: React.ReactElement;
  questionText: string;
  children: React.ReactElement;
  borderRadius?: number;
  primaryColor: string;
  backgroundColor: string;
  contentPadding?: number;
  onClose: () => void;
}

const AppModal: React.FC<Props> = ({
  isVisible,
  primaryColor,
  backgroundColor,
  questionText,
  children,
  borderRadius = 40,
  contentPadding = 10,

  onClose,
  modalIsTransparent = true,
  padding = 10,
  useCloseButton = false,
}) => {
  return (
    <Modal
      transparent={modalIsTransparent}
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      visible={isVisible}
      backdropColor={backgroundColor}
      // style={modalAnimationStyle}
      animationType="slide"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <View style={[styles.modalContainer]}>
        <PlainSafeView style={{ flex: 1 }}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                padding: padding,
              },
            ]}
          >
            <View
              style={[
                styles.headerContainer,
                {
                  paddingTop: contentPadding,
                  paddingHorizontal: contentPadding,
                },
              ]}
            >
              {questionText && (
                <Text style={[styles.questionText, { color: primaryColor }]}>
                  {questionText}
                </Text>
              )}
            </View>
            <View style={{ flex: 1 }}>{children}</View>
          </View>
          {useCloseButton && (
            <View style={styles.closeButtonWrapper}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <SvgIcon name={`close`} color={primaryColor} size={24} />
              </Pressable>
            </View>
          )}
        </PlainSafeView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10
  },
  closeButtonWrapper: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 30,
  },
  closeX: {
    fontSize: 25,
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  modalContent: {
    width: "100%",
 
    flex: 1,

    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",

    height: 50,
    marginBottom: 10, // header spacing
    alignItems: "center",
    justifyContent: "flex-start",
  },
  questionText: {
    fontSize: 24,
    textAlign: "center",
    // marginLeft: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    width: "100%",
    height: "8%",
    alignItems: "center",
  },
});

export default AppModal;
