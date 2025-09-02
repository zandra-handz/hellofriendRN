import React, { useState,   useEffect } from "react";
import { View,  ScrollView, StyleSheet } from "react-native";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
 
import TextEditBox from "../appwide/input/TextEditBox"; 

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  onEnter: () => void;
  textRef: string;
  mountingText: string;
  onTextChange: () => void;
}

const HelloNotesModal: React.FC<Props> = ({
  primaryColor,
  isVisible,
  closeModal,
  onEnter,
  onTextChange,
  textRef,
  mountingText, 
}) => { 
 
  const [triggerAutoFocus, setTriggerAutoFocus ] = useState();
useEffect(() => {
  setTriggerAutoFocus(true);

  return () => {
    setTriggerAutoFocus(false); // cleanup runs before next effect or on unmount
  };
}, [mountingText ]);



 
useEffect(() => {
  if (isVisible) {

      setTriggerAutoFocus(false);
        setTriggerAutoFocus(true);
  
  

  }

}, [isVisible ]);

 

  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <MaterialCommunityIcons
          name={"pencil"}
          size={30}
          color={primaryColor}
        />
      }
      useModalBar={true}
      questionText="Add notes"
      children={
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <View style={styles.sectionContainer}>
            <TextEditBox
              width={"100%"}
              height={'100%'}
              ref={textRef}
              autoFocus={triggerAutoFocus}
              primaryColor={primaryColor}
              title={""} 
              iconColor={ primaryColor}
              mountingText={mountingText}
              onTextChange={onTextChange}
              multiline={true}
            />
          </View>
        </ScrollView>
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

export default HelloNotesModal;
