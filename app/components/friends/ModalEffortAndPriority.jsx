import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useAuthUser } from "@/src/context/AuthUserContext";
import { useFriendList } from "@/src/context/FriendListContext";

import { useMessage } from "@/src/context/MessageContext";

import useFriendFunctions from "@/src/hooks/useFriendFunctions";

import GearsTwoBiggerCircleSvg from "@/app/assets/svgs/gears-two-bigger-circle.svg";
import FriendSettingsSection from "./FriendSettingsSection";
 
import LoadingPage from "../appwide/spinner/LoadingPage";

import EffortSettingSlider from "./EffortSettingSlider";
import PrioritySettingSlider from "@/app/components/friends/PrioritySettingSlider";


import DetailRow from "../appwide/display/DetailRow";
 
import AlertFormSubmit from "../alerts/AlertFormSubmit";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
 
import CommunicationPersonSolidSvg from '@/app/assets/svgs/communication-person-solid.svg';
import ExclamationDiamondOutlineSvg from '@/app/assets/svgs/exclamation-diamond-outline.svg';


const ModalEffortAndPriority = ({ mountingSettings, isModalVisible, closeModal }) => {
  const { authUserState } = useAuthUser();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const { showMessage } = useMessage();
  const { handleUpdateFriendSettings, updateFriendSettingsMutation } =
    useFriendFunctions(); 

  // State for friendEffort
  const [friendEffort, setFriendEffort] = useState(3); // Set initial value as needed
  const [friendPriority, setFriendPriority] = useState(3);
  const formRef = useRef(null);

  
 
  const friendName = selectedFriend?.name || "friend";

  const priorityLabels = {
    3: 'Low',
    2: 'Medium',
    1: 'High'
};



const effortLabels = {
  1: 'Check in twice a year',
  2: 'Check in every 60-90 days',
  3: 'Check in every month',
  4: 'Check in every two weeks',
  5: 'Check in every few days'
};

// useEffect(() => {
//   console.log(priorityLabels[1]);

// }, []);

  useEffect(() => {
    if (updateFriendSettingsMutation.isSuccess) {
      closeModal();
      showMessage(true, null, `Settings for ${friendName} have been updated!`);
    }
  }, [updateFriendSettingsMutation.isSuccess]);

  useEffect(() => {
    if (updateFriendSettingsMutation.isError) {
      // commented out because the resultMessage component that showMessage displays is below
      //the modal seemingly no matter how high I set zIndex and elevation

      // showMessage(
      //   true,
      //   null,
      //   `Oops! Settings for ${friendName} were not updated. Please try again.`
      // );

      Alert.alert(
        `I'm sorry!`,
        `Settings for ${friendName} were not updated. Please try again.`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  }, [updateFriendSettingsMutation.isError]);

  const handleSave = () => {
    try {

      console.log(priorityRef.current.getValue());
      handleUpdateFriendSettings(
        authUserState.user.id,
        selectedFriend.id,
        effortRef.current.getValue(),
        priorityRef.current.getValue()
      );
    } catch (error) {
      console.error(error);
    }
  };

  

  const effortRef = useRef();
  const priorityRef = useRef();
 
  // const toggleModal = () => setIsModalVisible(true);

  const MODAL_BODY_HEIGHT = 610;

  return (
    <View style={styles.container}>
      <FriendSettingsSection
        isMakingCall={updateFriendSettingsMutation.isFetching}
        LoadingComponent={LoadingPage}
      >
        <>
        {/* <BaseRowModalFooter
            iconName="palette"
            iconSize={20}
            label="Suggestion settings"
            useToggle={false}
            useCustom={true}
            customLabel={"Change"}
            onCustomPress={toggleModal}
          /> */}
          <DetailRow
            iconName="palette"
            iconSize={18}
            label={`Effort: `}
            value={effortLabels[mountingSettings.effort_required]}
            svg={CommunicationPersonSolidSvg} 
             
            
          />

<DetailRow
            iconName="palette"
            iconSize={19}
            label={`Priority: `}
            value={priorityLabels[mountingSettings.priority_level]}
            svg={ExclamationDiamondOutlineSvg}
             
            
          />
        </>

        <AlertFormSubmit
          isModalVisible={isModalVisible}
          isMakingCall={false}
          headerContent={
            <GearsTwoBiggerCircleSvg
              width={38}
              height={38}
              color={themeStyles.modalIconColor.color}
            />
          }
          questionText="Update settings"
          formBody={
            <View style={styles.formBodyContainer}>
              <View style={{ marginVertical: "3%" }}>
                <EffortSettingSlider
                  //height={"40%"}
                  ref={effortRef}
                  friendEffort={mountingSettings.effort_required} // Passing friendEffort state as value
                  setFriendEffort={setFriendEffort} // Passing setFriendEffort function to update the state
                  sliderColor={themeAheadOfLoading.lightColor}
                  trackColor={themeAheadOfLoading.darkColor}
                />
              </View>
              <View style={{ marginVertical: "3%" }}>
                <PrioritySettingSlider
                  //height={"40%"}
                  ref={priorityRef}
                  friendPriority={mountingSettings.priority_level} // Passing friendEffort state as value
                  setFriendPriority={setFriendPriority} // Passing setFriendEffort function to update the state
                  sliderColor={themeAheadOfLoading.lightColor}
                  trackColor={themeAheadOfLoading.darkColor}
                />
              </View>
            </View>
          }
          formHeight={MODAL_BODY_HEIGHT}
          onConfirm={() => handleSave()}
          onCancel={() => closeModal()}
          confirmText="Save changes"
          cancelText="Cancel"
        />
      </FriendSettingsSection>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    width: "100%",
    zIndex: 1,
    elevation: 1,
  },
  formBodyContainer: {
    padding: '3%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    //backgroundColor: 'red', 
    width: '100%',
    height: '100%',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  headerIcon: {
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Poppins-Bold",
    width: "80%",
  },
});

export default ModalEffortAndPriority;
