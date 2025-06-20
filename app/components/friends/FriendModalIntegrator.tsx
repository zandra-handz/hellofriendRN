import React, { useState } from "react";
import { View, Text, TouchableOpacity, DimensionValue } from "react-native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useFriendList } from "@/src/context/FriendListContext";
import ProfileTwoUsersSvg from "@/app/assets/svgs/profile-two-users.svg";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import FriendModal from "../alerts/FriendModal";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

interface FriendModalIntegratorProps {
  addToPress: () => void;
  color: string;
  height: DimensionValue;
  addToOpenModal: () => void;
  includeLabel: boolean;
  navigationDisabled: boolean;
  useGenericTextColor?: boolean;
  iconSize: number;
  width: DimensionValue;
  customLabel: string | null;
  customFontStyle: object | null;
}

const FriendModalIntegrator: React.FC<FriendModalIntegratorProps> = ({
  addToPress,
  color,
  height = "auto",
  customLabel = "",
  customFontStyle,
  addToOpenModal,
  useGenericTextColor = false,
  includeLabel = false,
  navigationDisabled = false,
  iconSize = 22,
  width = "auto",
}) => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend, friendLoaded, loadingNewFriend } =
    useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const [isFriendMenuModalVisible, setIsFriendMenuModalVisible] =
    useState(false);
  //const [forceUpdate, setForceUpdate] = useState(false);

  const firstSelectLabel = customLabel ? customLabel : `Pick friend: `;

  const defaultLabelStyle = {
    fontWeight: "bold",
    fontSize: 15,
  };

  //kind of aggressive that it tries to refocus every time it toggles whether open or closed
  // but android is being a butt about opening the keyboard
  const toggleModal = () => {
    // console.log("toggle modal triggered");
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
      <TouchableOpacity
        onPress={openModal}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Friend selector button"
        style={{ 
          flexDirection: "row",
          height: height,  
          alignItems: "center",  
 
          width: width,
        }}
      >
        <View
          style={{ 
            width: "auto",
                        height: "100%",
            flexDirection: 'row',
            alignItems: 'flex-end',  
          
            
           // flex: 1,
          }}
        >
          {loadingNewFriend && (
            <View style={{ paddingRight: "14%" }}>
              <LoadingPage
                loading={loadingNewFriend}
                spinnerType="flow"
                spinnerSize={30}
                color={themeAheadOfLoading.darkColor}
                includeLabel={false}
              />
            </View>
          )}
          {!loadingNewFriend && includeLabel && (
            <Text
              style={[
                customFontStyle ? customFontStyle : defaultLabelStyle,
                {
                  color:
                    selectedFriend && !useGenericTextColor
                      ? themeAheadOfLoading.fontColorSecondary
                      : themeStyles.primaryText.color,

                  zIndex: 2,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(friendLoaded &&
                !useGenericTextColor &&
                `For:  ${selectedFriend?.name}`) ||
              friendLoaded
                ? "switch friend"
                : firstSelectLabel}
            </Text>
          )} 

          <View style={{ paddingLeft: 0, marginLeft: 6}}>
            <MaterialCommunityIcons
            name="account-switch-outline"
            size={iconSize}
              // height={iconSize}
              // width={iconSize}
              color={
                loadingNewFriend
                  ? "transparent"
                  : selectedFriend && !useGenericTextColor
                    ? color || themeAheadOfLoading.fontColorSecondary
                    : themeStyles.primaryText.color
              }
            />
          </View> 


        </View> 

      </TouchableOpacity>

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
