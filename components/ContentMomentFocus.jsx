import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useAuthUser } from "../context/AuthUserContext";
import { useFriendList } from "../context/FriendListContext";
import { useCapsuleList } from "../context/CapsuleListContext";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useFocusEffect } from "@react-navigation/native";
import AddOutlineSvg from '../assets/svgs/add-outline.svg';
import ButtonBaseSpecialSave from "./ButtonBaseSpecialSave";

import TextMomentBox from "../components/TextMomentBox";

import { useNavigation } from "@react-navigation/native";

import { useSelectedFriend } from "../context/SelectedFriendContext";

import FriendSelectModalVersionButtonOnly from "../components/FriendSelectModalVersionButtonOnly";
import CardCategoriesAsButtons from "../components/CardCategoriesAsButtons";

const ContentMomentFocus = ({ placeholderText }) => {
  const { selectedFriend, loadingNewFriend, friendDashboardData } =
    useSelectedFriend();
  const { handleCreateMoment, createMomentMutation } = useCapsuleList(); // NEED THIS TO ADD NEW
  const { authUserState } = useAuthUser();
  const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();

  const { width, height } = Dimensions.get("window");

  const oneFifthHeight = height / 5;
  const oneSixthHeight = height / 6;
  const oneSeventhHeight = height / 7;
  const oneHalfHeight = height / 2; //notes when keyboard is up

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [momentText, setMomentText] = useState("");
  const momentTextRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showCategoriesSlider, setShowCategoriesSlider] = useState(false);

  const [categoriesHeight, setCategoriesHeight] = useState(50); // Default height

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

  const updateMomentText = (text) => {
    if (momentTextRef && momentTextRef.current) {
      momentTextRef.current.setText(text);
      console.log("in parent", momentTextRef.current.getText().length);
    }
    if (text.length < 1) {
      setShowCategoriesSlider(false);
    }

    if (text.length === 1) {
      setShowCategoriesSlider(true);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  useEffect(() => {
    if (selectedCategory) {
      console.log(selectedCategory);
    }


  }, [selectedCategory]);

  const handleSave = async () => {
    try {
      if (selectedFriend) {
        const requestData = {
          user: authUserState.user.id,
          friend: selectedFriend.id,
          selectedCategory: selectedCategory,
          moment: momentTextRef.current.getText(),
        };

        await handleCreateMoment(requestData);
      }
    } catch (error) {
      console.log("catching errors elsewhere, not sure i need this", error);
    }
  };

  useEffect(() => {
    if (createMomentMutation.isSuccess) {
      //resetTextInput();
      //setSelectedCategory('');
      navigation.goBack();
    }
  }, [createMomentMutation.isSuccess]);

  return (
    <LinearGradient
      colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container]}
    >
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <View
        style={{
          width: "100%",

          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={[styles.selectFriendContainer, { marginBottom: "2%" }]}>
          <FriendSelectModalVersionButtonOnly
            includeLabel={true}
            width="100%"
          />
        </View>
        <View
          style={[
            styles.innerContainer,
            themeStyles.genericTextBackground,
            { borderColor: themeAheadOfLoading.lightColor },
          ]}
        >
          <View style={styles.paddingForElements}>
            <TextMomentBox
              width={"100%"}
              height={!isKeyboardVisible ? oneHalfHeight : "100%"}
              ref={momentTextRef}
              title={"Write new moment"}
              onTextChange={updateMomentText}
              multiline={true}
            />
          </View>

          {!isKeyboardVisible && (
            <ButtonBaseSpecialSave
              label="SAVE MOMENT "
              maxHeight={80}
              onPress={handleSave}
              isDisabled={!selectedCategory}
              fontFamily={"Poppins-Bold"}
              image={require("../assets/shapes/redheadcoffee.png")}
            />
          )}
        </View>
      </View>

      {/* </TouchableWithoutFeedback>  */}

      {!isKeyboardVisible && (
        <ButtonBaseSpecialSave
          label="SAVE MOMENT "
          maxHeight={80}
          onPress={handleSave}
          isDisabled={!selectedCategory}
          fontFamily={"Poppins-Bold"}
          image={require("../assets/shapes/redheadcoffee.png")}
        />
      )}

      {isKeyboardVisible && showCategoriesSlider && selectedFriend && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            flex: 1,
          }}
        >
          <View style={[styles.buttonContainer, { height: categoriesHeight }]}>
            <CardCategoriesAsButtons
              onCategorySelect={handleCategorySelect}
              momentTextForDisplay={momentTextRef.current.getText()}
              onParentSave={handleSave}
            />
          </View>
        </View>
      )}
    </LinearGradient>
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
  innerContainer: {
    height: "96%",
    alignContent: "center",
    //paddingHorizontal: "4%",
    //paddingTop: "6%",
    width: "101%",
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "space-between",
    // zIndex: 2000,
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
    height: "10%",
    zIndex: 6000,
    elevation: 6000,

    marginBottom: 0,
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
