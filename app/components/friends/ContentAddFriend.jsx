//WHAT EVEN IS THIS
//need to RQ

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { updateAppSetup } from "@/src/calls/api";
import useFriendFunctions from "@/src/hooks/useFriendFunctions";
import InputAddFriendName from "./InputAddFriendName";
 
import SliderAddFriendEffort from "@/app/components/foranimations/SliderAddFriendEffort";
import SliderAddFriendPriority from "@/app/components/foranimations/SliderAddFriendPriority";
import PickerAddFriendLastDate from "@/app/components/selectors/PickerAddFriendLastDate";
import ButtonMediumAddFriend from "@/app/components/buttons/friends/ButtonMediumAddFriend";
import MessagePage from "../alerts/MessagePage";
import AlertList from "../alerts/AlertList";
import AlertSuccessFail from "../alerts/AlertSuccessFail";

import { useUser } from "@/src/context/UserContext";
import { useFriendList } from "@/src/context/FriendListContext"; 

const ContentAddFriend = () => {
  const { user } = useUser(); 
  const { friendList  } = useFriendList();

  const navigation = useNavigation();

  const { handleCreateFriend, handleUpdateFriendSettings } =
    useFriendFunctions();

  const [friendName, setFriendName] = useState("");
  const [friendEffort, setFriendEffort] = useState(3);
  const [friendPriority, setFriendPriority] = useState(2);
  const [friendDate, setFriendDate] = useState(new Date());

  const [isFriendLimitReached, setIsFriendLimitReached] = useState(false);
  const [isFriendNameUnique, setIsFriendNameUnique] = useState(false);
  const [revealRest, setRevealRest] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);

  const [newFriendData] = useState({
    friendName: "",
    friendEffort: 3,
    friendPriority: 2,
    friendDate: new Date(),
  });

  const navigateToMainScreen = () => {
    navigation.navigate("hellofriend");
  };

  const toggleReviewModal = () => {
    setIsReviewModalVisible(!isReviewModalVisible);
  };

  useEffect(() => {
    if (friendList && friendList.length < 20) {
      setIsFriendLimitReached(false);
    } else {
      setIsFriendLimitReached(true);
    }
  }, [friendList]);

  const handleSave = async () => {
    try {
      setSaveInProgress(true);
      const formattedDate = new Date(friendDate).toISOString().split("T")[0];
      const postData = {
        name: friendName,
        first_name: "Add First Name",
        last_name: "Add Last Name",
        first_meet_entered: formattedDate,
        friendEffort: friendEffort,
        friendPriority: friendPriority,
      };
      await handleCreateFriend(postData);


      if (!user.app_setup_complete) {
        //move this into RQ onSuccess when refactoring?
        await updateAppSetup();
      }
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Failed to save data:", error);
      setFailModalVisible(true);
    } finally {
      setSaveInProgress(false);
      setIsReviewModalVisible(false);
    }
  };

  const successOk = () => { 
    navigateToMainScreen();
    setSuccessModalVisible(false);
  };

  const failOk = () => {
    setFailModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {isFriendLimitReached && (
        <View style={{ flex: 1, marginHorizontal: 0 }}>
          <MessagePage
            message="Sorry! You have already added the max amount of friends."
            fontSize={20}
          />
        </View>
      )}

      {!isFriendLimitReached && (
        <>
          <InputAddFriendName
            friendName={friendName}
            setFriendName={setFriendName}
            isFriendNameUnique={isFriendNameUnique}
            setIsFriendNameUnique={setIsFriendNameUnique}
            setRevealRest={setRevealRest}
            friendList={friendList}
          />

          {revealRest && (
            <>
              <SliderAddFriendEffort
                friendEffort={friendEffort}
                setFriendEffort={setFriendEffort}
              />

              <SliderAddFriendPriority
                friendPriority={friendPriority}
                setFriendPriority={setFriendPriority}
              />

              <View style={{ width: "100%", height: 50 }}>
                <PickerAddFriendLastDate
                  friendDate={friendDate}
                  setFriendDate={setFriendDate}
                  showDatePicker={showDatePicker}
                  setShowDatePicker={setShowDatePicker}
                />
              </View>

              <ButtonMediumAddFriend
                friendName={friendName}
                onPress={handleSave}
              />
            </>
          )}
        </>
      )}
      <AlertList
        fixedHeight={true}
        height={700}
        isModalVisible={isReviewModalVisible}
        isFetching={saveInProgress}
        useSpinner={true}
        toggleModal={toggleReviewModal}
        headerContent={
          <Text style={{ fontFamily: "Poppins-Bold", fontSize: 18 }}>
            Review
          </Text>
        }
        content={
          <View>
            <Text>Friend data will go here</Text>
          </View>
        }
        onConfirm={handleSave}
        onCancel={toggleReviewModal}
        bothButtons={true}
        confirmText="Looks good!"
        cancelText="Go back"
      />
      <AlertSuccessFail
        isVisible={isSuccessModalVisible}
        message={`${friendName} has been added to friends!`}
        onClose={successOk}
        type="success"
      />

      <AlertSuccessFail
        isVisible={isFailModalVisible}
        message={`Could not add ${friendName} to friends.`}
        onClose={failOk}
        tryAgain={false}
        onRetry={handleSave}
        isFetching={saveInProgress}
        type="failure"
      />
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
