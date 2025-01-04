import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useAuthUser } from "../context/AuthUserContext";
import { useFriendList } from "../context/FriendListContext";

import { useMessage } from "../context/MessageContext";

import useFriendFunctions from "../hooks/useFriendFunctions";

import GearsTwoBiggerCircleSvg from "../assets/svgs/gears-two-bigger-circle.svg";
import FriendSettingsSection from "../components/FriendSettingsSection";
import LoadingPage from "../components/LoadingPage";
import BaseRowModalFooter from "../components/BaseRowModalFooter";

import EffortSettingSlider from "../components/EffortSettingSlider";
import PrioritySettingSlider from "../components/PrioritySettingSlider";

import AlertFormSubmit from "../components/AlertFormSubmit";
import { useGlobalStyle } from "../context/GlobalStyleContext";

const ModalEffortAndPriority = ({ mountingSettings }) => {
  const { authUserState } = useAuthUser();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const { showMessage } = useMessage();
  const { handleUpdateFriendSettings, updateFriendSettingsMutation } =
    useFriendFunctions();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State for friendEffort
  const [friendEffort, setFriendEffort] = useState(3); // Set initial value as needed
  const [friendPriority, setFriendPriority] = useState(3);
  const formRef = useRef(null);

  
 
  const friendName = selectedFriend?.name || "friend";

  useEffect(() => {
    if (updateFriendSettingsMutation.isSuccess) {
      setIsModalVisible(false);
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
      handleUpdateFriendSettings(
        //authUserState.user.id,
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

  const closeModal = () => setIsModalVisible(false);
  const toggleModal = () => setIsModalVisible(true);

  const MODAL_BODY_HEIGHT = 610;

  return (
    <View style={styles.container}>
      <FriendSettingsSection
        isMakingCall={updateFriendSettingsMutation.isFetching}
        LoadingComponent={LoadingPage}
      >
        <>
          <BaseRowModalFooter
            iconName="palette"
            iconSize={20}
            label="Effort"
            useToggle={false}
            useCustom={true}
            customLabel={"Change"}
            onCustomPress={toggleModal}
          />

          <BaseRowModalFooter
            iconName="palette"
            iconSize={20}
            label="Priority"
            useToggle={false}
            useCustom={true}
            customLabel={"Change"}
            onCustomPress={toggleModal}
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
          onCancel={() => setIsModalVisible(false)}
          confirmText="Save changes"
          cancelText="Cancel"
        />
      </FriendSettingsSection>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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