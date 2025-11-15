import React from "react";
import { View, Text, StyleSheet } from "react-native";

import LoadingPage from "../../appwide/spinner/LoadingPage";
import SvgIcon from "@/app/styles/SvgIcons";
import GlobalPressable from "../../appwide/button/GlobalPressable";
import useFriendDash from "@/src/hooks/useFriendDash";
// import { useFriendDash } from "@/src/context/FriendDashContext";
import manualGradientColors from "@/app/styles/StaticColors";
const FriendProfileButton = ({
  userId,
  friendId,
  friendName,
  primaryColor = "orange",

  themeColors,

  onPress,
}) => {
  const { dashLoaded, loadingDash, friendDash } = useFriendDash({
    userId: userId,
    friendId: friendId,
  });

  const circleSize = 27;
  const iconSize = 28;

  const renderProfileIcon = () => {
    return (
      <View
        style={{
          backgroundColor: friendId
            ? themeColors.lightColor
            : manualGradientColors.lightColor,
          borderRadius: 999,
          width: friendId ? circleSize : circleSize + 20,
          height: friendId ? circleSize : circleSize + 20,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        {!friendId && !loadingDash && (
          <View style={styles.treeWrapper}>
            <SvgIcon
              name={"tree"}
              size={45}
              color={manualGradientColors.homeDarkColor}
            />
          </View>
        )}
        <Text
          style={[
            styles.friendProfileButtonText,
            {
              color:
                dashLoaded && friendDash && friendId
                  ? themeColors.fontColorSecondary
                  : "black",
            },
          ]}
        >
          {friendId && dashLoaded && friendName && friendName.charAt(0)}
        </Text>
      </View>
    );
    // }
  };

  return (
    <View style={styles.container}>
      {loadingDash && (
        <View style={styles.loadingFriendProfileButtonWrapper}>
          <LoadingPage
            loading={true}
            color={themeColors.darkColor}
            spinnerType="flow"
            spinnerSize={30}
            includeLabel={false}
          />
        </View>
      )}

      {!loadingDash && (
        <GlobalPressable
          onPress={onPress}
          // onPress={onPress? onPress : () => navigation.navigate("FriendFocus")}
          style={{}}
        >
          <View>
            {renderProfileIcon()}
            <View
              style={styles.timerWrapper}
            >
              {friendId && (
                <SvgIcon
                  name="timer_cog"
                  size={iconSize - 2}
                  color={primaryColor}
                />
              )}
            </View>
          </View>
        </GlobalPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  treeWrapper: {
    flex: 1,
    position: "absolute",
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    top: 0,
    bottom: 0,
  },
  timerWrapper: {
    position: "absolute",
    top: -13,
    right: 13,
    zIndex: 1000,
  },
  loadingFriendProfileButtonWrapper: {
    flex: 0.4,
    paddingRight: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  friendProfileButtonText: {
    fontSize: 17,
    paddingVertical: 0,
    alignSelf: "center",
    fontFamily: "Poppins-Bold",
    paddingLeft: 0,
  },
});

export default FriendProfileButton;
