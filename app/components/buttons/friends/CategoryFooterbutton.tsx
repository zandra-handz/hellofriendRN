import React from "react";
import { View, StyleSheet } from "react-native";

import SvgIcon from "@/app/styles/SvgIcons";
import GlobalPressable from "../../appwide/button/GlobalPressable";

import manualGradientColors from "@/app/styles/StaticColors";
const CategoryFooterButton = ({ onPress }) => {
  const circleSize = 27;

  const renderProfileIcon = () => {
    return (
      <View
        style={[ styles.outerTreeWrapper, {
          backgroundColor: manualGradientColors.lightColor,
          width: circleSize + 20,
          height: circleSize + 20,
          borderRadius: 999, 
        }]}
      >
        <View style={styles.treeWrapper}>
          <SvgIcon
            name={"tree"}
            size={45}
            color={manualGradientColors.homeDarkColor}
          />
        </View>
      </View>
    );
    // }
  };

  return (
    <View style={styles.container}>
      <GlobalPressable onPress={onPress} style={{}}>
        <View>
          {renderProfileIcon()}
          <View style={styles.timerWrapper}></View>
        </View>
      </GlobalPressable>
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
  outerTreeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
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

export default CategoryFooterButton;
