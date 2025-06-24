import React, { useState } from "react";
import { View, TextInput, ScrollView, StyleSheet } from "react-native";
import ModalWithoutSubmit from "../alerts/ModalWithoutSubmit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import MomentsSearchBar from "../moments/MomentsSearchBar";
import MultiInputBox from "../appwide/input/MultiInputBox";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  value: string;
  onChangeText: () => void;
  ref: string;
}

// Autofocus approach is from SearchModal
const MultilineInputModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  value,
  onChangeText,
  ref=null,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
  const { capsuleList } = useCapsuleList();

  const headerIconSize = 26;
  const searchInputIconSize = 14;
  const autoFocus = true;

  const handleSearchPress = (moment) => {
    onSearchPress(moment);
    closeModal();
  };


  
  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

  return (
    <ModalWithoutSubmit
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"pencil"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText="Edit message"
      children={
        < View contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <MultiInputBox  
            value={value}
            onChangeText={onChangeText}
              autoFocus={isVisible}
              // height={40}
              // width={"100%"}
              // borderColor={themeStyles.primaryText.color}
              // placeholderText={"Search"}
              // textAndIconColor={themeStyles.primaryText.color}
              // backgroundColor={"transparent"}
              // onPress={handleSearchPress}
              // searchKeys={["capsule", "typedCategory"]}
              // iconSize={0}
            />
          </View>
        </ View>
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
    width: '100%',
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

export default MultilineInputModal;
