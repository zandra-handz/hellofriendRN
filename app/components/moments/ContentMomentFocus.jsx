import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
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

const ContentMomentFocus = ({
  momentText,
  updateExistingMoment,
  existingMomentObject,
}) => {
  const { selectedFriend, friendDashboardData, loadingNewFriend } =
    useSelectedFriend();
  const {
    handleCreateMoment,
    createMomentMutation,
    handleEditMoment,
    editMomentMutation,
  } = useCapsuleList(); // NEED THIS TO ADD NEW
  const { showMessage } = useMessage();
  const { user } = useUser();
  const navigation = useNavigation();
  const { appContainerStyles } = useGlobalStyle();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const momentTextRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showCategoriesSlider, setShowCategoriesSlider] = useState(false);


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

     }, [])
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

  const handleSave = async () => {
    try {
      if (selectedFriend) {
        if (!updateExistingMoment) {
          const requestData = {
            user: user.id,
            friend: selectedFriend.id,
            selectedCategory: selectedCategory,
            moment: momentTextRef.current.getText(),
          };

          await handleCreateMoment(requestData);
        } else {
          const editData = {
            typed_category: selectedCategory,
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
      showMessage(true, null, "Momemt saved!");
      navigation.goBack();
      createMomentMutation.reset(); //additional immediate reset to allow user to return back to screen instantly
    }
  }, [createMomentMutation.isSuccess]);

  useEffect(() => {
    if (editMomentMutation.isSuccess) {
      showMessage(true, null, "Edited moment saved!");
      navigation.navigate("Moments");
    }
  }, [editMomentMutation.isSuccess, editMomentMutation.data]);

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={appContainerStyles.screenContainer}>
        {!updateExistingMoment && (
          
        <BelowHeaderContainer
          height={30}
          alignItems="center"
          marginBottom={4}
          justifyContent="flex-end"
          children={<FriendModalIntegrator includeLabel={false} navigationDisabled={true} width="100%" />}
        />
        
        )}
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <BodyStyling
            height={"100%"}
            width={"100%"}
            paddingTop={"6%"}
            paddingHorizontal={0}
            paddingBottom={"0%"}
            children={
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  top: -18,
                  justifyContent: "flex-start",
                }}
              >
                <TextMomentBox
                  ref={momentTextRef} 
                  title={
                    updateExistingMoment ? "Edit moment" : "Write new moment"
                  }
                  onTextChange={updateMomentText}
                
                />
              </View>
            }
          />
        </View>

        {showCategoriesSlider && selectedFriend && friendDashboardData && (
          // <View
          //   style={{
          //     position: "absolute",

          //     bottom: 32,
          //     left: 0,
          //     right: 0,
          //     width: "100%",
          //     //  flex: 1,
          //     backgroundColor: "pink",
          //                   zIndex: 6000,
          //       elevation: 6000,
          //   }}
          // >

          <CategoryCreator
            onCategorySelect={handleCategorySelect}
            updateExistingMoment={updateExistingMoment}
            existingCategory={existingMomentObject?.typedCategory || null}
            momentTextForDisplay={momentTextRef.current.getText()}
            onParentSave={handleSave}
            selectedFriend={selectedFriend}
            friendDashboardData={friendDashboardData}
            loadingNewFriend={loadingNewFriend}
            isKeyboardVisible={isKeyboardVisible}
          />
        )}
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

export default ContentMomentFocus;
