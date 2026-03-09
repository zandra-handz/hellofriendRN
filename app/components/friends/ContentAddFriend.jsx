import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import useUpdateFriendSettings from "@/src/hooks/useUpdateFriendSettings";
import InputAddFriendName from "./InputAddFriendName";
import PickerAddFriendLastDate from "@/app/components/selectors/PickerAddFriendLastDate";
import MessagePage from "../alerts/MessagePage";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useCreateFriend from "@/src/hooks/FriendCalls/useCreateFriend";
import useRefetchUpcomingHelloes from "@/src/hooks/UpcomingHelloesCalls/useRefetchUpcomingHelloes";
import useAddToFriendList from "@/src/hooks/FriendListCalls/useAddToFriendList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import AuthInputWrapper from "../user/AuthInputWrapper";
import manualGradientColors from "@/app/styles/StaticColors";
import EscortBar from "../moments/EscortBar";
import { AppFontStyles } from "@/app/styles/AppFonts";
import ValueSlider from "@/app/components/friends/ValueSlider";

const effortMessages = [
  "Check in twice a year",
  "Check in every 60-90 days",
  "Check in every month",
  "Check in every two weeks",
  "Check in every few days",
];

const priorityMessages = ["Unworried", "Medium", "High"];

const ContentAddFriend = ({
  userId,
  friendList,
  fontStyle,
  primaryColor,
  backgroundColor,
}) => {
  const { navigateToHome } = useAppNavigations();
  const { refetchUpcomingHelloes } = useRefetchUpcomingHelloes({
    userId: userId,
  });
  const { handleNewFriendSettings } = useUpdateFriendSettings({
    userId: userId,
    refetchUpcoming: refetchUpcomingHelloes,
  });
  const { selectFriend } = useSelectedFriend();
  const [friendName, setFriendName] = useState("");
  const [friendEffort, setFriendEffort] = useState(3);
  const [friendPriority, setFriendPriority] = useState(2);
  const [friendDate, setFriendDate] = useState(new Date());

  const [isFriendLimitReached, setIsFriendLimitReached] = useState(false);
  const [isFriendNameUnique, setIsFriendNameUnique] = useState(false);
  const [revealRest, setRevealRest] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { addToFriendList } = useAddToFriendList({ userId: userId });

  const { handleCreateFriend, createFriendMutation } = useCreateFriend({
    userId: userId,
    saveSettings: handleNewFriendSettings,
    addToFriendList: addToFriendList,
    refetchUpcoming: refetchUpcomingHelloes,
    selectFriend: selectFriend,
  });

  const clearInputs = () => {
    setFriendName("");
    setFriendEffort(3);
    setFriendPriority(2);
    setRevealRest(false);
  };

  useEffect(() => {
    if (createFriendMutation.isPending) {
      showFlashMessage(`Saving friend!`, false, 1000);
    }
  }, [createFriendMutation.isPending]);

  useEffect(() => {
    if (createFriendMutation.isSuccess) {
      showFlashMessage(`${friendName} added!`, false, 1000);
      clearInputs();
      navigateToHome();
    }
  }, [createFriendMutation.isSuccess]);

  useEffect(() => {
    if (createFriendMutation.isError) {
      showFlashMessage(`${friendName} not added`, true, 1000);
    }
  }, [createFriendMutation.isError]);

  useEffect(() => {
    setIsFriendLimitReached(friendList && friendList.length >= 20);
  }, [friendList]);

  const handleSave = async () => {
    try {
      const formattedDate = new Date(friendDate).toISOString().split("T")[0];
      const postData = {
        name: friendName,
        first_name: "Add First Name",
        last_name: "Add Last Name",
        first_meet_entered: formattedDate,
        effort_required: friendEffort,
        priority_level: friendPriority,
      };
      await handleCreateFriend(postData);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  const openDoubleChecker = () => {
    Alert.alert(`Save`, `Save ${friendName}`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: `Yes`, onPress: () => handleSave() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[fontStyle, { color: primaryColor }]}>New friend</Text>
      </View>

      <View style={styles.bodyContainer}>
        <View style={{ flex: 1 }}>
          {isFriendLimitReached && (
            <View style={{ flex: 1, marginHorizontal: 0 }}>
              <MessagePage
                message="Sorry! You have already added the max amount of friends."
                fontSize={20}
                primaryColor={primaryColor}
              />
            </View>
          )}

          {!isFriendLimitReached && (
            <>
              <AuthInputWrapper
                condition={friendName}
                label={"Name"}
                labelColor={primaryColor}
                labelSize={16}
                children={
                  <InputAddFriendName
                    friendName={friendName}
                    autoFocus={true}
                    setFriendName={setFriendName}
                    isFriendNameUnique={isFriendNameUnique}
                    setIsFriendNameUnique={setIsFriendNameUnique}
                    setRevealRest={setRevealRest}
                    friendList={friendList}
                    primaryColor={primaryColor}
                  />
                }
              />

              {revealRest && (
                <>
                  <AuthInputWrapper
                    condition={friendEffort}
                    label={"Effort needed to maintain relationship"}
                    labelSize={16}
                    labelColor={primaryColor}
                    children={
                      <ValueSlider
                        label="Effort"
                        value={friendEffort}
                        onValueChange={setFriendEffort}
                        labelColor={primaryColor}
                        barColor={manualGradientColors.lightColor}
                        pointColor={manualGradientColors.darkColor}
                        trackColor="transparent"
                        minValue={1}
                        maxValue={5}
                        step={1}
                        valueLabels={effortMessages}
                      />
                    }
                  />

                  <AuthInputWrapper
                    condition={friendPriority}
                    label={"Priority placed on friendship"}
                    labelColor={primaryColor}
                    labelSize={16}
                    children={
                      <ValueSlider
                        label="Priority"
                        value={friendPriority}
                        onValueChange={setFriendPriority}
                        labelColor={primaryColor}
                        barColor={manualGradientColors.lightColor}
                        pointColor={manualGradientColors.darkColor}
                        trackColor="transparent"
                        minValue={1}
                        maxValue={3}
                        invert={true}
                        step={1}
                        valueLabels={priorityMessages}
                      />
                    }
                  />

                  <View style={styles.dateContainer}>
                    <Pressable
                      style={styles.dateButton}
                      onPress={() => setShowDatePicker((prev) => !prev)}
                    >
                      <Text style={{ color: primaryColor }}>
                        {friendDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </Pressable>
                    <PickerAddFriendLastDate
                      friendDate={friendDate}
                      setFriendDate={setFriendDate}
                      showDatePicker={showDatePicker}
                      setShowDatePicker={setShowDatePicker}
                    />
                  </View>
                </>
              )}
            </>
          )}
        </View>

        {friendName && (
          <EscortBar
            manualGradientColors={manualGradientColors}
            subWelcomeTextStyle={AppFontStyles.subWelcomeText}
            primaryColor={primaryColor}
            primaryBackground={backgroundColor}
            forwardFlowOn={false}
            label={`Save ${friendName}`}
            onPress={openDoubleChecker}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  dateContainer: {
    width: "100%",
    height: 100,
  },
  dateButton: {
    width: "100%",
    height: 30,
  },
});

export default ContentAddFriend;