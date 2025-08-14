import React, { useState } from "react"; 

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
  
import { useHelloes } from "@/src/context/HelloesContext";
import { MaterialCommunityIcons  } from "@expo/vector-icons";
 
import HelloQuickView from "../alerts/HelloQuickView";
import CategoryFriendHistoryList from "./CategoryFriendHistoryList";
import { daysSincedDateField } from "@/src/utils/DaysSince"; 
import ModalListWithView from "../alerts/ModalListWithView";
import { ItemViewProps } from "@/src/types/MiscTypes";
import InfoItem from "./InfoItem";

interface Props {
  title: string;
  isVisible: boolean;
  closeModal: () => void;
  friendId: number;
  categoryId: number;
  categoryName?: string;
}

// method of getting capsule count is TEMPORARY, likely need to change the backend/ backend call being
// made in SelectedFriendStatsContext to just return the count of capsules, and only fetch
// the capsules when needed, using the same hook as the user categories (already doing this)
// and get the count here from the backend as a capsule_ids list like we're doing for the overall user history
const CategoryFriendHistoryModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  title,
  friendId = null,
  categoryId = 3,
  categoryName = 'Category name',
}) => {
  const { themeStyles, appSpacingStyles, appFontStyles, manualGradientColors } =
    useGlobalStyle(); 
  const { helloesList } = useHelloes();

 

  const [quickView, setQuickView] = useState<null | ItemViewProps >(null);

  if (!friendId) {
    return;
  }


  const handleNullQuickView = () => {
    setQuickView(null);

  };
 

  const handleViewHello = (id, momentOriginalId) => {
    const helloIndex = helloesList.findIndex((hello) => hello.id === id);
    const helloObject = helloIndex !== -1 ? helloesList[helloIndex] : null;

    if (helloObject != undefined) {
      const daysSince = daysSincedDateField(helloObject.date);

      const word = Number(daysSince) != 1 ? `days` : `day`;
      console.log("helloobject@@");
      setQuickView({
        topBarText: `Hello on ${helloObject.past_date_in_words}   |   ${daysSince} ${word} ago`,
        view: <HelloQuickView data={helloObject} momentOriginalId={momentOriginalId} index={helloIndex} />,
        message: `hi hi hi`,
        update: false,
      });
    }
  }; 

  const FOOTER_BUTTON_SPACE = 40;
 

  return (
   
      <ModalListWithView
        bottomSpacer={FOOTER_BUTTON_SPACE}
        borderRadius={60}
        isVisible={isVisible}
        helpModeTitle="Help mode: Category History"
        useModalBar={true}
        quickView={quickView}
        nullQuickView={handleNullQuickView}
        infoItem={<InfoItem infoText={`Category: ${categoryName}`} />}
        rightSideButtonItem={
          <MaterialCommunityIcons
            name={`tree`}
            size={30}
            color={manualGradientColors.darkHomeColor}
          />
        }
        children={
          <> 
            <CategoryFriendHistoryList
              categoryId={categoryId}
              closeModal={closeModal}
              onViewHelloPress={handleViewHello}
            />
          </>
        }
        onClose={closeModal}
      /> 
  );
};
 

export default CategoryFriendHistoryModal;
