import React, { useRef, useState } from "react";
import { View, StyleSheet, Button } from "react-native";

import { useSelectedFriend } from "../context/SelectedFriendContext";
import { useAuthUser } from "../context/AuthUserContext";
import { useFriendList } from "../context/FriendListContext"; 

import GearsTwoBiggerCircleSvg from '../assets/svgs/gears-two-bigger-circle.svg';
import FriendSettingsSection from "../components/FriendSettingsSection";
import ModalFormColorTheme from "../components/ModalFormColorTheme";
import LoadingPage from "../components/LoadingPage";
import BaseRowModalFooter from "../components/BaseRowModalFooter";

import EffortSettingSlider from "../components/EffortSettingSlider";
import PrioritySettingSlider from "../components/PrioritySettingSlider";
import SliderAddFriendPriority from "../components/SliderAddFriendPriority";

import AlertFormSubmit from "../components/AlertFormSubmit";
import { useGlobalStyle } from "../context/GlobalStyleContext";

const ModalEffortAndPriority = ({ mountingSettings }) => {
  const { authUserState } = useAuthUser();
  const { themeStyles } = useGlobalStyle();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State for friendEffort
  const [friendEffort, setFriendEffort] = useState(3); // Set initial value as needed
  const [friendPriority, setFriendPriority] = useState(3);
  const formRef = useRef(null);


  const handleEffortSliderValue = () => {
    // Get the current value from the slider via the ref
    if (effortRef.current) {
      const currentValue = effortRef.current.getValue();
      console.log('Current Effort Slider Value:', currentValue);
      // You can then perform other actions based on this value if needed
    }
  };

  const handlePrioritySliderValue = () => {
    // Get the current value from the slider via the ref
    if (priorityRef.current) {
      const currentValue = priorityRef.current.getValue();
      console.log('Current Priority Slider Value:', currentValue);
      // You can then perform other actions based on this value if needed
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
        isMakingCall={false}
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
            <View> 
              <EffortSettingSlider
              ref={effortRef} 
                friendEffort={mountingSettings.effort_required} // Passing friendEffort state as value
                setFriendEffort={setFriendEffort} // Passing setFriendEffort function to update the state
              />
              <Button title="Update Slider" onPress={handleEffortSliderValue} />
                            <PrioritySettingSlider
                            ref={priorityRef}
                friendPriority={mountingSettings.priority_level} // Passing friendEffort state as value
                setFriendPriority={setFriendPriority} // Passing setFriendEffort function to update the state
              />
               <Button title="Update Slider" onPress={ handlePrioritySliderValue} />
            </View>
          }
          formHeight={MODAL_BODY_HEIGHT}
          onConfirm={() => {}}
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
