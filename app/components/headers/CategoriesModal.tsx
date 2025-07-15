import React from "react";
import {
  View, 
  StyleSheet, 
} from "react-native"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import SectionUserCategories from "../friends/SectionUserCategories";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onSearchPress: () => void;
}

const CategoriesModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  onSearchPress,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
 
 
   

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"comment-outline"}
          size={appSpacingStyles.modalHeaderIconSize}
          color={themeStyles.footerIcon.color}
        />
      }
      questionText="Categories"
      children={
        < View contentContainerStyle={styles.bodyContainer}>
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
