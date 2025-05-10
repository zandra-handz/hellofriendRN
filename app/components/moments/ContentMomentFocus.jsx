import { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Keyboard, Dimensions, KeyboardAvoidingView } from "react-native";

import { useAuthUser } from "@/src/context/AuthUserContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ButtonBaseSpecialSave from "../buttons/scaffolding/ButtonBaseSpecialSave";

import SimpleDisplayCard from "../appwide/display/SimpleDisplayCard";

import TextMomentBox from "./TextMomentBox";

import { useNavigation } from "@react-navigation/native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import FriendSelectModalVersionButtonOnly from "@/app/components/friends/FriendSelectModalVersionButtonOnly";

import CardCategoriesAsButtons from "../scaffolding/CardCategoriesAsButtons";

import BodyStyling from "../scaffolding/BodyStyling";
import BelowHeaderContainer from "../scaffolding/BelowHeaderContainer";

const ContentMomentFocus = ({
  momentText,
  updateExistingMoment,
  existingMomentObject,
}) => {
  const { selectedFriend } = useSelectedFriend();
  const {
    handleCreateMoment,
    createMomentMutation,
    handleEditMoment,
    editMomentMutation,
  } = useCapsuleList(); // NEED THIS TO ADD NEW
  const { authUserState } = useAuthUser();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();

  const { width, height } = Dimensions.get("window");

  const oneEighthHeight = height / 8;
  const oneHalfHeight = height / 2; //notes when keyboard is up

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const momentTextRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showCategoriesSlider, setShowCategoriesSlider] = useState(false);

  const categoriesHeight = 46; // Default height

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
      setShowCategoriesSlider(true);
    }
  }, [momentText]);

  const updateMomentText = (text) => {
    if (momentTextRef && momentTextRef.current) {
      const textLengthPrev = momentTextRef.current.getText().length;
      if (textLengthPrev === 0) {
        if (text.length - textLengthPrev > 1) {
          //this is here to check if something is copy-pasted in or shared in
          setShowCategoriesSlider(true);
        }
      }

      momentTextRef.current.setText(text);
      // console.log("in parent", momentTextRef.current.getText().length);
    }
    if (text.length < 1) {
      setShowCategoriesSlider(false);
    }

    if (text.length === 1) {
      setShowCategoriesSlider(true);
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
    <View style={styles.container}>
      <View
        style={{
          width: "100%",

          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {!updateExistingMoment && (
          <BelowHeaderContainer
            height={30}
            alignItems="center"
            marginBottom="2%" //default is currently set to 2
            justifyContent="flex-end"
            children={
              <FriendSelectModalVersionButtonOnly
                includeLabel={false}
                width="100%"
              />
            }
          />
        )}
        <BodyStyling
          height={"100%"}
          width={"101%"}
          paddingTop={"0%"}
          paddingHorizontal={"0%"} //padding is in inner element in this case because it is a different color
          children={
            <View style={{ flex: 1, flexDirection: "column" }}>
              <TextMomentBox
                width={"100%"}
                height={!isKeyboardVisible ? oneHalfHeight : "100%"}
                ref={momentTextRef}
                title={
                  updateExistingMoment ? "Edit moment" : "Write new moment"
                }
                onTextChange={updateMomentText}
                multiline={true}
              />

              <View style={[{ height: oneEighthHeight, marginTop: "4%" }]}>
                <SimpleDisplayCard value={selectedCategory} />
              </View>
            </View>
          }
        />
      </View>

      {isKeyboardVisible && showCategoriesSlider && selectedFriend && (
        <KeyboardAvoidingView >
          
        <View
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            width: "100%",
            flex: 1,
          }}
        >
          <View style={[styles.buttonContainer, { height: 46 }]}>
            <CardCategoriesAsButtons
              onCategorySelect={handleCategorySelect}
              updateExistingMoment={updateExistingMoment}
              existingCategory={existingMomentObject?.typedCategory || null}
              momentTextForDisplay={momentTextRef.current.getText()}
              onParentSave={handleSave}
            />
          </View>
        </View>
        
        </KeyboardAvoidingView>
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
  buttonContainer: {
    // height: "22%",
    zIndex: 6000,
    elevation: 6000,

    marginBottom: 10,
    width: "100%",
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
