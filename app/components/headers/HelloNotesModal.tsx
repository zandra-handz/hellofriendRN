import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import MomentsSearchBar from "../moments/MomentsSearchBar";
import TextEditBox from "../appwide/input/TextEditBox";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onEnter: () => void;
  textRef: string;
  mountingText: string;
  onTextChange: () => void;
}

const HelloNotesModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  onEnter,
  onTextChange,
  textRef,
  mountingText,
}) => {

      const editedTextRef = useRef(null);
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
  const { capsuleList } = useCapsuleList();
  const [triggerAutoFocus, setTriggerAutoFocus ] = useState();
useEffect(() => {
  setTriggerAutoFocus(true);

  return () => {
    setTriggerAutoFocus(false); // cleanup runs before next effect or on unmount
  };
}, [mountingText]);



  const headerIconSize = 26;
  const searchInputIconSize = 14;
  const autoFocus = true;

  const handleSearchPress = (moment) => {
    onEnter(moment);
    closeModal();
  };

  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"comment-search-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText="Search talking points"
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <TextEditBox
              width={"100%"}
              height={'100%'}
              ref={textRef}
              autoFocus={triggerAutoFocus}
              title={""}
              helperText={"add additional notes here"}
              iconColor={  themeStyles.primaryText.color}
              mountingText={mountingText}
              onTextChange={onTextChange}
              multiline={true}
            />
          </View>
        </ScrollView>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    height: 100,
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
});

export default HelloNotesModal;
