import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import ProfileTwoUsersSvg from "@/app/assets/svgs/profile-two-users.svg";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext"; 
import FriendModal from "../alerts/FriendModal";
import { Dimensions } from "react-native";

const FriendSelectModalVersionButtonOnly = ({
  addToPress,
  color,
  addToOpenModal,
  includeLabel = false,
  iconSize = 22,
  width = "60%",
}) => {
  const { themeStyles } = useGlobalStyle();
  const globalStyles = useGlobalStyle();
  const { selectedFriend, friendLoaded, setFriend, loadingNewFriend } =
    useSelectedFriend();
  const { friendList, themeAheadOfLoading, getThemeAheadOfLoading } =
    useFriendList();
  const [isFriendMenuModalVisible, setIsFriendMenuModalVisible] =
    useState(false);
  //const [forceUpdate, setForceUpdate] = useState(false);

  const adjustFontSize = (fontSize) => {
    return globalStyles.fontSize === 20 ? fontSize + 2 : fontSize;
  };

  const textStyles = (fontSize, color) => ({
    fontSize: adjustFontSize(fontSize),
    color,
    ...(globalStyles.highContrast && {
      textShadowColor: "rgba(0, 0, 0, 0.0)",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
    }),
  });

  //kind of aggressive that it tries to refocus every time it toggles whether open or closed
  // but android is being a butt about opening the keyboard
  const toggleModal = () => {
    if (addToPress) {
      addToPress(); // Cal
      // l it without any arguments if not needed
    }

    setIsFriendMenuModalVisible(false);
  };

  const openModal = () => {
    if (addToOpenModal) { 
      addToOpenModal();
    }

    setIsFriendMenuModalVisible(true);
  };

  const handleSelectFriend = (itemId) => {
    const selectedOption = friendList.find((friend) => friend.id === itemId);
  
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend); 
    toggleModal();
  };

  const handleSelectFriendSearch = (item) => {
    const selectedOption = friendList.find((friend) => friend === item);
    const selectedFriend = selectedOption || null;
    setFriend(selectedFriend);
    getThemeAheadOfLoading(selectedFriend);
    //setForceUpdate(prevState => !prevState);

    toggleModal();
  };

  return (
    <>
      <View style={[styles.container, { width }]}>
        <View style={styles.displaySelectedContainer}>
          {loadingNewFriend && (
            <View style={styles.loadingWrapper}>
              <LoadingPage
                loading={loadingNewFriend}
                spinnerType="flow"
                spinnerSize={36}
                color={themeAheadOfLoading.darkColor}
                includeLabel={false}
              />
            </View>
          )}
          {!loadingNewFriend && includeLabel && (
            <Text
              style={[
                styles.displaySelected,
                textStyles(17, themeAheadOfLoading.fontColorSecondary),
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(friendLoaded && `For:  ${selectedFriend?.name}`) ||
                "Which friend is this for?"}
            </Text>
          )}

          {!loadingNewFriend && !includeLabel && (
            <Text
              style={[
                styles.displaySelected,
                { color: themeAheadOfLoading.fontColorSecondary },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(friendLoaded && `Switch friend? `) ||
                "Which friend is this for?"}
            </Text>
          )}
        </View>
        <View style={[styles.selectorButtonContainer]}>
          <TouchableOpacity
            onPress={openModal}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Friend selector button"
          >
            <View style={{ paddingHorizontal: "0%" }}>
              <ProfileTwoUsersSvg
                height={iconSize}
                width={iconSize}
                color={
                  loadingNewFriend
                    ? "transparent"
                    : color || themeAheadOfLoading.fontColorSecondary
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
 
      <FriendModal 
        isVisible={isFriendMenuModalVisible}
        toggle={toggleModal} 
       
        onCancel={toggleModal}
        confirmText="Reset All"
        cancelText="Back"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "auto",
    maxHeight: 40,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 2,

    borderRadius: 0,
  },
  loadingWrapper: {
    paddingRight: "14%",
  },
  displaySelectedContainer: {
    alignItems: "flex-end",
    width: "100%",
    flex: 1,
  },
  displaySelected: {
    // fontFamily: 'Poppins-Regular',
    fontWeight: "bold",
    fontSize: 15,
    zIndex: 2,
  },
  selectorButtonContainer: {
    alignItems: "flex-end",
  },
  friendContainer: {
    flex: 1, // Make sure it takes up the full available space per column
    margin: 4, // Optional: Adjust margin to control space around each item
    justifyContent: "center",
    alignItems: "center",
    maxWidth: Dimensions.get("window").width / 3 - 20, // Divide by 3 to spread items evenly
  },
  row: {
    borderRadius: 5,
  }, 
});

export default FriendSelectModalVersionButtonOnly;
