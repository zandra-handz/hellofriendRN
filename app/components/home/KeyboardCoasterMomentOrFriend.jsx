import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import BackArrowLongerStemSvg from "@/app/assets/svgs/back-arrow-longer-stem.svg";
import ActionUnlockedButton from "../appwide/button/ActionUnlockedButton";

const KeyboardCoasterMomentOrFriend = ({
  onPress,
  isFriendSelected,
  showMomentScreenButton,
  borderRadius = 20,
  borderColor = "transparent",
  maxHeight = 100,
  isKeyboardVisible,
}) => {
  const { manualGradientColors } = useGlobalStyle();

  return (
    <View style={styles.absoluteContainer}>
 
      {isFriendSelected && showMomentScreenButton && (
        <ActionUnlockedButton onPress={onPress} label={'Pick category'} isUnlocked={true} includeArrow={true} />
        // <TouchableOpacity
        //   onPress={onPress}
        //   style={[
        //     styles.container,
        //     {
        //       borderRadius: borderRadius,
        //       borderColor: borderColor,
        //       height: 40,
        //       maxHeight: maxHeight,
        //     },
        //   ]}
        // >
        //   <LinearGradient
        //     colors={[
        //       manualGradientColors.darkColor,
        //       manualGradientColors.lightColor,
        //     ]}
        //     start={{ x: 0, y: 0 }}
        //     end={{ x: 1, y: 1 }}
        //     style={{
        //       ...StyleSheet.absoluteFillObject,
        //     }}
        //   />

        //   <View
        //     style={{
        //       width: 60,
        //       flex: 1,
        //       flexDirection: "row",
        //       alignItems: "center",
        //       paddingHorizontal: 20,
        //       justifyContent: "flex-end",
        //     }}
        //   >
        //     <Text style={[{ fontSize: 15, fontFamily: "Poppins-Regular" }]}>
        //       finish
        //     </Text>
        //     <View
        //       style={{
        //         transform: [{ rotate: "180deg" }],
        //         paddingRight: 10,
        //         height: "100%",
        //         alignItems: "center",
        //       }}
        //     >
        //       <BackArrowLongerStemSvg
        //         height={20}
        //         width={20}
        //         color={"#121212"}
        //       />
        //     </View>
        //   </View>
        // </TouchableOpacity>
      )}

      {/* {!isFriendSelected && ( */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    // this button is only used on the home screen and features a unique option toggle
    width: "50%",
    height: 36,
    position: "absolute",
    flexDirection: "row",
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    bottom: 10,
    right: 0,
  },
  container: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    alignContent: "center",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
});

export default KeyboardCoasterMomentOrFriend;
