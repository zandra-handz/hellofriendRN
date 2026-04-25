import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  Text,
  Pressable
} from "react-native";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";
import TextHeader from "../appwide/format/TextHeader";
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
import SelectedCategoryButton from "./SelectedCategoryButton";
import manualGradientColors from "@/app/styles/StaticColors";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import GeckoGameTypesUI from "./GeckoGameTypesUI";
import SvgIcon from "@/app/styles/SvgIcons";
import useUserSettings from "@/src/hooks/useUserSettings";
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
hiddenTypesUnlocked,
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
  openTypes,
  closeTypes,
  typesVisible,
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
  const { geckoGameTypes } = useUserSettings();


  const handleOpenCat = () => {
    openCatCreator(); 
    Keyboard.dismiss();
  };
 

  const TOPPER_PADDING_TOP = 0;

  const welcomeTextStyle = AppFontStyles.welcomeText;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const momentTextRef = useRef(null);
  const [triggerReFocus, setTriggerReFocus] = useState<number>(0); //can set 0 to deFocus if needed
  const [momentTextToSave, setMomentTestToSave] = useState(momentText);
  const [userChangedCategory, setUserChangedCategory] =
    useState<boolean>(false);

  // const extractScoresFromMoment = (moment?: Moment): MomentScores => {
  //   if (!moment) return DEFAULT_SCORES;

  //   return {
  //     easy_score: moment.easy_score ?? DEFAULT_SCORES.easy_score,
  //     hard_score: moment.hard_score ?? DEFAULT_SCORES.hard_score,
  //     quick_score: moment.quick_score ?? DEFAULT_SCORES.quick_score,
  //     long_score: moment.long_score ?? DEFAULT_SCORES.long_score,
  //     relevant_score: moment.relevant_score ?? DEFAULT_SCORES.relevant_score,
  //     random_score: moment.random_score ?? DEFAULT_SCORES.random_score,
  //     unique_score: moment.unique_score ?? DEFAULT_SCORES.unique_score,
  //     generic_score: moment.generic_score ?? DEFAULT_SCORES.generic_score,
  //   };
  // };

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
    console.log("handleTriggerRefocus");
    setTimeout(() => setTriggerReFocus((prev) => prev + 1), 50);
  };
  const hasInitialFocused = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasInitialFocused.current) {
        hasInitialFocused.current = true;
        handleTriggerRefocus();
        console.log("trigger refocus - initial only");
      }

      return () => {
        console.log("Screen is unfocused");
      };
    }, []),
  );
  const handleCloseCatCreator = () => {
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

    const [selectedGameType, setSelectedGameType] = useState(
    existingMomentObject?.gecko_game_type ?? 1, // for NONE
  );

  const updateSelectedType = (newValue: number) => {
    setSelectedGameType(newValue);
  };

  const selectedGameTypeLabel = useMemo(() => {
    const found = geckoGameTypes?.find((t: any) => t.value === selectedGameType);
    return found?.label ?? "Pick a game type";
  }, [geckoGameTypes, selectedGameType]);

  const [selectorMode, setSelectorMode] = useState<"category" | "game_type">(
    existingMomentObject?.user_category &&
      (!existingMomentObject?.gecko_game_type ||
        existingMomentObject.gecko_game_type === 1)
      ? "category"
      : "game_type",
  );

  const toggleSelectorMode = () =>
    setSelectorMode((m) => (m === "category" ? "game_type" : "category"));

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

 
  const textLength = useMemo(() => {
    console.log("textLength: ", momentTextToSave?.length);
    return momentTextToSave?.length;
  }, [momentTextToSave]);
 
  const handleUserCategorySelect = ({ name: name, id: id }) => {
    setSelectedUserCategory(id);
    setSelectedCategory(name);
  };

  const handleSave = async () => {
    if (!textLength) {
      Alert.alert(
        `Oops!`,
        `Please enter your talking point first before saving it.`,
        [{ text: "Back", onPress: () => {}, style: "cancel" }],
      );
      return;
    }

    if (selectorMode === "category" && !selectedUserCategory) {
      Alert.alert(`Oops!`, `Please select a category before trying to save.`, [
        { text: "Back", onPress: () => {}, style: "cancel" },
      ]);
      return;
    }

    if (selectorMode === "game_type" && (!selectedGameType || selectedGameType === 1)) {
      Alert.alert(`Oops!`, `Please pick a gecko game type before trying to save.`, [
        { text: "Back", onPress: () => {}, style: "cancel" },
      ]);
      return;
    }

    try {
      if (friendId) {
        if (!updateExistingMoment) {
          const requestData = {
            friend: friendId,
            selectedUserCategory: selectedUserCategory,
            selectedUserCategoryName: selectedCategory,
            moment: momentTextToSave,
            geckoGameType: selectedGameType,
            // easy_score: scoresObject.easy_score,
            // hard_score: scoresObject.hard_score,
            // quick_score: scoresObject.quick_score,
            // long_score: scoresObject.long_score,
            // relevant_score: scoresObject.relevant_score,
            // random_score: scoresObject.random_score,
            // unique_score: scoresObject.unique_score,
            // generic_score: scoresObject.generic_score,
          };
          showFlashMessage("Idea saved!", false, 2000);
          await handleCreateMoment(requestData);
        } else {
          const editData = {
            //these are the actual backend fields
            typed_category: selectedCategory,
            user_category: selectedUserCategory,
            gecko_game_type: selectedGameType,

            // capsule: momentTextRef.current.getText(),
            capsule: momentTextToSave,
            // easy_score: scoresObject.easy_score,
            // hard_score: scoresObject.hard_score,
            // quick_score: scoresObject.quick_score,
            // long_score: scoresObject.long_score,
            // relevant_score: scoresObject.relevant_score,
            // random_score: scoresObject.random_score,
            // unique_score: scoresObject.unique_score,
            // generic_score: scoresObject.generic_score,
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
        console.log("navigating back after creation!");
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
        <GeckoGameTypesUI
        hiddenTypesUnlocked={hiddenTypesUnlocked}
        isVisible={typesVisible}
        onClose={closeTypes}
        color={primaryColor}
        highlightColor={manualGradientColors.lightColor}
        backgroundColor={primaryBackground}
        selectedValue={selectedGameType}
        onSelect={updateSelectedType}
        
        />
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
          // yTranslateValue={yTranslateValue}
          // scoresObject={scoresObject}
          // handleScoreChange={handleScoreChange}
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
            <TextHeader
              label={!updateExistingMoment ? `Add new` : `Edit`}
              color={primaryColor}
              fontStyle={welcomeTextStyle}
              showNext={true}
              nextEnabled={
                !!textLength &&
                (selectorMode === "category"
                  ? !!selectedCategory
                  : !!selectedGameType && selectedGameType !== 1)
              }
              onNext={handleSave}
              onBack={navigateBack}
              nextColor={manualGradientColors.homeDarkColor}
              nextBackgroundColor={manualGradientColors.lightColor}
              nextDisabledColor={primaryBackground}
              nextDisabledBackgroundColor={"gray"}
            />

            <View style={styles.trayRow}>
              <MomentFocusTray
                updateExistingMoment={updateExistingMoment}
                primaryColor={primaryColor}
                userId={userId}
                friendId={friendId}
                themeColors={themeColors}
              />
              <Pressable
                onPress={toggleSelectorMode}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.modeToggleCorner,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <SvgIcon
                  name={selectorMode === "game_type" ? "pencil" : "scatter_plot"}
                  color={primaryColor}
                  size={12}
                />
                <Text style={[styles.modeToggleCornerLabel, { color: primaryColor }]}>
                  {selectorMode === "game_type" ? "use category" : "use gecko game"}
                </Text>
              </Pressable>
            </View>

            {selectorMode === "category" ? (
              <SelectedCategoryButton
                userId={userId}
                friendId={friendId}
                friendName={friendName}
                userDefaultCategory={defaultCategory}
                themeColors={themeColors}
                primaryColor={primaryColor}
                lighterOverlayColor={lighterOverlayColor}
                primaryBackground={primaryBackground}
                capsuleList={capsuleList}
                friendDefaultCategory={friendFaves?.friend_default_category || null}
                fontSize={14}
                fontSizeEditMode={14}
                freezeCategory={userChangedCategory}
                onPress={handleOpenCat}
                label={selectedCategory}
                categoryId={selectedUserCategory}
                iconSize={18}
              />
            ) : (
              <Pressable
                onPress={openTypes}
                style={({ pressed }) => [
                  styles.gameTypeButton,
                  {
                    borderColor: `${primaryColor}30`,
                    backgroundColor: `${primaryColor}0D`,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <SvgIcon name="scatter_plot" color={primaryColor} size={22} />
                <View style={styles.gameTypeButtonTextWrap}>
                  <Text style={[styles.gameTypeButtonHint, { color: primaryColor }]}>
                    Gecko game
                  </Text>
                  <Text
                    style={[styles.gameTypeButtonLabel, { color: primaryColor }]}
                    numberOfLines={1}
                  >
                    {selectedGameTypeLabel}
                  </Text>
                </View>
              </Pressable>
            )}
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
  headerWrapper: {
    paddingHorizontal: 20,
  },
  rowContainer: { flexDirection: "row" },
  labelWrapper: {},
  label: {},
  trayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: -8,
    marginBottom: 0,
  },
  modeToggleCorner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  modeToggleCornerLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 11,
    letterSpacing: 0.3,
  },
  gameTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 2,
    marginTop: 0,
    marginBottom: 0,
  },
  gameTypeButtonTextWrap: {
    flex: 1,
  },
  gameTypeButtonHint: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gameTypeButtonLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    marginTop: 2,
  },
});

export default MomentWriteEditView;
