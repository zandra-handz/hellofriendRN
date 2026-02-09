import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
} from "react-native";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

import TextMomentBox from "./TextMomentBox";
import CategoryCreator from "./CategoryCreator";
import { useFocusEffect } from "@react-navigation/native";
import { Moment } from "@/src/types/MomentContextTypes";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useCreateMoment from "@/src/hooks/CapsuleCalls/useCreateMoment";
import useEditMoment from "@/src/hooks/CapsuleCalls/useEditMoment";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { FriendDashboardData } from "@/src/types/FriendTypes";
import { AppFontStyles } from "@/app/styles/AppFonts";
import MomentFocusTray from "./MomentFocusTray";
import manualGradientColors from "@/app/styles/StaticColors";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

type Props = {
  screenCameFromToParent: number;
  momentText: string;
  catCreatorVisible: boolean;
  closeCatCreator: () => void;
  openCatCreator: () => void;
  updateExistingMoment: boolean;
  existingMomentObject?: Moment;
  triggerSaveFromLateral: boolean;
  escortBarSpacer: number;
  cardPaddingVertical: number;
  friendId: number;
  friendDash: FriendDashboardData;
};

const MomentWriteEditView = ({
  paddingHorizontal,
  defaultCategory,
  themeColors,

  darkGlassBackground,
  userId,
  screenCameFromToParent,
  momentText,
  catCreatorVisible,
  primaryColor,
  primaryBackground,
  lighterOverlayColor,
  openCatCreator,
  closeCatCreator,
  updateExistingMoment,
  existingMomentObject,
  triggerSaveFromLateral,

  cardPaddingVertical = 10, // controls padding around the shaded card
  friendId,
  friendName,
  friendFaves,
}: Props) => {
  // console.log(existingMomentObject)
  const { handleCreateMoment, createMomentMutation } = useCreateMoment({
    userId: userId,
    friendId: friendId,
  });
  const { handleEditMoment, editMomentMutation } = useEditMoment({
    userId: userId,
    friendId: friendId,
  });
  const { navigateBack, navigateToMomentView } = useAppNavigations();

  const { capsuleList } = useCapsuleList();

  const yTranslateValue = useSharedValue(-850);

  const handleOpenCat = () => {
    yTranslateValue.value = withTiming(0, { duration: 100 });
    Keyboard.dismiss();
  };

  const handleCloseCat = () => {
    yTranslateValue.value = withTiming(-850, { duration: 100 });
  };

  const TOPPER_PADDING_TOP = 0;

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const momentTextRef = useRef(null);
  const [triggerReFocus, setTriggerReFocus] = useState<number>(0); //can set 0 to deFocus if needed
  const [momentTextToSave, setMomentTestToSave] = useState(momentText);
  const [userChangedCategory, setUserChangedCategory] =
    useState<boolean>(false);

  const extractScoresFromMoment = (moment?: Moment): MomentScores => {
    if (!moment) return DEFAULT_SCORES;

    return {
      easy_score: moment.easy_score ?? DEFAULT_SCORES.easy_score,
      hard_score: moment.hard_score ?? DEFAULT_SCORES.hard_score,
      quick_score: moment.quick_score ?? DEFAULT_SCORES.quick_score,
      long_score: moment.long_score ?? DEFAULT_SCORES.long_score,
      relevant_score: moment.relevant_score ?? DEFAULT_SCORES.relevant_score,
      random_score: moment.random_score ?? DEFAULT_SCORES.random_score,
      unique_score: moment.unique_score ?? DEFAULT_SCORES.unique_score,
      generic_score: moment.generic_score ?? DEFAULT_SCORES.generic_score,
    };
  };

  const handleUserChangedCategoryState = () => {
    if (!userChangedCategory) {
      setUserChangedCategory(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (momentText && !userChangedCategory) {
        setMomentTestToSave(momentText);
      }
    }, [momentText]),
  );

  const handleTriggerRefocus = () => {
    // console.log("handletrifgger refocus");
    setTriggerReFocus(Date.now());
  };

  // friendId didn't work to bring keyboard up after selecting friend so am using this instead
  useFocusEffect(
    useCallback(() => {
      handleTriggerRefocus();
      console.log("trigger refocus");

      return () => {
        console.log("Screen is unfocused");
      };
    }, []),
  );

  const handleCloseCatCreator = () => {
    handleCloseCat();
    closeCatCreator();
    handleTriggerRefocus();
  };

  const updateMomentText = (text) => {
    setMomentTestToSave(text);
  };

  useEffect(() => {
    if (!triggerSaveFromLateral) {
      // right now the parent resets the trigger via timeout
      return;
    }

    handleSave();
  }, [triggerSaveFromLateral]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(
    existingMomentObject?.user_category_name ?? "",
  );
  const [selectedUserCategory, setSelectedUserCategory] = useState(
    Number(existingMomentObject?.user_category ?? 0),
  );

  type MomentScores = {
    easy_score: number;
    hard_score: number;
    quick_score: number;
    long_score: number;
    relevant_score: number;
    random_score: number;
    unique_score: number;
    generic_score: number;
  };

  const DEFAULT_SCORES: MomentScores = {
    easy_score: 2,
    hard_score: 2,
    quick_score: 2,
    long_score: 2,
    relevant_score: 2,
    random_score: 2,
    unique_score: 2,
    generic_score: 2,
  };

  // In your component:
  // const [scoresObject, setScoresObject] = useState<MomentScores>(DEFAULT_SCORES);

  const [scoresObject, setScoresObject] = useState<MomentScores>(() =>
    extractScoresFromMoment(existingMomentObject),
  );

  // Update individual score:
  const handleScoreChange = (field: keyof MomentScores, value: number) => {
    setScoresObject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUserCategorySelect = ({ name: name, id: id }) => {
    setSelectedUserCategory(id);
    setSelectedCategory(name);
  };

  const handleSave = async () => {
    console.log(scoresObject);
    if (!selectedUserCategory) {
      Alert.alert(`DEV MODE`, `Oops! SelectedUserCategory is null`, [
        {
          text: "Back",
          onPress: () => {},
          style: "cancel",
        },
      ]);
      return;
    }
    const textLength = momentTextToSave.length;

    if (!textLength) {
      Alert.alert(
        `Oops!`,
        `Please enter your talking point first before saving it.`,
        [
          {
            text: "Back",
            onPress: () => {},
            style: "cancel",
          },
        ],
      );
      return;
    }

    if (!selectedUserCategory) {
      Alert.alert(`Oops!`, `Please select a category before trying to save.`, [
        {
          text: "Back",
          onPress: () => {},
          style: "cancel",
        },
      ]);
      return;
    }

    try {
      if (friendId) {
        if (!updateExistingMoment) {
          const requestData = {
            friend: friendId,
            selectedUserCategory: selectedUserCategory,
            moment: momentTextToSave,
            easy_score: scoresObject.easy_score,
            hard_score: scoresObject.hard_score,
            quick_score: scoresObject.quick_score,
            long_score: scoresObject.long_score,
            relevant_score: scoresObject.relevant_score,
            random_score: scoresObject.random_score,
            unique_score: scoresObject.unique_score,
            generic_score: scoresObject.generic_score,
          };
          showFlashMessage("Idea saved!", false, 2000);
          await handleCreateMoment(requestData);
        } else {
          const editData = {
            //these are the actual backend fields
            typed_category: selectedCategory,
            user_category: selectedUserCategory,
            // capsule: momentTextRef.current.getText(),
            capsule: momentTextToSave,
            easy_score: scoresObject.easy_score,
            hard_score: scoresObject.hard_score,
            quick_score: scoresObject.quick_score,
            long_score: scoresObject.long_score,
            relevant_score: scoresObject.relevant_score,
            random_score: scoresObject.random_score,
            unique_score: scoresObject.unique_score,
            generic_score: scoresObject.generic_score,
          };
          showFlashMessage("Changes saved!", false, 1000);
          await handleEditMoment(existingMomentObject?.id, editData);
        }
      }
    } catch (error) {
      console.log("catching errors elsewhere, not sure i need this", error);
    }
    // }
  };

  useEffect(() => {
    if (createMomentMutation.isSuccess) {
      if (screenCameFromToParent === 1 && momentTextToSave) {
        updateMomentText(""); //clear saved text, ONLY after save is confirmed
        console.log("triggering refocus because mutation");
        setTriggerReFocus(Date.now());
        setTriggerReFocus(null);
        return;
      } else {
        navigateBack();
      }
      createMomentMutation.reset(); //additional immediate reset to allow user to return back to screen instantly
    }
  }, [createMomentMutation.isSuccess]);

  useEffect(() => {
    if (createMomentMutation.isError) {
      showFlashMessage("Error!", createMomentMutation.isError, 2000);
    }
  }, [createMomentMutation.isError]);

  useEffect(() => {
    if (editMomentMutation.isError) {
      showFlashMessage("Error!", editMomentMutation.isError, 2000);
    }
  }, [editMomentMutation.isError]);

  //this needs to go to the new index instead if it has a new index
  //EDIT not working anymore /was always kinda broken? fix
  useEffect(() => {
    if (editMomentMutation.isSuccess && capsuleList?.length) {
      console.log(
        "useeffect for navving after edit triggered and code will be used",
      );
      const id = existingMomentObject.id;
      const updatedCapsule = capsuleList.filter((item) => item.id === id);

      // navigation.goBack(); // don't use, won't be updated index
      // navigateToMoments({scrollTo: 0});  // use this instead if moment view nav-to ends up having issues
      navigateToMomentView({
        moment: updatedCapsule,
        index: updatedCapsule.uniqueIndex,
      });
    }
  }, [editMomentMutation.isSuccess, capsuleList]);

  // keep this consistent with MomentViewPage
  return (
    <TouchableWithoutFeedback style={styles.container} onPress={() => {}}>
      <View style={{ flex: 1 }}>
        <CategoryCreator
          userId={userId}
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
          manualGradientColors={manualGradientColors}
          capsuleList={capsuleList}
          friendLightColor={themeColors?.lightColor}
          friendDarkColor={themeColors?.darkColor}
          freezeCategory={userChangedCategory}
          friendDefaultCategory={friendFaves?.friend_default_category || null}
          isVisible={catCreatorVisible}
          onPress={handleUserCategorySelect}
          addToOnPress={handleUserChangedCategoryState}
          onSave={handleSave}
          updatingExisting={updateExistingMoment}
          existingId={Number(existingMomentObject?.user_category) || null}
          onClose={handleCloseCatCreator}
          yTranslateValue={yTranslateValue}
          scoresObject={scoresObject}
          handleScoreChange={handleScoreChange}
        />

        <View
          style={[
            {
              paddingHorizontal: paddingHorizontal,
              paddingVertical: cardPaddingVertical, // Padding needs to be on this view for some reason
              width: "100%",
              flex: 1,
            },
          ]}
        >
          <View style={styles.innerContainer}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: darkGlassBackground,
                },
              ]}
            >
              <MomentFocusTray
                userId={userId}
                userDefaultCategory={defaultCategory}
                themeColors={themeColors}
                primaryColor={primaryColor}
                lighterOverlayColor={lighterOverlayColor}
                primaryBackground={primaryBackground}
                capsuleList={capsuleList}
                navigateBack={navigateBack}
                handleSave={handleSave}
                paddingTop={TOPPER_PADDING_TOP}
                friendDefaultCategory={
                  friendFaves?.friend_default_category || null
                }
                updateExistingMoment={updateExistingMoment}
                freezeCategory={userChangedCategory}
                onPress={handleOpenCat}
                label={selectedCategory}
                categoryId={selectedUserCategory}
                friendId={friendId}
                friendName={friendName}
              />
              {createMomentMutation.isPending && (
                <View
                  style={{
                    width: "100%",
                    height: "50%", //the height value repositions the spinner to be in the centerish of the screen when keyboard is up
                  }}
                >
                  <LoadingPage
                    loading={true}
                    spinnerType="circle"
                    spinnerSize={40} // same as FSMainSpinner
                  />
                </View>
              )}
              {!createMomentMutation.isPending && (
                <View style={{ padding: 10 }}>
                  <TextMomentBox
                    ref={momentTextRef}
                    value={momentTextToSave}
                    onTextChange={updateMomentText}
                    triggerReFocus={triggerReFocus} // triggered by category visibility and new friend change
                    isKeyboardVisible={isKeyboardVisible}
                    welcomeTextStyle={welcomeTextStyle}
                    primaryColor={primaryColor}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  innerContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 1,
    flexGrow: 1,
    width: "100%",
    zIndex: 1,
  },
  card: {
    borderRadius: 40,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    zIndex: 1,
    overflow: "hidden",
  },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
});

export default MomentWriteEditView;
