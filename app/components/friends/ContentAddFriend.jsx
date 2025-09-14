//WHAT EVEN IS THIS
//need to RQ

import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import useUpdateFriend from "@/src/hooks/useUpdateFriend";
import InputAddFriendName from "./InputAddFriendName";

import SliderAddFriendEffort from "@/app/components/foranimations/SliderAddFriendEffort";
import SliderAddFriendPriority from "@/app/components/foranimations/SliderAddFriendPriority";
import PickerAddFriendLastDate from "@/app/components/selectors/PickerAddFriendLastDate";
import ButtonMediumAddFriend from "@/app/components/buttons/friends/ButtonMediumAddFriend";
import MessagePage from "../alerts/MessagePage";
import AlertList from "../alerts/AlertList";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useCreateFriend from "@/src/hooks/useCreateFriend";
import useRefetchUpcomingHelloes from "@/src/hooks/UpcomingHelloesCalls/useRefetchUpcomingHelloes";
import useAddToFriendList from "@/src/hooks/FriendListCalls/useAddToFriendList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import AuthInputWrapper from "../user/AuthInputWrapper";
import manualGradientColors  from "@/src/hooks/StaticColors";
import EscortBar from "../moments/EscortBar";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
// import { useUser } from "@/src/context/UserContext";

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
  const { handleNewFriendSettings } = useUpdateFriend({
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
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const [saveInProgress, setSaveInProgress] = useState(false);

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
    setRevealRest(false); //this turns true after checking the inputted name against the friendList names
  };

  const toggleReviewModal = () => {
    setIsReviewModalVisible(!isReviewModalVisible);
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
    if (friendList && friendList.length < 20) {
      setIsFriendLimitReached(false);
    } else {
      setIsFriendLimitReached(true);
    }
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

      // if (!user.app_setup_complete) {
      //   //move this into RQ onSuccess when refactoring?
      //   await updateAppSetup();
      // }
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

    // setIsDoubleCheckerVisible(true);
  };

  return (
    <View
      style={[
        {
          flex: 1,
        },
      ]}
    >
      <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
        <Text style={[fontStyle, { color: primaryColor }]}>New friend</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 4, paddingVertical: 10 }}>
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
                      <SliderAddFriendEffort
                        friendEffort={friendEffort}
                        setFriendEffort={setFriendEffort}
                        primaryColor={primaryColor}
                      />
                    }
                  />

                  <AuthInputWrapper
                    condition={friendEffort}
                    label={"Effort needed to maintain relationship"}
                    labelColor={primaryColor}
                    labelSize={16}
                    children={
                      <SliderAddFriendPriority
                        friendPriority={friendPriority}
                        setFriendPriority={setFriendPriority}
                        primaryColor={primaryColor}
                      />
                    }
                  />
                  <View
                    style={{
                      width: "100%",
                      height: 100,
                      backgroundColor: "pink",
                    }}
                  >
                    <Pressable
                      style={{
                        width: "100%",
                        height: 30,
                        backgroundColor: "teal",
                      }}
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
    padding: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 0,
  },
});

export default ContentAddFriend;
