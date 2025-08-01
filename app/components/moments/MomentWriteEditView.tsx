import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useUser } from "@/src/context/UserContext";
import TextMomentBox from "./TextMomentBox";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import CategoryCreator from "./CategoryCreator";
import { useFocusEffect } from "@react-navigation/native";
import EscortBar from "./EscortBar";
import UserCategorySelector from "../headers/UserCategorySelector";
import { close } from "@sentry/react-native";
import { Moment } from "@/src/types/MomentContextTypes";
import useAppNavigations from "@/src/hooks/useAppNavigations";

import SelectedCategoryButton from "./SelectedCategoryButton";
import GlobalPressable from "../appwide/button/GlobalPressable";
type Props = {
  momentText: string;
  catCreatorVisible: boolean;
  closeCatCreator: () => void;
  openCatCreator: () => void;
  categoryColorsMap: object;
  updateExistingMoment: boolean;
  existingMomentObject?: Moment;
  triggerSaveFromLateral: boolean;
};

const MomentWriteEditView = ({
  momentText,
  catCreatorVisible,
  openCatCreator,
  closeCatCreator,
  categoryColorsMap,
  updateExistingMoment,
  existingMomentObject,
  triggerSaveFromLateral,
}: Props) => {
  const { selectedFriend } = useSelectedFriend();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyle();
  const {
    capsuleList,
    handleCreateMoment,
    createMomentMutation,
    handleEditMoment,
    editMomentMutation,
  } = useCapsuleList(); // NEED THIS TO ADD NEW

  const { navigateBack, navigateToMoments, navigateToMomentView } =
    useAppNavigations();

  const { user } = useUser();
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const momentTextRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUserCategory, setSelectedUserCategory] = useState<number>(0);
  const [startingId, setStartingId] = useState();
  const [showCategoriesSlider, setShowCategoriesSlider] =
    useState(!!momentText);

  useFocusEffect(
    useCallback(() => {
      if (momentText) {
        momentTextRef.current.setText(momentText);
        setShowCategoriesSlider(true);
      } else {
        setShowCategoriesSlider(false);
      }
      return () => {
        setShowCategoriesSlider(false);
      };
    }, [momentText])
  );

  useEffect(() => {
    if (!triggerSaveFromLateral) {
      // right now the trigger doesn't reset itself because this triggers a process that'll unmount it I believe
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
    if (momentText) {
      updateMomentText(momentText);
      if (!showCategoriesSlider) {
        setShowCategoriesSlider(true);
      }
    }
  }, [momentText]);

  const updateMomentText = (text) => {
    if (momentTextRef && momentTextRef.current) {
      const textLengthPrev = momentTextRef.current.getText().length;
      if (textLengthPrev === 0) {
        if (text.length - textLengthPrev > 1) {
          //this is here to check if something is copy-pasted in or shared in
          if (!showCategoriesSlider) {
            setShowCategoriesSlider(true);
          }
        }
      }

      momentTextRef.current.setText(text);
    }
    if (text.length < 1) {
      if (showCategoriesSlider) {
        setShowCategoriesSlider(false);
      }
    }

    if (text.length === 1) {
      if (!showCategoriesSlider) {
        setShowCategoriesSlider(true);
      }
    }
  };

  useEffect(() => {
    if (updateExistingMoment && existingMomentObject) {
      // console.log(`EEYOOOOOOOOOOOO`);
      // console.log(existingMomentObject);
      setSelectedCategory(existingMomentObject.user_category_name);
      setSelectedUserCategory(Number(existingMomentObject.user_category));
    }
  }, [updateExistingMoment, existingMomentObject]);

  const handleCategorySelect = (category) => {
    if (!category) {
      return;
    }
    setSelectedCategory(category);
  };

  const handleUserCategorySelect = ({ name: name, id: id }) => {
    setSelectedUserCategory(id);
    setSelectedCategory(name);
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
              // these are the props in the context function that get converted to backend
              user: user.id,
              friend: selectedFriend.id,
              // selectedCategory: selectedCategory, // just need ID below
              selectedUserCategory: selectedUserCategory,
              moment: momentTextRef.current.getText(),
            };
            // console.log(requestData);
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
      // showMessage(true, null, "Momemt saved!");
      navigateBack();
      createMomentMutation.reset(); //additional immediate reset to allow user to return back to screen instantly
    }
  }, [createMomentMutation.isSuccess]);

  //this needs to go to the new index instead if it has a new index
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
              padding: 4, // Padding needs to be on this view for some reason
              width: "100%",
              flex: 1,
              //  height: '100%',
            },
          ]}
        >
          <View
            style={{
              width: "100%",

              position: "absolute",
              top: 15,

              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <SelectedCategoryButton
              zIndex={3}
              onPress={openCatCreator}
              label={selectedCategory}
              categoryId={selectedUserCategory}
            />
          </View>
          <View
            style={[
              {
                flexDirection: "column",
                justifyContent: "flex-start",
                flex: 1,
                flexGrow: 1,
                width: "100%",
                zIndex: 1,
                // backgroundColor: "pink",
              },
            ]}
          >
            <View
              style={{
                padding: 20,
                borderRadius: 40,
                flexDirection: "column",
                justifyContent: "flex-start",
                //  flex: 1,
                width: "100%",
                flex: 1,
                marginBottom: 6,
                //marginBottom: marginBottom, in momentsviewpage but not here since keyboard is up + no footer bar
                zIndex: 1,

                overflow: "hidden",

                backgroundColor:
                  themeStyles.darkerOverlayBackgroundColor.backgroundColor,
              }}
            >
              <TextMomentBox
                ref={momentTextRef}
                editScreen={updateExistingMoment}
                title={updateExistingMoment ? "Edit:" : "Add talking point"}
                onTextChange={updateMomentText}
                showCategoriesSlider={showCategoriesSlider}
                handleCategorySelect={handleCategorySelect}
                existingCategory={existingMomentObject?.typedCategory || null}
                momentTextForDisplay={momentTextRef?.current?.getText() || null}
                onSave={handleSave}
                isKeyboardVisible={isKeyboardVisible}
                selectedUserCategory={selectedUserCategory}
              />
            </View>
            <View
              style={{
                // backgroundColor: "orange",
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
            </View>
          </View>

          {/* </View> */}
        </View>
        {/* <View
          style={{
            position: "absolute",
            zIndex: 50000,
            bottom: 100,
            width: "100%",
          }}
        >
          <EscortBar forwardFlowOn={true} label={`Save`} onPress={handleSave} />
        </View> */}

        {/* // <UserCategorySelector
          //   onPress={handleUserCategorySelect}
          //   onSave={handleSave}
          //   updatingExisting={updateExistingMoment}
          //   existingId={Number(existingMomentObject?.user_category) || null}
          //   selectedId={selectedUserCategory}
          // /> */}
        <CategoryCreator
          isVisible={catCreatorVisible}
          onPress={handleUserCategorySelect}
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
