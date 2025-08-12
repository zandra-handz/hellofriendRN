import React, { useState } from "react";
import { View } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SectionUserCategories from "../friends/SectionUserCategories";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
import { useCategories } from "@/src/context/CategoriesContext";
import HelperMessage from "../alerts/HelperMessage";
import InfoItem from "./InfoItem";

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
  const { manualGradientColors } = useGlobalStyle();

  return (
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      isKeyboardVisible={isKeyboardVisible}
      borderRadius={60}
      isVisible={isVisible}
      helpModeTitle="Help mode: Categories"
      useModalBar={true}
      rightSideButtonItem={
        <MaterialCommunityIcons
          name={`tree`}
          size={50}
          color={manualGradientColors.darkHomeColor}
        />
      }
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
      helperMessageText={`Your categories are yours to decide! They can be broad or narrow in scope, silly or serious, every-day or outlandish, niche or normal. All that matters is that they are important to you and you enjoy sharing them! You can rename, delete, and create new categories whenever you like. If you delete a category, all pending ideas in that category will get permanently moved to the Grab Bag. Items already hello'ed to deleted categories will be removed from your history charts.`}
      infoItem={
        <InfoItem
          infoText={`${userCategories.length} / ${userCategories[0].max_active} added`}
        />
      }
      onClose={closeModal}
    />
  );
};

export default CategoriesModal;
