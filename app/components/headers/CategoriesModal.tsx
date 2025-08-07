import React from "react";
import {
  View, 
  StyleSheet, 
} from "react-native"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import SectionUserCategories from "../friends/SectionUserCategories";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import ModalScaleLikeTree from "../alerts/ModalScaleLikeTree";
interface Props {
  isVisible: boolean;
  closeModal: () => void; 
  isKeyboardVisible: boolean;
  bottomSpacer: number; // added to pass in footer height to put modal above footer, includes padding
}

const CategoriesModal: React.FC<Props> = ({
  isVisible,
  isKeyboardVisible=false,
  closeModal, 
  bottomSpacer=60,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
 
 
   

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
      questionText="Categories"
      children={
        < View style={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <SectionUserCategories/>
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

export default CategoriesModal;
