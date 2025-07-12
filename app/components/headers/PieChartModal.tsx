import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native"; 
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import ModalWithoutSubmit from "../alerts/ModalWithoutSubmit";
import Pie from "./Pie"; 
interface Props {
  isVisible: boolean;
  closeModal: () => void;
  data: [],
}

const PieChartModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  data,
}) => {
  const { themeStyles, appSpacingStyles } = useGlobalStyle();
 
 const logButtonPressSuccessful = () => {
    console.log('section press was successful!');

 };
   

  return (
    <ModalWithoutSubmit
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
              <Pie data={data} widthAndHeight={300} labelSize={15} onSectionPress={logButtonPressSuccessful}/>
            
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
   
    height: '100%',
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

export default PieChartModal;
