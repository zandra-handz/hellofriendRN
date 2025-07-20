import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
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
        < View contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <MomentsSearchBar
              data={capsuleList}
              autoFocus={isVisible}
              height={40}
              width={"100%"}
              borderColor={themeStyles.primaryText.color}
              placeholderText={"Search"}
              textAndIconColor={themeStyles.primaryText.color}
              backgroundColor={"transparent"}
              onPress={handleSearchPress}
              searchKeys={["capsule", "user_category_name"]}
              iconSize={0}
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

export default SearchModal;
