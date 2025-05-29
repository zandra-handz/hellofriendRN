import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useUser } from "@/src/context/UserContext"; 

import { useMessage } from "@/src/context/MessageContext";

import useFriendFunctions from "@/src/hooks/useFriendFunctions";

import GearsTwoBiggerCircleSvg from "@/app/assets/svgs/gears-two-bigger-circle.svg";
import FriendSettingsSection from "./FriendSettingsSection";
 
 
 
import DetailRow from "../appwide/display/DetailRow";

import LoadingPage from "../appwide/spinner/LoadingPage";
 
import AlertFormSubmit from "../alerts/AlertFormSubmit";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import HeartbeatActivitySimpleSvg from '@/app/assets/svgs/heartbeat-activity-simple.svg';
import WristwatchOutlineSvg from '@/app/assets/svgs/wristwatch-outline.svg';

const ModalFriendDetails = ({ mountingDetails }) => {
  const { user } = useUser(); 
  const { selectedFriend } = useSelectedFriend();
  const { themeStyles } = useGlobalStyle();
  const { showMessage } = useMessage();
  const { handleUpdateFriendSettings, updateFriendSettingsMutation } =
    useFriendFunctions();
  const [isModalVisible, setIsModalVisible] = useState(false);

 
 

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
            iconSize={20}
            label={`Last hello: `}
            value={`${mountingDetails.days_since_words}`}
            svg={WristwatchOutlineSvg }
            
          />

          <DetailRow
            iconName="palette"
            iconSize={20}
            label={`Current connection score: `}
            value={`${mountingDetails.time_score}`}
            svg={HeartbeatActivitySimpleSvg }
            
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

export default ModalFriendDetails;
