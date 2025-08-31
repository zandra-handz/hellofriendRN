import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
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

import MomentFocusTray from "./MomentFocusTray";
type Props = {
  screenCameFromToParent: number;
  momentText: string;
  catCreatorVisible: boolean;
  closeCatCreator: () => void;
  openCatCreator: () => void;
  categoryColorsMap: object;
  updateExistingMoment: boolean;
  existingMomentObject?: Moment;
  triggerSaveFromLateral: boolean;
  escortBarSpacer: number;
  cardPadding: number;
  friendId: number;
  friendDash: FriendDashboardData;
};

const MomentWriteEditView = ({
  defaultCategory,
  manualGradientColors,
  themeAheadOfLoading,
  capsuleList,
  friendList,
  helloesList,
  userCategories,
  userId,
  screenCameFromToParent,
  momentText,
  catCreatorVisible,
  welcomeTextStyle,
  subWelcomeTextStyle,
  primaryColor,
  primaryBackground,
  lighterOverlayColor,
  darkerOverlayColor,
  openCatCreator,
  closeCatCreator,
  categoryColorsMap,
  updateExistingMoment,
  existingMomentObject,
  triggerSaveFromLateral,
  escortBarSpacer,
  cardPadding = 4, // controls padding around the shaded card
  friendId,
  friendName,
  friendFaves,
}: Props) => {
  const { handleCreateMoment, createMomentMutation } = useCreateMoment({
    userId: userId,
    friendId: friendId,
  });
  const { handleEditMoment, editMomentMutation } = useEditMoment({
    userId: userId,
    friendId: friendId,
  });
  const { navigateBack, navigateToMoments, navigateToMomentView } =
    useAppNavigations();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const momentTextRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUserCategory, setSelectedUserCategory] = useState<number>(0);
  const [triggerReFocus, setTriggerReFocus] = useState<number>(0); //can set 0 to deFocus if needed

  const [userChangedCategory, setUserChangedCategory] =
    useState<boolean>(false);

  const handleUserChangedCategoryState = () => {
    if (!userChangedCategory) {
      setUserChangedCategory(true);
    }
  };

  const TOPPER_PADDING_TOP = 0;

  useFocusEffect(
    useCallback(() => {
      if (
        momentText &&
        !userChangedCategory &&
        momentTextRef &&
        momentTextRef.current
      ) {
        momentTextRef.current.setText(momentText);
      }
      // else {
      //   console.error("NOT RESETTING", momentText, userChangedCategory);
      // }
    }, [momentText])
  );

  useEffect(() => {
    if (!catCreatorVisible) {
      setTriggerReFocus(Date.now());
    }
  }, [catCreatorVisible]);

  useEffect(() => {
    if (!catCreatorVisible && friendId) {
      setTriggerReFocus(Date.now());
    }
  }, [friendId]);

  useEffect(() => {
    if (momentText) {
      updateMomentText(momentText);
    }
  }, [momentText]);

  const updateMomentText = (text) => {
    if (momentTextRef && momentTextRef.current) {
      momentTextRef.current.setText(text);
    }
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
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (updateExistingMoment && existingMomentObject) {
      setSelectedCategory(existingMomentObject.user_category_name);
      setSelectedUserCategory(Number(existingMomentObject.user_category));
    }
  }, [updateExistingMoment, existingMomentObject]);

  // const handleCategorySelect = (category) => {
  //   if (!category) {
  //     return;
  //   }
  //   setSelectedCategory(category);
  // };

  const handleUserCategorySelect = ({ name: name, id: id }) => {
    setSelectedUserCategory(id);
    setSelectedCategory(name);
    // handleUserChangedCategory(); moved into category creator
    //   closeCatCreator();
  };

  const handleSave = async () => {
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
    if (momentTextRef && momentTextRef.current) {
      const textLength = momentTextRef.current.getText().length;

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
          ]
        );
        return;
      }

      if (!selectedUserCategory) {
        Alert.alert(
          `Oops!`,
          `Please select a category before trying to save.`,
          [
            {
              text: "Back",
              onPress: () => {},
              style: "cancel",
            },
          ]
        );
        return;
      }

      try {
        if (friendId) {
          if (!updateExistingMoment) {
            const requestData = {
              friend: friendId,
              // selectedCategory: selectedCategory, // just need ID below
              selectedUserCategory: selectedUserCategory,
              moment: momentTextRef.current.getText(),
            };
            showFlashMessage("Idea saved!", false, 2000);
            await handleCreateMoment(requestData);
          } else {
            const editData = {
              //these are the actual backend fields
              typed_category: selectedCategory,
              user_category: selectedUserCategory,
              capsule: momentTextRef.current.getText(),
            };

            await handleEditMoment(existingMomentObject?.id, editData);
          }
        }
      } catch (error) {
        console.log("catching errors elsewhere, not sure i need this", error);
      }
    }
  };
  useEffect(() => {
    if (catCreatorVisible) {
      Keyboard.dismiss();
    }
  }, [catCreatorVisible]);

  useEffect(() => {
    if (createMomentMutation.isSuccess) {
      if (screenCameFromToParent === 1) {
        updateMomentText(""); //clear saved text, ONLY after save is confirmed
        setTriggerReFocus(Date.now());
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
    if (editMomentMutation.isSuccess && capsuleList) {
      console.log(
        "useeffect for navving after edit triggered and code will be used"
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
    <TouchableWithoutFeedback
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: "100%",
        // padding: 4,
      }}
      onPress={() => {}}
    >
      <View style={{ flex: 1 }}>
        <View
          style={[
            {
              padding: cardPadding, // Padding needs to be on this view for some reason
              width: "100%",
              flex: 1,
            },
          ]}
        >
          <View
            style={[
              {
                flexDirection: "column",
                justifyContent: "flex-start",
                flex: 1,
                flexGrow: 1,
                width: "100%",
                zIndex: 1,
              },
            ]}
          >
            <View
              style={{
                padding: 10,
              borderRadius: 40,
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "100%",
                flex: 1,
                marginBottom: escortBarSpacer,
              zIndex: 1,
                overflow: "hidden",
                backgroundColor: darkerOverlayColor,
              }}
            >
              <MomentFocusTray
                userId={userId}
                userDefaultCategory={defaultCategory}
                themeAheadOfLoading={themeAheadOfLoading}
                primaryColor={primaryColor}
                lighterOverlayColor={lighterOverlayColor}
                primaryBackground={primaryBackground}
                manualGradientColors={manualGradientColors}
                subWelcomeTextStyle={subWelcomeTextStyle}
                capsuleList={capsuleList}
                friendList={friendList}
                helloesList={helloesList}
                userCategories={userCategories}
                welcomeTextStyle={welcomeTextStyle}
                paddingTop={TOPPER_PADDING_TOP}
                friendDefaultCategory={
                  friendFaves?.friend_default_category || null
                }
                updateExistingMoment={updateExistingMoment}
                freezeCategory={userChangedCategory}
                onPress={openCatCreator}
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
                <TextMomentBox
                  ref={momentTextRef}
                  onTextChange={updateMomentText}
                  triggerReFocus={triggerReFocus} // triggered by category visibility and new friend change
                  isKeyboardVisible={isKeyboardVisible}
                  welcomeTextStyle={welcomeTextStyle}
                  primaryColor={primaryColor}
                />
              )}
            </View>
 
          </View>
        </View>

        <CategoryCreator
          primaryColor={primaryColor}
          primaryBackground={primaryBackground}
          manualGradientColors={manualGradientColors}
          capsuleList={capsuleList}
          userCategories={userCategories}
          freezeCategory={userChangedCategory}
          friendDefaultCategory={friendFaves?.friend_default_category || null}
          isVisible={catCreatorVisible}
          onPress={handleUserCategorySelect}
          addToOnPress={handleUserChangedCategoryState}
          onSave={handleSave}
          updatingExisting={updateExistingMoment}
          existingId={Number(existingMomentObject?.user_category) || null}
          onClose={closeCatCreator}
          categoryColorsMap={categoryColorsMap}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MomentWriteEditView;
