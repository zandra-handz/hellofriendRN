import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";

import { useAuthUser } from "@/src/context/AuthUserContext";
import LeafTopContainer from "./LeafTopContainer";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";
import SafeView from "../appwide/format/SafeView";
import SimpleDisplayCard from "../appwide/display/SimpleDisplayCard";

import TextMomentBox from "./TextMomentBox";

import { useNavigation } from "@react-navigation/native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import FriendSelectModalVersionButtonOnly from "@/app/components/friends/FriendSelectModalVersionButtonOnly";

import CategoryCreator from "./CategoryCreator";

import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";

const ContentMomentFocus = ({
  momentText,
  updateExistingMoment,
  existingMomentObject,
}) => {
  const { selectedFriend, friendDashboardData, loadingNewFriend } =
    useSelectedFriend();
  const {
    capsuleList,
    categoryCount,
    categoryNames,
    handleCreateMoment,
    createMomentMutation,
    handleEditMoment,
    editMomentMutation,
  } = useCapsuleList(); // NEED THIS TO ADD NEW
  const { authUserState } = useAuthUser();
  const navigation = useNavigation();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const momentTextRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showCategoriesSlider, setShowCategoriesSlider] = useState(false);

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
      // console.log("in parent", momentTextRef.current.getText().length);
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
            user: authUserState.user.id,
            friend: selectedFriend.id,
            selectedCategory: selectedCategory,
            moment: momentTextRef.current.getText(),
          };

          await handleCreateMoment(requestData);
        } else {
          console.log("attempting to save edits");

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
      navigation.goBack();
    }
  }, [createMomentMutation.isSuccess]);

  useEffect(() => {
    if (editMomentMutation.isSuccess) {
      navigation.goBack();
    }
  }, [editMomentMutation.isSuccess, editMomentMutation.data]);

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            zIndex: 6000,
            elevation: 6000,
            top: -20,
            right: 60,
          }}
        >
          <FriendSelectModalVersionButtonOnly
            includeLabel={false}
            width="100%"
          />
        </View>
        <View
          style={{
            width: "100%",

            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {!updateExistingMoment && (
            <BelowHeaderContainer
              height={140} //60
              alignItems="center"
              //marginBottom="2%" //default is currently set to 2
              justifyContent="flex-start"
              // children={
              //   <FriendSelectModalVersionButtonOnly
              //     includeLabel={false}
              //     width="100%"
              //   />
              // }
            />
          )}
          <LeafTopContainer
            paddingHorizontal={0} //padding is in inner element in this case because it is a different color
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
                  width={"100%"}
                  height={"100%"}
                  ref={momentTextRef}
                  title={
                    updateExistingMoment ? "Edit moment" : "Write new moment"
                  }
                  onTextChange={updateMomentText}
                  multiline={true}
                />

                {/* <View style={[{ height: 100, marginTop: 4 }]}>
                <SimpleDisplayCard value={selectedCategory} />
              </View> */}
              </View>
            }
          />
        </View>

        {showCategoriesSlider &&
          selectedFriend &&
          friendDashboardData &&
    
           (
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
        {!isKeyboardVisible && (
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
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    //flexDirection: "column",
    justifyContent: "space-between",
    //top: 0,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectFriendContainer: {
    width: "100%",
    justifyContent: "center",
    minHeight: 30,
    maxHeight: 30,
    height: 30,
  },
  blurView: {
    overflow: "hidden",
    width: "100%",
    flex: 1,
    borderRadius: 30,
  },
  modalTextInput: {
    fontSize: 16,
    color: "white",
    alignSelf: "center",
    padding: 24,
    textAlignVertical: "top",
    borderWidth: 1.8,
    borderRadius: 50,
    marginBottom: 10,
    width: "99%",
    flex: 1,
    height: "auto",
  },
  displayText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "white",
    padding: 10,
    textAlignVertical: "top",
    borderWidth: 0,
    borderRadius: 20,
    width: "100%",
    flexShrink: 1,
  },
  wordCountText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "white",
    textAlign: "right",
  },
  displayTextContainer: {
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "auto",
    backgroundColor: "transparent",
    flexShrink: 1,
    height: "auto",
  },

  categoryContainer: {
    width: "100%",
    flex: 1,
    height: "auto",
    maxHeight: "90%",
    borderRadius: 8,
    paddingTop: 10,
  },
  closeButton: {
    marginTop: 14,
    borderRadius: 0,
    padding: 4,
    height: "auto",

    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
  backButton: {
    marginTop: 0,
    borderRadius: 0,
    padding: 4,
    height: "auto",

    alignItems: "center",
  },
});

export default ContentMomentFocus;
