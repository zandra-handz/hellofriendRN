import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import InfoItem from "./InfoItem";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ModalListWithView from "../alerts/ModalListWithView";
import { ItemViewProps } from "@/src/types/MiscTypes";
import { useUserStats } from "@/src/context/UserStatsContext";
import UserCategoryHistoryList from "./UserCategoryHistoryList";

import { MaterialCommunityIcons } from "@expo/vector-icons";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
  categoryId: number;
}

const CategoryHistoryModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  title,
  categoryId = 3,
}) => {
  const {  manualGradientColors } = useGlobalStyle();

  const { stats } = useUserStats();
  const [completedCapsuleCount, setCompletedCapsuleCount] = useState(0);
 
  useEffect(() => {
    if (categoryId && stats) {
      const matchedCategoryStats = stats.find(
        (category) => category.id === categoryId
      );

      if (matchedCategoryStats && matchedCategoryStats?.capsule_ids) {
        const count = matchedCategoryStats?.capsule_ids?.length;

        setCompletedCapsuleCount(count);
      }
    }
  }, [categoryId, stats]);

  const FOOTER_BUTTON_SPACE = 40;

  return (
    <ModalListWithView
      bottomSpacer={FOOTER_BUTTON_SPACE}
      borderRadius={60}
      isVisible={isVisible}
      helpModeTitle="Help mode: Category History"
      useModalBar={true}
      infoItem={<InfoItem infoText={`${title} (${completedCapsuleCount})`} />}
      rightSideButtonItem={
        <MaterialCommunityIcons
          name={`tree`}
          size={30}
          color={manualGradientColors.darkHomeColor}
        />
      }
      children={<UserCategoryHistoryList categoryId={categoryId} />}
      onClose={closeModal}
    />
  );
};

export default CategoryHistoryModal;
