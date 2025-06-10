import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "../../appwide/spinner/LoadingPage";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const FriendProfileButton = () => {
  const {
    selectedFriend,
    friendLoaded,
    friendDashboardData,
    loadingNewFriend,
  } = useSelectedFriend();
  const {
    themeStyles,
    appFontStyles,
    appContainerStyles,
    manualGradientColors,
  } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();
  const [profileIconColor, setProfileIconColor] = useState();
  const navigation = useNavigation();

  const circleSize = 27;
  const iconSize = 28;

  useEffect(() => {
    if (
      themeAheadOfLoading.lightColor !==
      themeStyles.genericTextBackground.backgroundColor
    ) {
      setProfileIconColor([
        themeAheadOfLoading.darkColor || manualGradientColors.darkColor,
        themeAheadOfLoading.lightColor || manualGradientColors.lightColor,
      ]);
    } else {
      setProfileIconColor([
        themeStyles.genericText.color,
        themeStyles.genericText.color,
      ]);
    }
    renderProfileIcon();
  }, [selectedFriend, themeStyles]);

  const navigateToFriendFocus = () => {
    if (selectedFriend) {
      navigation.navigate("FriendFocus");
    }
  };

  // const handleLongPress = () => {
  //   // Show an alert asking if they want to deselect the friend
  //   Alert.alert(
  //     'Deselect Friend',
  //     'Do you want to deselect your friend?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Yes', onPress: handleDeselect()}, // Deselect friend function
  //     ],
  //     { cancelable: true }
  //   );
  // };
  //to restore gradient: [1] - [0]
  const renderProfileIcon = () => {
    if (Array.isArray(profileIconColor) && profileIconColor.length === 2) {
      return (
        <View
          style={{
            backgroundColor: themeAheadOfLoading.lightColor,
            borderRadius: 16,
            width: circleSize,
            height: circleSize,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={[
              appFontStyles.friendProfileButtonText,
              {
                color:
                  friendLoaded && friendDashboardData && selectedFriend
                    ? themeAheadOfLoading.fontColorSecondary
                    : "black",
              },
            ]}
          >
            {selectedFriend && friendLoaded && selectedFriend.name.charAt(0)}
          </Text>
        </View>
      );
    }
  };

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "row",
      }}
    >
      {loadingNewFriend && (
        <View style={appContainerStyles.loadingFriendProfileButtonWrapper}>
          <LoadingPage
            loading={loadingNewFriend}
            color={themeAheadOfLoading.darkColor}
            spinnerType="flow"
            spinnerSize={30}
            includeLabel={false}
          />
        </View>
      )}

      {!loadingNewFriend && (
        <TouchableOpacity
          onPress={() => navigation.navigate("FriendFocus")}
          style={{ flex: 1 }}
        >
          <View>
            {renderProfileIcon()}
            <View
              style={{
                position: "absolute",
                top: -13,
               right: 13,
                zIndex: 1000,
              }}
            >
              <MaterialIcons
                name="display-settings"
                size={iconSize - 2}
                color={themeStyles.footerIcon.color}
                fill="black"
              /> 
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FriendProfileButton;
