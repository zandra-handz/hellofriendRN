import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import { TouchableOpacity, AccessibilityInfo } from "react-native";

import InfoOutlineSvg from "@/app/assets/svgs/info-outline.svg";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ModalWithGoBack from "../alerts/ModalWithGoBack";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  children: React.ReactElement;
}

const CategoryItemsModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  title,
  data,
}) => {
  const { themeStyles, appSpacingStyles, appFontStyles } = useGlobalStyle();

  const headerIconSize = 26;

  // React.useEffect(() => {
  //   if (isModalVisible) {
  //     AccessibilityInfo.announceForAccessibility("Information opened");
  //   }
  // }, [isModalVisible]);

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: 26}]}>#</Text>
        // <MaterialIcons
        //   name={"category"}
        //   size={appSpacingStyles.modalHeaderIconSize}
        //   color={themeStyles.modalIconColor.color}
        // />
      }
      questionText={title}
      children={
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.momentCheckboxContainer}>
              <View style={styles.momentItemTextContainer}>
                <View style={{ height: "100%" }}>
                  <View style={styles.checkboxContainer}>
                    <MaterialCommunityIcons
                      name={"message"}
                      size={24}
                      color={themeStyles.modalIconColor.color}
                    />
                  </View>
                </View>
                <View style={{ width: "86%" }}>
                  <Text
                    style={[styles.momentItemText, themeStyles.genericText]}
                  >
                    {item.capsule}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
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
  momentItemTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 20,
    width: "100%",
    borderBottomWidth: 0.4,
    borderBottomColor: "#fff",
  },
  newMomentItemTextContainer: {
    flexDirection: "row", // Allows text to wrap
    // Ensures text wraps to the next line
    alignItems: "flex-start", // Aligns text to the top
    marginBottom: 10,
    paddingBottom: 20,
    maxHeight: 200,
    width: "100%",
  },
  momentItemText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    width: "100%",
  },
  newMomentItemText: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
    width: "100%",
  },
  momentModalContainer: {
    width: "100%",
    borderRadius: 10,
    padding: 0,

    height: 480,
    maxHeight: "80&",
    alignItems: "center",
  },
  momentCheckboxContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: 4,
    paddingRight: 10,
    paddingLeft: 6,
  },
});

export default CategoryItemsModal;
