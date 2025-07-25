import React from "react";
import { View, Text, Pressable } from "react-native";


import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "../../appwide/spinner/LoadingPage";
import { MaterialIcons  } from "@expo/vector-icons";

const FriendProfileButton = ({onPress}) => {
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
  } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList(); 
 

  const circleSize = 27;
  const iconSize = 28;

 

 
  const renderProfileIcon = () => {
    // if (Array.isArray(profileIconColor) && profileIconColor.length === 2) {
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
        <Pressable
         onPress={onPress}
         // onPress={onPress? onPress : () => navigation.navigate("FriendFocus")}
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
               
              /> 
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default FriendProfileButton;
