import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
// import BobbingAnim from "../../../animations/BobbingAnim";
import { MaterialIcons } from "@expo/vector-icons";
import FlashAnim from "../../../animations/FlashAnim";
// import {
//   useSharedValue,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";

const MomentsStaticButton = ({
  height = 50,
  iconSize = 36,
  iconColor = "black",
  countColor = "white",
  circleColor = "red",
  countTextSize = 12,
  onPress,
}) => {
  const { capsuleCount } = useCapsuleList();
//   const progress = useSharedValue(1);
//   const [animating, setAnimating] = React.useState(false);

  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => {}}
      style={[styles.container, { height: height }]}
    >
      <View style={styles.animatedContainer}>
        <View
          style={{
            backgroundColor: "transparent",
            flex: 1,
            width: "100%",
            justifyContent: "center",
          }}
        >
                    <MaterialIcons
                      name="tips-and-updates"
                      size={iconSize}
                      color={iconColor}
                      />
          {/* <LeavesTwoFallingOutlineThickerSvg
            height={iconSize}
            width={iconSize}
            color={iconColor}
          /> */}
          <View style={{ top: "-7%", right: "1%", position: "absolute" }}>
            <FlashAnim
              circleColor={circleColor}
              circleTextSize={countTextSize}
              countColor={countColor}
            >
              {capsuleCount}
            </FlashAnim>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  animatedContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    width: "100%",
    flex: 1,
  },
  countText: {
    fontFamily: "Poppins-Bold",
  },
});

export default MomentsStaticButton;
