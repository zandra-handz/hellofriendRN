import React from "react";
import { View, Text, Pressable } from "react-native";
 
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "../../appwide/spinner/LoadingPage";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../../appwide/button/GlobalPressable";
 

const FriendProfileButton = ({ onPress }) => {
  const {
    selectedFriend,
    friendLoaded,
    friendDashboardData,
    loadingNewFriend,
  } = useSelectedFriend();
  const { themeStyles, appFontStyles, appContainerStyles, manualGradientColors } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendStyle();


  const circleSize = 27;
  const iconSize = 28;

  const renderProfileIcon = () => {
    // if (Array.isArray(profileIconColor) && profileIconColor.length === 2) {
    return (
      <View
        style={{
          backgroundColor: selectedFriend ? themeAheadOfLoading.lightColor : manualGradientColors.lightColor,
          borderRadius: 999,
          width: selectedFriend ? circleSize : circleSize + 20,
          height: selectedFriend ? circleSize : circleSize + 20,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        {!selectedFriend && !loadingNewFriend && (
          <View
            style={{
              flex: 1,
              position: "absolute",
              right: 0,
              left: 0,
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
              top: 0,
              bottom: 0,
              // backgroundColor: "pink",
            }}
          >
            <MaterialCommunityIcons
              name={"tree"}
              size={45}
              color={manualGradientColors.homeDarkColor}
            />
          </View>
        )}
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
    // }
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
        <GlobalPressable
          onPress={onPress}
          // onPress={onPress? onPress : () => navigation.navigate("FriendFocus")}
          style={{   }}
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
              {selectedFriend && (
                <MaterialIcons
                  name="display-settings"
                  size={iconSize - 2}
                  color={themeStyles.footerIcon.color}
                />
              )}
            </View>
          </View>
        </GlobalPressable>
      )}
    </View>
  );
};

export default FriendProfileButton;
