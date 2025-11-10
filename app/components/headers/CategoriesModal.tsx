import React, {  useState } from "react";
 
import SvgIcon from "@/app/styles/SvgIcons";
import SectionUserCategories from "../friends/SectionUserCategories";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
import HelperMessage from "../alerts/HelperMessage"; 
import InfoItem from "./InfoItem";
import manualGradientColors from "@/app/styles/StaticColors";
// import { useCategories } from "@/src/context/CategoriesContext";
import useCategories from "@/src/hooks/useCategories";
import { ColorValue } from "react-native";
interface Props {
  userId: number;
  isVisible: boolean;
  closeModal: () => void;
  isKeyboardVisible: boolean;
  bottomSpacer: number; // added to pass in footer height to put modal above footer, includes padding
  primaryColor: ColorValue;
 
}

const CategoriesModal: React.FC<Props> = ({
  userId,
  
  primaryColor, 
  isVisible,
  isKeyboardVisible = false,
  closeModal,
  bottomSpacer = 60,
}) => {

  const { userCategories} = useCategories({userId: userId});
  const [helperMessage, setHelperMessage] = useState<null | {
    text: string;
    error: boolean;
  }>(null);


 
  return (
    <ModalScaleLikeTree
      bottomSpacer={bottomSpacer}
      isKeyboardVisible={isKeyboardVisible}
      borderRadius={60}
      isVisible={isVisible}
      helpModeTitle="Help mode: Categories"
      useModalBar={true}
      rightSideButtonItem={
        <SvgIcon
          name={`tree`}
          size={50}
          color={manualGradientColors.darkHomeColor}
        />
      }
      buttonTitle="Categories"
      children={
        <>
          <SectionUserCategories
            userId={userId}
            userCategories={userCategories} 
            primaryColor={primaryColor} 
          />
          {helperMessage && (
            <HelperMessage
              message={helperMessage.text}
              update={helperMessage.error}
              onClose={() => setHelperMessage(null)}
            />
          )}
        </>
      }
      helperMessageText={`Your categories are yours to decide! They can be broad or narrow in scope, silly or serious, every-day or outlandish, niche or normal. All that matters is that they are important to you and you enjoy sharing them! You can rename, delete, and create new categories whenever you like. If you delete a category, all pending ideas in that category will get permanently moved to the Grab Bag. Items already hello'ed to deleted categories will be removed from your history charts.`}
      infoItem={
        <>
          {userCategories.length > 0 && (
            <InfoItem primaryColor={primaryColor}
              infoText={`${userCategories.length} / ${userCategories[0].max_active} added`}
            />
          )}
        </>
      }
      onClose={closeModal}
    />
  );
};

export default CategoriesModal;
