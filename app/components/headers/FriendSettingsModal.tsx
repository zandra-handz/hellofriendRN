import React, { useState, useMemo } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import SingleFieldEdit from "../friends/SingleFieldEdit";
import ValueSlider from "../friends/ValueSlider";
import AppModal from "../alerts/AppModal";
import DeleteFriend from "../friends/DeleteFriend";
import { FriendDashboardData } from "@/src/types/FriendTypes";
import useUpdateFriend from "@/src/hooks/useUpdateFriend";

interface Props {
  isVisible: boolean;
  userId: number;
  friendId: number;
  friendName: string;
  friendDash: FriendDashboardData;
  bottomSpacer: number;
  closeModal: () => void;
  handleDeselectFriend: () => void;
  textColor: string;
  backgroundColor: string;
  friendLightColor: string;
  friendDarkColor: string;
}

const phoneRegex = /^\+?1?\d{9,15}$/; // matches backend

const FriendSettingsModal: React.FC<Props> = ({
  userId,
  isVisible,
  friendId,
  friendName = "",
  friendDash,
  handleDeselectFriend,
  textColor,
  backgroundColor,
  friendLightColor,
  friendDarkColor,
  closeModal,
}) => {
  const { handleUpdateFriendSettings } = useUpdateFriend({
    userId,
    friendId,
  });

  const initialPhone = useMemo(
    () => friendDash?.suggestion_settings?.phone_number ?? "",
    [friendId],
  );

  const initialEffort = useMemo(
    () => friendDash?.suggestion_settings?.effort_required ?? 1,
    [friendId],
  );

  const initialPriority = useMemo(
    () => friendDash?.suggestion_settings?.priority_level ?? 1,
    [friendId],
  );

  const [pendingPhone, setPendingPhone] = useState<string>(initialPhone);
  const [pendingEffort, setPendingEffort] = useState<number>(initialEffort);
  const [pendingPriority, setPendingPriority] =
    useState<number>(initialPriority);

  const priorityMessages = ["Unworried", "Medium", "High"];
  const effortMessages = [
    "Check in twice a year",
    "Check in every 60-90 days",
    "Check in every month",
    "Check in every two weeks",
    "Check in every few days",
  ];

  const validatePhone = (value: string): string | null => {
    if (!value) return null; // empty is allowed (nullable on backend)
    if (!phoneRegex.test(value)) return "Format: +123456789 (9-15 digits)";
    return null;
  };

  const hasChanges =
    pendingPhone !== initialPhone ||
    pendingEffort !== initialEffort ||
    pendingPriority !== initialPriority;

  const handleSave = () => {
    try {
      handleUpdateFriendSettings({
        phoneNumber: pendingPhone,
        effort: pendingEffort,
        priority: pendingPriority,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setPendingPhone(initialPhone);
    setPendingEffort(initialEffort);
    setPendingPriority(initialPriority);
  };

  const handleClose = () => {
    if (!hasChanges) {
      closeModal();
      return;
    }

    Alert.alert(
      "Save changes?",
      "You have unsaved changes to your friend settings.",
      [
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            handleReset();
            closeModal();
          },
        },
        {
          text: "Save",
          onPress: () => {
            handleSave();
            closeModal();
          },
        },
      ],
    );
  };

  return (
    <AppModal
      primaryColor={textColor}
      backgroundColor={backgroundColor}
      isFullscreen={false}
      modalIsTransparent={false}
      isVisible={isVisible}
      onClose={handleClose}
      useCloseButton={true}
      questionText={friendName}
    >
      {/* <View style={styles.container}> */}
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.innerContainer}>
   
            <View style={styles.sliderContainer}>
              <ValueSlider
                label="Effort"
                value={pendingEffort}
                onValueChange={setPendingEffort}
                labelColor={textColor}
                barColor={friendLightColor}
                pointColor={friendDarkColor}
                trackColor="transparent"
                minValue={1}
                maxValue={5}
                step={1}
                valueLabels={effortMessages}
              />
            </View>
            <View style={styles.sliderContainer}>
              <ValueSlider
                label="Priority"
                value={pendingPriority}
                onValueChange={setPendingPriority}
                labelColor={textColor}
                barColor={friendLightColor}
                pointColor={friendDarkColor}
                trackColor="transparent"
                minValue={1}
                maxValue={3}
                invert={true}
                step={1}
                valueLabels={priorityMessages}
              />
            </View>
                     <View style={styles.sliderContainer}>
              <SingleFieldEdit
                label="Phone"
                value={pendingPhone}
                onValueChange={setPendingPhone}
                labelColor={textColor}
                borderBottomColor={friendLightColor}
                keyboardType="phone-pad"
                placeholder="+123456789"
                validate={validatePhone}
              />
            </View>
          </View>
        </ScrollView>
        <DeleteFriend
          userId={userId}
          friendId={friendId}
          friendName={friendName}
          handleDeselectFriend={handleDeselectFriend}
        />
      {/* </View> */}
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  innerContainer: {
    width: "100%",
  },
  sliderContainer: {
    borderRadius: 20,
    padding: 0,
    marginVertical: 6,
    height: 100,
  },
});

export default FriendSettingsModal;
