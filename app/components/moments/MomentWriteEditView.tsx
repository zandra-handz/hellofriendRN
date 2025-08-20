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
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import CategoryCreator from "./CategoryCreator";
import { useFocusEffect } from "@react-navigation/native";
 
import { Moment } from "@/src/types/MomentContextTypes";
import useAppNavigations from "@/src/hooks/useAppNavigations"; 
import LoadingPage from "../appwide/spinner/LoadingPage";
 
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
};

const MomentWriteEditView = ({
  screenCameFromToParent,
  momentText,
  catCreatorVisible,
  openCatCreator,
  closeCatCreator,
  categoryColorsMap,
  updateExistingMoment,
  existingMomentObject,
  triggerSaveFromLateral,
  escortBarSpacer,
  cardPadding = 4, // controls padding around the shaded card
}: Props) => {
  const { selectedFriend } = useSelectedFriend();
  const { themeStyles  } = useGlobalStyle();
  const {
    capsuleList,
    handleCreateMoment,
    createMomentMutation,
    handleEditMoment,
    editMomentMutation,
  } = useCapsuleList(); // NEED THIS TO ADD NEW

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

  // const handleResetUserChangedCategoryState = () => {
  //   if (userChangedCategory) {
  //     setUserChangedCategory(false);
  //   }
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     setUserChangedCategory(false);

  //     return () => {
  //       setUserChangedCategory(false);
  //     };
  //   }, [])
  // );

  const userChangedCategoryRef = useRef(false);

 
 
  const TEXT_INPUT_PADDING_TOP = 42;
  const TOPPER_PADDING_TOP = 0;

  useFocusEffect(
    useCallback(() => {
      if (momentText && !userChangedCategory && momentTextRef && momentTextRef.current) {
        // console.error("RESETTING", momentText, userChangedCategory);
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
    if (!catCreatorVisible && selectedFriend) {
      setTriggerReFocus(Date.now());
    }
  }, [selectedFriend]);

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
        if (selectedFriend) {
          if (!updateExistingMoment) {
            const requestData = {
          
              friend: selectedFriend.id,
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
                // paddingTop: TEXT_INPUT_PADDING_TOP, // controls space between top row and text input
                borderRadius: 40,
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "100%",
                flex: 1,
                marginBottom: escortBarSpacer,
                //marginBottom: marginBottom, in momentsviewpage but not here since keyboard is up + no footer bar
                zIndex: 1,
                overflow: "hidden",
                backgroundColor:
                  themeStyles.darkerOverlayBackgroundColor.backgroundColor,
              }}
            >
              <MomentFocusTray
              paddingTop={TOPPER_PADDING_TOP}
                updateExistingMoment={updateExistingMoment}
                freezeCategory={userChangedCategory}
                onPress={openCatCreator}
                label={selectedCategory}
                categoryId={selectedUserCategory}
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
                />
              )}
            </View>
            {/* <View
              style={{
                height: 50,
                paddingHorizontal: 6, // WEIRD NUMBER because + 4 padding above I think
                marginBottom: 6, // WEIRD NUMBER because + 4 padding above
                flexShrink: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <EscortBar
                forwardFlowOn={true}
                label={`Save`}
                onPress={handleSave}
              />
            </View> */}
          </View>
        </View>

        <CategoryCreator
          freezeCategory={userChangedCategory}
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
