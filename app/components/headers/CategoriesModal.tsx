import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SectionUserCategories from "../friends/SectionUserCategories";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
import { useCategories } from "@/src/context/CategoriesContext";
import { showHelperMessage } from "@/src/utils/ShowHelperMessage";
import HelperMessage from "../alerts/HelperMessage";

import ModalInfoText from "./ModalInfoText";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
  isKeyboardVisible: boolean;
  bottomSpacer: number; // added to pass in footer height to put modal above footer, includes padding
}

const CategoriesModal: React.FC<Props> = ({
  isVisible,
  isKeyboardVisible = false,
  closeModal,
  bottomSpacer = 60,
}) => {
  const [helperMessage, setHelperMessage] = useState<null | {
    text: string;
    error: boolean;
  }>(null);
  const { userCategories } = useCategories();
  const { themeStyles, appFontStyles, appSpacingStyles, manualGradientColors } =
    useGlobalStyle();

  return (
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      isKeyboardVisible={isKeyboardVisible}
      borderRadius={60}
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"tree-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      useModalBar={true}
      rightSideButtonItem={
        <MaterialCommunityIcons
          name={`tree`}
          size={50}
          color={manualGradientColors.darkHomeColor}
        />
      }
      questionText="Categories"
      buttonTitle="Categories"
      children={
        <>
          <SectionUserCategories />
          {helperMessage && (
            <HelperMessage
              message={helperMessage.text}
              error={helperMessage.error}
              onClose={() => setHelperMessage(null)}
            />
          )}
        </>
      }
      infoItem={
        <>
          <Pressable
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              backgroundColor: "blue",
            }}
            onPress={() =>
              setHelperMessage({
                text: `Your categories are yours to decide! (${userCategories[0].max_active} total) They can be broad or narrow in scope, silly or serious, every-day or outlandish, niche or normal. All that matters is that they are important to you and you enjoy sharing them! You can rename, delete, and create new categories whenever you like. If you delete a category, all ideas in that category will get permanently moved to the Grab Bag. Current total: ${userCategories.length}`,
                error: false,
              })
            }
          />
          <ModalInfoText
            infoText={`
              
              Current total: ${userCategories.length}`}
          />
        </>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flex: 1,
    paddingBottom: 100,

    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    flex: 1,
    // height: 100,
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

export default CategoriesModal;
