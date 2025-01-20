import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  AccessibilityInfo,
  PanResponder,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useGlobalStyle } from "../context/GlobalStyleContext";

const ActionPageBase = ({
  visible,
  onClose,
  sections,
  showFooter = false,
  footerContent,
}) => {
  const globalStyles = useGlobalStyle();
  const { themeStyles } = useGlobalStyle();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        }
      },
    })
  ).current;

  useEffect(() => {
    const handleAccessibilityAnnouncement = () => {
      AccessibilityInfo.announceForAccessibility(
        visible ? "Modal opened." : "Modal closed."
      );
    };

    if (visible) {
      handleAccessibilityAnnouncement();
    }
  }, [visible]); 

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay} {...panResponder.panHandlers}>
        <View style={[styles.container, themeStyles.genericTextBackgroundShadeTwo]}>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            style={styles.closeButton}
          >
            <View flexDirection="row">
              <Text style={styles.closeButtonText}></Text>
              <FontAwesome5
                name="times"
                size={14}
                color="white"
                solid={false}
              />
            </View>
          </TouchableOpacity> 
          <View
            accessible={true}
            accessibilityRole="adjustable"
            accessibilityLabel="Modal Content"
            importantForAccessibility="yes"
          >
            {sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <View style={styles.subTitleRow}>
                  <Text style={[styles.modalSubTitle, themeStyles.modalText]}>
                    {section.title}
                  </Text>
                </View>
                {section.content}
                <View
                  style={[
                    styles.divider,
                    { borderBottomColor: themeStyles.modalText.color },
                  ]}
                ></View>
              </View>
            ))}
            
              
            {showFooter && (
              <View style={styles.footer}>
                <Text style={[styles.footerText, themeStyles.genericText]}>
                  {footerContent}
                </Text>
              </View>
            )}
          </View> 
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  containerCover: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
    alignSelf: "flex-start",
    flex: 1,
  },
  subTitleRow: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 20, //lowered this from ModalColorTheme
  },
  closeButton: {
    flex: 1,
    position: "absolute",
    top: 16,
    right: 10,
    borderRadius: 50,
    textAlign: "center",
    backgroundColor: "black",
    zIndex: 1,
    padding: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  closeButtonText: {
    fontFamily: "Poppins-Regular",
    color: "white",
    alignContent: "center",
  },
  section: {
    marginBottom: 10,
  },
  modalSubTitle: {
    fontSize: 19,
    fontFamily: "Poppins-Regular",
  },
  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  footer: {
    paddingTop: 10,
    alignItems: "center",
  },
  footerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
});

export default ActionPageBase;
