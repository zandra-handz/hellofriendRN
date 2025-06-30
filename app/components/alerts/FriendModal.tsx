import React, { useEffect, useRef } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  Text,
  Animated,
  StatusBar,
  Touchable,
} from "react-native";
import LoadingPage from "../appwide/spinner/LoadingPage";
import ArrowLeftCircleOutlineSvg from "@/app/assets/svgs/arrow-left-circle-outline.svg";
import SmallAddButton from "../home/SmallAddButton";
import MomentsSearchBar from "../moments/MomentsSearchBar";
import { Dimensions } from "react-native";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import FriendListUI from "./FriendListUI";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

interface FriendModalProps {
  isVisible: boolean;
  navigationDisabled: boolean;
  animType: string;
  toggle: () => void;
  questionText: string;
  onCancel: () => void;
}

const FriendModal: React.FC<FriendModalProps> = ({
  isVisible,
  navigationDisabled,
  animType = "slide",
  toggle,
  questionText = "Switch friend",

  onCancel,
}) => {
  const { themeStyles } = useGlobalStyle();
  const navigation = useNavigation();
  const { friendList, getThemeAheadOfLoading } = useFriendList();
  const { setFriend, loadingNewFriend } = useSelectedFriend();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const modalHeight = Dimensions.get("window").height * 0.66;
console.log('FRIEND MODALRERENDERED');
  const includeSearch: boolean = true;

  const searchKeys: string[] = [`name`];

  const isFetching: boolean = !!loadingNewFriend;

  const handleSearchFriends = (item) => {
    const selectedOption = friendList.find((friend) => friend === item);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend);
    //setForceUpdate(prevState => !prevState);

    toggle();
  };

  const handleSelectFriend = (itemId) => {
    const selectedOption = friendList.find((friend) => friend.id === itemId);

    const selectedFriend = selectedOption || null;
    console.log('ESTTING SELECTED FRIEND');
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend);
    toggle();
    if (!navigationDisabled) {
      navigation.navigate("Moments");
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      StatusBar.setHidden(true, "fade");
    } else {
      StatusBar.setHidden(false, "fade");
    }
  }, [isVisible]);

  return (
    <Modal
      transparent={true}
      //transparent={false}
      visible={isVisible}
      animationType={animType}
      onRequestClose={toggle}
      style={{ margin: 0 }}
      //   presentationStyle="fullScreen"
    >
      {/* <SafeView style={{flex: 1}}> */}
      {friendList && (
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >  */}

          <View
            style={[
              styles.modalContent,
              themeStyles.genericTextBackground,
              {
                // height: modalHeight,
                height: "auto",
                borderColor:
                  themeStyles.genericTextBackgroundShadeTwo.backgroundColor,
              },
            ]}
          >
            <View style={[styles.headerContainer, themeStyles.genericText]}>
              <View style={styles.firstSection}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.closeButtonTop}
                >
                  <ArrowLeftCircleOutlineSvg
                    width={26}
                    height={26}
                    color={themeStyles.genericText.color}
                  />
                </TouchableOpacity>
              </View>

              {/* <View style={[styles.headerSection, styles.middleSection]}>
                            <ProfileTwoUsersSvg
                              width={42}
                              height={42}
                              color={themeStyles.modalIconColor.color}
                            />
                </View> */}

              <View style={styles.lastSection}>
                {includeSearch && friendList && friendList?.length > 0 && (
                  <View
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      maxHeight: 50,
                      height: "auto",
                    }}
                  >
                    <MomentsSearchBar
                      height={30}
                      iconSize={15}
                      borderColor={"transparent"}
                      data={friendList}
                      placeholderText="Search friends"
                      onPress={handleSearchFriends}
                      searchKeys={searchKeys}
                    />
                  </View>
                )}
              </View>
            </View>
            {questionText && (
              <View style={styles.questionTextContainer}>
                <Text style={[styles.questionText, themeStyles.genericText]}>
                  {questionText}
                </Text>
                <SmallAddButton
                  label={"Add friend"}
                  onPress={() => navigation.navigate("AddFriend")}
                />
              </View>
            )}

            {isFetching ? (
              <LoadingPage loading={isFetching} spinnerType="circle" />
            ) : (
              <>
                <View
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70%",
                    minWidth: 300,
                    width: "100%",
                    flexGrow: 1,
                  }}
                >
                  {friendList && friendList.length > 0 && (
                    <FriendListUI
                      data={friendList}
                      onPress={handleSelectFriend}
                    />
                  )}
                </View>
              </>
            )}
          </View>
        </Animated.View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    zIndex: 0,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.84)", // Slightly transparent background
  },
  modalContent: {
    width: "96%",
    minHeight: 200,
    padding: 10,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: "center",
    paddingBottom: 30,
    marginBottom: "6%",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: "2%",
    flex: 1,
  },
  closeButtonTop: {
    padding: 5,
  },
  headerContainer: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between", // Ensures equal spacing
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    zIndex: 3,
  },
  headerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  firstSection: {
    flex: 1, // Each section takes up equal space
    justifyContent: "center",
  },
  lastSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  middleSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  questionTextContainer: {
    flex: 1, // Let the container grow and fill available space
    flexWrap: "wrap", // Allow wrapping inside the container
    alignItems: "center", // Center content horizontally (optional)
    justifyContent: "center", // Center content vertically (optional)
  },

  questionText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    lineHeight: 28, // Optional for better readability
    flexShrink: 1, // Allow text to shrink and wrap within available space
  },

  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 20,
    marginVertical: 6,
    width: "100%",
    alignItems: "center",
  },
  successCancelButton: {
    backgroundColor: "#388E3C",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
});

export default FriendModal;
