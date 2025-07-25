import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Keyboard,
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
  

import UserCategorySelector from "../headers/UserCategorySelector";

const MomentWriteEditView = ({
  momentText,
  updateExistingMoment,
  existingMomentObject,
}) => {
  const { selectedFriend  } =
    useSelectedFriend();
  const { themeStyles, appContainerStyles } = useGlobalStyle();
  const {
    handleCreateMoment,
    createMomentMutation,
    handleEditMoment,
    editMomentMutation,
  } = useCapsuleList(); // NEED THIS TO ADD NEW
 
  const { user } = useUser();
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); 
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
      // console.log(existingMomentObject);
      setSelectedCategory(existingMomentObject.typedCategory);
    }
  }, [updateExistingMoment, existingMomentObject]);

  const handleCategorySelect = (category) => {
    if (!category) {
      return;
    }
    setSelectedCategory(category);
  };

  const handleUserCategorySelect = (category) => {
    // console.log("selecting category: ", category);

    setSelectedUserCategory(category);
  };

  const handleSave = async () => {

    if (!selectedUserCategory) {
              Alert.alert(
          `DEV MODE`,
          `Oops! SelectedUserCategory is null`,
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

      try {
        if (selectedFriend) {
          if (!updateExistingMoment) {
            const requestData = {
              user: user.id,
              friend: selectedFriend.id,
              selectedCategory: selectedCategory,
              selectedUserCategory: selectedUserCategory,
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
      // showMessage(true, null, "Edited moment saved!");
      navigation.goBack();
      // navigation.navigate("Moments");
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
        <UserCategorySelector
          onPress={handleUserCategorySelect}
          onSave={handleSave}
          updatingExisting={updateExistingMoment}
          existingId={Number(existingMomentObject?.user_category) || null}
          selectedId={selectedUserCategory}
        />

        <View
          style={[
            appContainerStyles.talkingPointCard,
            {
              backgroundColor: themeStyles.primaryBackground.backgroundColor,
              paddingTop: 60,
            },
          ]}
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
            // CategoryCreatorComponent={
            //   <CategoryCreator
            //     show={showCategoriesSlider}
            //     updateCategoryInParent={handleCategorySelect}
            //     updateExistingMoment={updateExistingMoment}
            //     existingCategory={existingMomentObject?.typedCategory || null}
            //     momentTextForDisplay={momentTextRef?.current?.getText() || null}
            //     onParentSave={handleSave}
            //     isKeyboardVisible={isKeyboardVisible}
            //   />
            // }
          /> 
        </View>
 
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MomentWriteEditView;
