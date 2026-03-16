import React from "react";
import { View, StyleSheet } from "react-native";

import SvgIcon from "@/app/styles/SvgIcons";
import GlobalPressable from "../../appwide/button/GlobalPressable";
import useUserPoints from "@/src/hooks/useUserPoints";
import AnimatedClimber from "@/app/screens/fidget/AnimatedClimber";
import manualGradientColors from "@/app/styles/StaticColors";
const CategoryFooterButton = ({ skiaFontLarge, textColor, onPress }) => {
  const circleSize = 56;

  const { totalPoints } = useUserPoints();

  const renderProfileIcon = () => {
    return (
      <View
        style={[
          styles.outerTreeWrapper,
          {
            borderColor: manualGradientColors.lightColor,

            borderWidth: 2,
            width: circleSize,
            height: circleSize,
            borderRadius: 999,
          },
        ]}
      >
        <View style={styles.treeWrapper}>
          {skiaFontLarge && (
            <AnimatedClimber
              total={totalPoints}
              skiaFont={skiaFontLarge}
              textColor={textColor}
            />
          )}
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
    marginBottom: 18,
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
