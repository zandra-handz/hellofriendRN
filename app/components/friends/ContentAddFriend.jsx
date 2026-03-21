import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import useUpdateFriendSettings from "@/src/hooks/useUpdateFriendSettings";
import InputAddFriendName from "./InputAddFriendName";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import useCreateFriend from "@/src/hooks/FriendCalls/useCreateFriend";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import manualGradientColors from "@/app/styles/StaticColors";
import TextHeader from "../appwide/format/TextHeader";
import { AppFontStyles } from "@/app/styles/AppFonts";
import OptionContainer from "../headers/OptionContainer";
import ValueSlider from "@/app/components/friends/ValueSlider";
import BouncyEntranceDown from "../headers/BouncyEntranceDown";
import OptionDate from "../headers/OptionDate";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const STAGGER_SPEED = 20;

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
  textColor,
  backgroundColor,
}) => { 
 
 
  const { selectFriend } = useSelectedFriend();
  const [friendName, setFriendName] = useState("");
  const [friendEffort, setFriendEffort] = useState(3);
  const [friendPriority, setFriendPriority] = useState(2);
  const [friendDate, setFriendDate] = useState(new Date());

  const [isFriendLimitReached, setIsFriendLimitReached] = useState(false);
  const [isFriendNameUnique, setIsFriendNameUnique] = useState(false);
  const [revealRest, setRevealRest] = useState(false);
 

  const { handleCreateFriend, createFriendMutation, newFriendSettingsMutation } = useCreateFriend({
    userId: userId,
  
    selectFriend: selectFriend,
  });

  const translateY = useSharedValue(-1000);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 90, stiffness: 1000 });
  }, []);

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

  // useEffect(() => {
  //   if (createFriendMutation.isSuccess) {
  //     showFlashMessage(`${friendName} added!`, false, 1000);
  //     clearInputs();
   
  //   }
  // }, [createFriendMutation.isSuccess]);


    useEffect(() => {
    if (newFriendSettingsMutation.isSuccess) {
      showFlashMessage(`${friendName} settings saved!`, false, 1000);
      // clearInputs();
   
    }
  }, [newFriendSettingsMutation.isSuccess]);

      useEffect(() => {
    if (newFriendSettingsMutation.isError) {
      showFlashMessage(`${friendName} settings not saved`, true, 1000);
      // clearInputs();
   
    }
  }, [newFriendSettingsMutation.isError]);

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
    <>
      <TextHeader
        label={`New Friend`}
        color={textColor}
        fontStyle={fontStyle}
        showNext={true}
        nextEnabled={!!(friendName && isFriendNameUnique)}
        onNext={openDoubleChecker}
        nextIconName="plus"
        nextDisabledIconName="plus"
        nextColor={manualGradientColors.homeDarkColor}
        nextBackgroundColor={manualGradientColors.lightColor}
        nextDisabledColor={backgroundColor}
        nextDisabledBackgroundColor="transparent"
      />
      <Animated.View style={[styles.outerContainer, animatedStyle]}>
        <View style={styles.sectionContainer}>
          <BouncyEntranceDown delay={0 * STAGGER_SPEED} style={{ width: "100%" }}>
            <InputAddFriendName
              friendName={friendName}
              autoFocus={true}
              setFriendName={setFriendName}
              isFriendNameUnique={isFriendNameUnique}
              setIsFriendNameUnique={setIsFriendNameUnique}
              setRevealRest={setRevealRest}
              friendList={friendList}
              primaryColor={textColor}
            />
          </BouncyEntranceDown>
        </View>

        <View style={styles.sectionContainer}>
          <BouncyEntranceDown delay={1 * STAGGER_SPEED} style={{ width: "100%" }}>
            <OptionContainer
              backgroundColor={backgroundColor}
              buttonColor={manualGradientColors.lightColor}
              label="Effort"
              primaryColor={backgroundColor}
              textStyle={AppFontStyles.subWelcomeText}
            >
              <ValueSlider
                label="Effort"
                value={friendEffort}
                onValueChange={setFriendEffort}
                labelColor={textColor}
                barColor={manualGradientColors.lightColor}
                pointColor={manualGradientColors.darkColor}
                trackColor="transparent"
                minValue={1}
                maxValue={5}
                step={1}
                valueLabels={effortMessages}
              />
            </OptionContainer>
          </BouncyEntranceDown>
        </View>

        <View style={styles.sectionContainer}>
          <BouncyEntranceDown delay={2 * STAGGER_SPEED} style={{ width: "100%" }}>
            <OptionContainer
              backgroundColor={backgroundColor}
              buttonColor={manualGradientColors.lightColor}
              label="Priority"
              primaryColor={backgroundColor}
              textStyle={AppFontStyles.subWelcomeText}
            >
              <ValueSlider
                label="Priority"
                value={friendPriority}
                onValueChange={setFriendPriority}
                labelColor={textColor}
                barColor={manualGradientColors.lightColor}
                pointColor={manualGradientColors.darkColor}
                trackColor="transparent"
                minValue={1}
                maxValue={3}
                invert={true}
                step={1}
                valueLabels={priorityMessages}
              />
            </OptionContainer>
          </BouncyEntranceDown>
        </View>

        <View style={styles.sectionContainer}>
          <BouncyEntranceDown delay={3 * STAGGER_SPEED} style={{ width: "100%" }}>
            <OptionDate
              label="Last hello"
              value={friendDate}
              onValueChange={setFriendDate}
              primaryColor={textColor}
              backgroundColor={backgroundColor}
              buttonColor={manualGradientColors.lightColor}
              textStyle={AppFontStyles.subWelcomeText}
              maximumDate={new Date()}
            />
          </BouncyEntranceDown>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 6,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  outerContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
});

export default ContentAddFriend;