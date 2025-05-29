import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useUser } from "@/src/context/UserContext";
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

import CommunicationPersonSolidSvg from "@/app/assets/svgs/communication-person-solid.svg";
import ExclamationDiamondOutlineSvg from "@/app/assets/svgs/exclamation-diamond-outline.svg";

const ModalEffortAndPriority = ({
  mountingSettings,
  isModalVisible,
  closeModal,
}) => {
  const { user } = useUser();
  const { themeAheadOfLoading } = useFriendList();
  const { selectedFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const { showMessage } = useMessage();
  const { handleUpdateFriendSettings, updateFriendSettingsMutation } =
    useFriendFunctions(); 

  const friendName = selectedFriend?.name || "friend";

  const priorityLabels = {
    3: "Low",
    2: "Medium",
    1: "High",
  };

  const effortLabels = {
    1: "Check in twice a year",
    2: "Check in every 60-90 days",
    3: "Check in every month",
    4: "Check in every two weeks",
    5: "Check in every few days",
  };

  useEffect(() => {
    if (updateFriendSettingsMutation.isSuccess) {
      closeModal();
      showMessage(true, null, `Settings for ${friendName} have been updated!`);
    } else if (updateFriendSettingsMutation.isError) {
      Alert.alert(
        `I'm sorry!`,
        `Settings for ${friendName} were not updated. Please try again.`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  }, [updateFriendSettingsMutation]);

  const handleSave = () => {
    try {
      console.log(priorityRef.current.getValue());
      handleUpdateFriendSettings(
        user.id,
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

  const MODAL_BODY_HEIGHT = 610;

  return (
    <View style={styles.container}>
      <FriendSettingsSection
        isMakingCall={updateFriendSettingsMutation.isFetching}
        LoadingComponent={LoadingPage}
      >
        <>
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
                  sliderColor={themeAheadOfLoading.lightColor}
                  trackColor={themeAheadOfLoading.darkColor}
                />
              </View>
              <View style={{ marginVertical: "3%" }}>
                <PrioritySettingSlider
                  //height={"40%"}
                  ref={priorityRef}
                  friendPriority={mountingSettings.priority_level} // Passing friendEffort state as value
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
    width: "100%",
    zIndex: 1,
    elevation: 1,
  },
  formBodyContainer: {
    padding: "3%",
    flexDirection: "column",
    justifyContent: "flex-start", 
    width: "100%",
    height: "100%",
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
