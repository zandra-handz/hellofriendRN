import { useState, useRef, useEffect, useCallback } from "react";
import { View, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import BodyStyling from "../scaffolding/BodyStyling";
import { useUser } from "@/src/context/UserContext";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import TextMomentBox from "./TextMomentBox";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import FriendModalIntegrator from "@/app/components/friends/FriendModalIntegrator";
import CategoryCreator from "./CategoryCreator";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";
import { useFocusEffect } from "@react-navigation/native";
import { useMessage } from "@/src/context/MessageContext";
import LoadedMoments from "../buttons/moments/LoadedMoments";
import BobblngFlashingIcon from "../buttons/moments/BobblngFlashingIcon";
import BobbingAnim from "@/app/animations/BobbingAnim";
import { MaterialIcons } from "@expo/vector-icons";

import UserCategorySelector from "../headers/UserCategorySelector";

const MomentWriteEditView = ({
  momentText,
  updateExistingMoment,
  existingMomentObject,
}) => {
  const { selectedFriend, friendDashboardData, loadingNewFriend } =
    useSelectedFriend();
  const { themeStyles, appContainerStyles } = useGlobalStyle();
  const {
    handleCreateMoment,
    createMomentMutation,
    handleEditMoment,
    editMomentMutation,
  } = useCapsuleList(); // NEED THIS TO ADD NEW
  const { showMessage } = useMessage();
  const { user } = useUser();
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
const [selectedUserCategoryId, setSelectedUserCategoryId ] = useState(null);
  const momentTextRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedUserCategory, setSelectedUserCategory] = useState("");

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
      console.log(existingMomentObject);
      setSelectedCategory(existingMomentObject.typedCategory);
    }
  }, [updateExistingMoment, existingMomentObject]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };


    const handleUserCategorySelect = (category) => {
      console.log('selecting category: ', category);
      
    setSelectedUserCategory(category);
  };

  const handleSave = async () => {
    try {
      if (selectedFriend) {
        if (!updateExistingMoment) {
          const requestData = {
            user: user.id,
            friend: selectedFriend.id,
            selectedCategory: selectedCategory,
            selectedUserCategory: selectedUserCategory || null,
            moment: momentTextRef.current.getText(),
          };

          await handleCreateMoment(requestData);
        } else {
          const editData = {
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
  };

  useEffect(() => {
    if (createMomentMutation.isSuccess) {
      // showMessage(true, null, "Momemt saved!");
      navigation.goBack();
      createMomentMutation.reset(); //additional immediate reset to allow user to return back to screen instantly
    }
  }, [createMomentMutation.isSuccess]);

  useEffect(() => {
    if (editMomentMutation.isSuccess) {
      showMessage(true, null, "Edited moment saved!");
      navigation.navigate("Moments");
    }
  }, [editMomentMutation.isSuccess]);

  // keep this consistent with MomentViewPage
  return (
    <TouchableWithoutFeedback
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        padding: 4,
        borderWidth: 0,
        width: "100%",
      }}
      onPress={() => {}}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          padding: 4,
          borderWidth: 0,
          width: "100%",
        }}
      >
        <View
          style={[
            appContainerStyles.talkingPointCard,
            {
              backgroundColor: themeStyles.primaryBackground.backgroundColor,
            },
          ]}
        >
          <BelowHeaderContainer
            height={0}
            alignItems="flex-end"
            marginBottom={0} //default is currently set to 2
            justifyContent="flex-end"
            children={
              <>
                {!updateExistingMoment && (
                  <View style={{ width: 36, height: "auto" }}>
                    <BobblngFlashingIcon
                      size={36}
                      icon={
                        <MaterialIcons
                          name="tips-and-updates"
                          size={26}
                          color={themeStyles.primaryBackground.backgroundColor}
                        />
                      }
                    />
                  </View>

                  // <FriendModalIntegrator
                  //   includeLabel={true}
                  //   color={themeStyles.primaryText.color}
                  //   width={120}
                  //   navigationDisabled={true}
                  //   iconSize={22}
                  //   useGenericTextColor={true}
                  // />
                )}
              </>
            }
          />
          {/* <View
            style={{
              flex: 1,
              flexDirection: "column",
              top: -18,
              justifyContent: "flex-start",
            }}
          > */}
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

            CategoryCreatorComponent={
          <CategoryCreator
            show={showCategoriesSlider}
            updateCategoryInParent={handleCategorySelect}
            updateExistingMoment={updateExistingMoment}
            existingCategory={existingMomentObject?.typedCategory || null}
            momentTextForDisplay={momentTextRef?.current?.getText() || null}
            onParentSave={handleSave}
            isKeyboardVisible={isKeyboardVisible}
          />


            }


          />
          {/* </View> */}
      
        </View> 
    <UserCategorySelector onPress={handleUserCategorySelect} selectedId={selectedUserCategory} />
        {/* {selectedFriend && friendDashboardData && (
          <CategoryCreator
            show={showCategoriesSlider}
            updateCategoryInParent={handleCategorySelect}
            updateExistingMoment={updateExistingMoment}
            existingCategory={existingMomentObject?.typedCategory || null}
            momentTextForDisplay={momentTextRef?.current?.getText() || null}
            onParentSave={handleSave}
            isKeyboardVisible={isKeyboardVisible}
          />
        )} */}
        {/* {!isKeyboardVisible && (
          <View style={{ position: "absolute", bottom: -10 }}>
            <ButtonBaseSpecialSave
              label="SAVE MOMENT "
              maxHeight={70}
              onPress={handleSave}
              isDisabled={!selectedCategory}
              fontFamily={"Poppins-Bold"}
              image={require("@/app/assets/shapes/redheadcoffee.png")}
            />
          </View>
        )} */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MomentWriteEditView;
