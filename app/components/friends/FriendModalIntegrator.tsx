import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import ProfileTwoUsersSvg from "@/app/assets/svgs/profile-two-users.svg";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import FriendModal from "../alerts/FriendModal";

interface FriendModalIntegratorProps {
  addToPress: () => void;
  color: string;
  addToOpenModal: () => void;
  includeLabel: boolean;
  navigationDisabled: boolean;
  iconSize: number;
  width: string;
}

const FriendModalIntegrator: React.FC<FriendModalIntegratorProps> = ({
  addToPress,
  color,
  addToOpenModal,
  includeLabel = false,
  navigationDisabled = false,
  iconSize = 22,
  width = "60%",
}) => {
  const { themeStyles } = useGlobalStyle(); 
  const { selectedFriend, friendLoaded,  loadingNewFriend } =
    useSelectedFriend();
  const { themeAheadOfLoading } =
    useFriendList();
  const [isFriendMenuModalVisible, setIsFriendMenuModalVisible] =
    useState(false);
  //const [forceUpdate, setForceUpdate] = useState(false);

 
 
  //kind of aggressive that it tries to refocus every time it toggles whether open or closed
  // but android is being a butt about opening the keyboard
  const toggleModal = () => {
    if (addToPress) {
      addToPress();
    }

    setIsFriendMenuModalVisible(false);
  };

  const openModal = () => {
    if (addToOpenModal) {
      addToOpenModal();
    }

    setIsFriendMenuModalVisible(true);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          height: "auto",
          maxHeight: 40,
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 2,

          borderRadius: 0,
          width: width,
        }}
      >
        <View style={{ alignItems: "flex-end", width: "100%", flex: 1 }}>
          {loadingNewFriend && (
            <View style={{ paddingRight: "14%" }}>
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
                {
                  color: selectedFriend ? themeAheadOfLoading.fontColorSecondary : themeStyles.primaryText.color,
                  fontWeight: "bold",
                  fontSize: 15,
                  zIndex: 2,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(friendLoaded && `For:  ${selectedFriend?.name}`) ||
                "pick friend"}
            </Text>
          )}

          {!loadingNewFriend && !includeLabel && (
            <Text
              style={[
                {
                  fontWeight: "bold",
                  fontSize: 15,
                  zIndex: 2,
                  color: themeAheadOfLoading.fontColorSecondary,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(friendLoaded && `Switch friend? `) ||
                "Which friend is this for?"}
            </Text>
          )}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={openModal}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Friend selector button"
          >
            <View style={{  paddingLeft: 6 }}>
              <ProfileTwoUsersSvg
                height={iconSize}
                width={iconSize}
                color={
                  loadingNewFriend
                    ? "transparent"
                    : selectedFriend ? color || themeAheadOfLoading.fontColorSecondary :
                    themeStyles.primaryText.color
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
        navigationDisabled={navigationDisabled}
        confirmText="Reset All"
        cancelText="Back"
      />
    </>
  );
}; 

export default FriendModalIntegrator;
