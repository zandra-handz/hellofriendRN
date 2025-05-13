//<LeafGreenOutlineSvg color={manualGradientColors.lightColor} width={80} height={80} />

import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SlideToAdd from "../foranimations/SlideToAdd";
import FormatMonthDay from "@/app/components/appwide/format/FormatMonthDay";
import CheckmarkOutlineSvg from "@/app/assets/svgs/checkmark-outline.svg";
import LeavesOnBranchSolidSvg from "@/app/assets/svgs/leaves-on-branch-solid.svg";
import LeafSingleOutlineInvertedSvg from "@/app/assets/svgs/leaf-single-outline-inverted";
import LeafDoubleOutlineInvertedSvg from "@/app/assets/svgs/LeafDoubleOutlineInvertedSvg";
import { Easing } from "react-native-reanimated";

import { useFriendList } from "@/src/context/FriendListContext";

const MomentCard = ({
  key, // not using? item.id from parent
  index,
  onPress,
  onSliderPull,
  moment,
  heightToMatchWithFlatList, //match THIS if using FlatList
  marginToMatchWithFlatList,
  numberOfLinesToMatchWithFlatList,
  backgroundColor,
  borderRadius,
  paddingHorizontal = "5%",
  paddingTop = "6%",
  paddingBottom = "5%",
  borderColor,
  size,
  sliderVisible,
  disabled = false,
}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { updateCapsuleMutation, momentData } = useCapsuleList();
  const { themeAheadOfLoading } = useFriendList();

  const indexIsEven = index % 2 === 0;

  useEffect(() => {
    if (updateCapsuleMutation.isSuccess && moment.id === momentData?.id) {
      triggerAnimation();
      console.log("removed triggering animation in moment card for now");
    }
  }, [updateCapsuleMutation.isSuccess]);

  const translateX = new Animated.Value(0);

  const triggerAnimation = () => {
    Animated.timing(translateX, {
      toValue: 500, // Adjust to slide it off-screen
      duration: 200, // Duration of the animation
      easing: Easing.ease,
      useNativeDriver: true, // Enable native driver for better performance
    }).start(() => {
      // onComplete callback
      console.log("Animation finished!");
    });
  };

  //Added from chatGPT
  const capitalizeFirstFiveWords = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    const capitalizedWords = words
      .slice(0, 5)
      .map((word) => word.toUpperCase())
      .concat(words.slice(5));
    return capitalizedWords.join(" ");
  };

  return (
    <Animated.View
      style={[
        styles.container,
        //themeStyles.genericTextBackgroundShadeTwo,
        {
          height: heightToMatchWithFlatList,
          marginBottom: marginToMatchWithFlatList,
          borderRadius: borderRadius,
          // paddingHorizontal: paddingHorizontal,
          // paddingTop: paddingTop,
          // paddingBottom: paddingBottom,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          transform: [{ translateX }],
        },
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: -180,
          // backgroundColor: 'pink',
          flex: 1,
          //height: heightToMatchWithFlatList,
          width: "100%",
          opacity: sliderVisible,
          right: indexIsEven ? 80 : null,
          left: indexIsEven ? null : 80,
      zIndex: 0,
          transform: [
            { scaleX: indexIsEven ? 1 : -1 },
            { rotate: indexIsEven ? "20deg" : "20deg" },
            
          ],
        }}
      >
        <LeafDoubleOutlineInvertedSvg
          fill={themeStyles.genericTextBackgroundShadeTwo.backgroundColor}
          stroke={themeAheadOfLoading.lightColor}
          height={470}
          width={470}
          strokeWidth={5}
        />
      </Animated.View>
      <TouchableOpacity
        style={{ width: "100%", flex: 1 }}
        onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
        disabled={disabled}
      >
        <View style={styles.iconAndMomentContainer}>
          <View style={styles.categoryHeader}>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <Animated.Text
                style={[
                  styles.categoryText,
                  { color: "darkgrey", opacity: sliderVisible },
                ]}
              >
                {moment.typedCategory.length > 20
                  ? `${moment.typedCategory.substring(0, 20)}...`
                  : moment.typedCategory}{" "}
                • added{" "}
              </Animated.Text>
              <FormatMonthDay
                date={moment.created}
                fontSize={13}
                fontFamily={"Poppins-Regular"}
                parentStyle={styles.categoryText}
                opacity={sliderVisible}
              />
            </View>
          </View>
          <View
            style={[
              styles.textWrapper,
              {
                borderRadius: borderRadius,
                paddingLeft: indexIsEven ? 100 : 40,
                paddingRight: indexIsEven ? null : 130,
                width: 300,
                top: indexIsEven ? 68 : 58,
              },
            ]}
          >
            <Animated.Text
              numberOfLines={numberOfLinesToMatchWithFlatList}
              style={[
                styles.momentText,
                themeStyles.genericText,
                { fontSize: size, opacity: sliderVisible },
              ]}
            >
              {capitalizeFirstFiveWords(moment.capsule)}
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[styles.sliderContainer, { opacity: sliderVisible }]}
      >
        <SlideToAdd
          onPress={onSliderPull}
          sliderText="ADD TO HELLO"
          sliderTextSize={13}
          sliderTextVisible={sliderVisible}
          targetIcon={CheckmarkOutlineSvg}
          disabled={sliderVisible !== 1}
        />
      </Animated.View>
      {/* <Animated.View style={[styles.leafTransform, { opacity: sliderVisible }]}>
        <LeavesOnBranchSolidSvg
          color={manualGradientColors.lightColor}
          width={80}
          height={80}
        />
      </Animated.View> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: "5%",
    flexDirection: "column",
    borderWidth: StyleSheet.hairlineWidth,
    // overflow: 'hidden',
  },
  leafTransform: {
    position: "absolute",
    zIndex: 0,
    bottom: -20,
    right: 4,
    transform: [
      {
        //rotate: "34deg",
        rotate: "2deg",
      },
      // Flip horizontally (mirror image)
    ],
  },
  sliderContainer: {
    position: 'absolute',
    top: 0,
    flex: 1,
    left: 7,
    right: 0,
    height: 24, 
    borderRadius: 20,
    zIndex: 300,
    elevation: 300,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disabledContainer: {
    opacity: 0.5,
  },
  iconAndMomentContainer: {
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
    backgroundColor: "transparent",
  },
  momentText: {
    fontFamily: "Poppins-Regular",
    flexShrink: 1,
    fontSize: 10,
    lineHeight: 22,
    alignSelf: "left",
  },
  textWrapper: {
    flexGrow: 1,
    textAlign: "left",
    // justifyContent: 'center',
    width: "100%",
    // overflow: 'hidden',
  },
  categoryText: {
    fontSize: 13,
    flexShrink: 1,
    lineHeight: 21,
    color: "darkgrey",
    overflow: "hidden",
    textTransform: "uppercase",
  },
  categoryHeader: {
    paddingBottom: "3%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    width: "100%",
    minHeight: 30,
    height: "auto",
    maxHeight: 50,
  },
  iconContainer: {
    justifyContent: "center",
  },
  creationDateSection: {
    borderRadius: 20,
    paddingHorizontal: "4%",
    paddingVertical: "4%",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    zIndex: 2,
  },
});

export default MomentCard;
