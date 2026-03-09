import React, { useState, useMemo } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import SingleFieldEdit from "../friends/SingleFieldEdit";
import ValueSlider from "../friends/ValueSlider";
import AppModal from "../alerts/AppModal";
import DeleteFriend from "../friends/DeleteFriend";
import { FriendDashboardData } from "@/src/types/FriendTypes";
import useUpdateFriendSettings from "@/src/hooks/useUpdateFriendSettings";
import { AppFontStyles } from "@/app/styles/AppFonts";
import OptionContainer from "./OptionContainer";
import manualGradientColors from "@/app/styles/StaticColors";
import BouncyEntrance from "./BouncyEntrance";
import OptionInputEdit from "./OptionInputEdit";

import useEditFriend from "@/src/hooks/useEditFriend";

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

const phoneRegex = /^\+?1?\d{9,15}$/;

const delays = [0, 60, 120];

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
  const { handleUpdateFriendSettings } = useUpdateFriendSettings({
    userId,
    friendId,
  });

  const { handleEditFriend } = useEditFriend({
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
  const [pendingName, setPendingName] = useState<string>(friendName);
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
    if (!value) return null;
    if (!phoneRegex.test(value)) return "Format: +123456789 (9-15 digits)";
    return null;
  };

    const validateName = (value: string): string | null => {
    if (!value) return null;
    if (value === friendName) return "Same as old name";
    return null;
  };


  const hasChanges =
    pendingPhone !== initialPhone ||
    pendingEffort !== initialEffort ||
    pendingPriority !== initialPriority ||
    pendingName !== friendName;

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
        try {
      handleEditFriend({
        name: pendingName
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setPendingPhone(initialPhone);
    setPendingEffort(initialEffort);
    setPendingPriority(initialPriority);
    setPendingName(friendName)
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.innerContainer}>
          <BouncyEntrance delay={delays[0]} style={{ width: "100%" }}>
            <View style={styles.sectionContainer}>
              <OptionContainer
                backgroundColor={backgroundColor}
                buttonColor={manualGradientColors.lightColor}
                label="Effort"
                primaryColor={backgroundColor}
                textStyle={AppFontStyles.subWelcomeText}
              >
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
                  textStyle={AppFontStyles.subWelcomeText}
                />
              </OptionContainer>
            </View>
          </BouncyEntrance>

          <BouncyEntrance delay={delays[1]} style={{ width: "100%" }}>
            <View style={styles.sectionContainer}>
              <OptionContainer
                backgroundColor={backgroundColor}
                buttonColor={manualGradientColors.lightColor}
                label="Priority"
                primaryColor={backgroundColor}
                textStyle={AppFontStyles.subWelcomeText}
              >
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
                  textStyle={AppFontStyles.subWelcomeText}
                />
              </OptionContainer>
            </View>
          </BouncyEntrance>

          <BouncyEntrance delay={delays[2]} style={{ width: "100%" }}>
            <View style={styles.sectionContainer}>
              <OptionInputEdit
                label="Phone"
                value={pendingPhone}
                onValueChange={setPendingPhone}
                primaryColor={textColor}
                backgroundColor={backgroundColor}
                buttonColor={manualGradientColors.lightColor}
                textStyle={AppFontStyles.subWelcomeText}
                keyboardType="phone-pad"
                placeholder="+123456789"
                validate={validatePhone}
              />
            </View>
          </BouncyEntrance>

          <BouncyEntrance delay={delays[2]} style={{ width: "100%" }}>
            <View style={styles.sectionContainer}>
              <OptionInputEdit
                label="Name"
                value={pendingName}
                onValueChange={setPendingName}
                primaryColor={textColor}
                backgroundColor={backgroundColor}
                buttonColor={manualGradientColors.lightColor}
                textStyle={AppFontStyles.subWelcomeText}
                keyboardType="default"
                placeholder={friendName}
                validate={validateName}
              />
            </View>
          </BouncyEntrance>
        </View>
      </ScrollView>

      <DeleteFriend
        userId={userId}
        friendId={friendId}
        friendName={friendName}
        handleDeselectFriend={handleDeselectFriend}
      />
    </AppModal>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  innerContainer: {
    width: "100%",
  },
  sectionContainer: {
    marginVertical: 6,
    width: "100%",
  },
});

export default FriendSettingsModal;
