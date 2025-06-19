import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ModalWithoutSubmit from "../alerts/ModalWithoutSubmit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import MomentsSearchBar from "../moments/MomentsSearchBar";

import { useCapsuleList } from "@/src/context/CapsuleListContext";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onSearchPress: () => void;
}

const SearchModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  onSearchPress,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
  const { capsuleList } = useCapsuleList();

  const headerIconSize = 26;
  const searchInputIconSize = 14;
  const autoFocus = true;

  const handleSearchPress = () => {
    onSearchPress();
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
          name={"comment-search-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText="Search talking points"
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <MomentsSearchBar
              data={capsuleList}
              autoFocus={autoFocus}
              height={25}
              width={"47%"}
              borderColor={themeStyles.primaryText.color}
              placeholderText={"Search"}
              textAndIconColor={themeStyles.primaryText.color}
              backgroundColor={"transparent"}
              onPress={handleSearchPress}
              searchKeys={["capsule", "typedCategory"]}
              iconSize={searchInputIconSize}
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
    margin: "2%",
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

export default SearchModal;
