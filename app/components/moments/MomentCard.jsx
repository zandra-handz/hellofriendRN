//<LeafGreenOutlineSvg color={manualGradientColors.lightColor} width={80} height={80} />

import React, { useEffect, useState } from "react";
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

import FlashAnim from "@/app/animations/FlashAnim";
import FlashAnimNonCircle from "@/app/animations/FlashAnimNonCircle";
import BobbingAnim from "@/app/animations/BobbingAnim";
import { useFriendList } from "@/src/context/FriendListContext";

const MomentCard = ({
  distanceFromTop,
  index,
  onPress,
  onSliderPull,
  scrollY,
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
  highlightsVisible,
  disabled = false,
}) => {
  const {
    themeStyles,
    gradientColors,
    gradientColorsHome,
    manualGradientColors,
  } = useGlobalStyle();
  const { updateCapsuleMutation, momentData } = useCapsuleList();
  const { themeAheadOfLoading } = useFriendList();

  const indexIsEven = index % 2 === 0;

  const fillColor = gradientColorsHome.darkColor; // themeStyles.genericTextBackgroundShadeTwo.backgroundColor;
  const strokeColor = gradientColors.darkColor; //themeAheadOfLoading.lightColor;
  const momentBackgroundColor = gradientColors.lightColor;
  const momentTextColor = gradientColorsHome.darkColor; //    themeStyles.genericText,
  const categoryTextColor = gradientColorsHome.darkColor; //    themeStyles.genericText,
  const [ showAnimations, setShowAnimations ] = useState();
 
  useEffect(() => {
    if (updateCapsuleMutation.isSuccess && moment.id === momentData?.id) {
      triggerAnimation(); 
    }
  }, [updateCapsuleMutation.isSuccess]);


useEffect(() => {
  let timeoutId;

  setShowAnimations(false);

  const listener = distanceFromTop.addListener(({ value }) => {
    // Clear any previous timeout to avoid stacking
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setShowAnimations(value > 0.89);
    }, 100); // 1 second delay
  });

  return () => {
    // Clean up the listener and any pending timeout
    distanceFromTop.removeListener(listener);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [distanceFromTop]);

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
          top: -20,
          // backgroundColor: 'pink',
          flex: 1,
          //height: heightToMatchWithFlatList,
          width: "100%",
          opacity: sliderVisible,
          right: indexIsEven ? 70 : null,
          left: indexIsEven ? null : 70,
          zIndex: 0,
          transform: [{ scaleX: indexIsEven ? 1 : -1 }, { rotate: "0deg" }],
        }}
      >
        <LeafDoubleOutlineInvertedSvg
          fill={fillColor}
          stroke={strokeColor}
          height={380}
          width={470}
          strokeWidth={3}
        />
      </Animated.View>
      <TouchableOpacity
        style={{ width: "100%", flex: 1 }}
        onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
        disabled={disabled}
      >
        <View style={styles.iconAndMomentContainer}>
          {/* <Animated.View
            style={[
              styles.categoryHeader,
              {
                opacity: highlightsVisible,
                backgroundColor: momentBackgroundColor,
                padding: 6,

                borderRadius: 10,
                height: 60,
                //right: !indexIsEven ? 42 : null,
               // left: !indexIsEven ? 266 : 10,
                top: 10,
                width: 'auto',
              },
            ]}
          >
            <View style={{ flexDirection: "row", width: "100%" }}>
              <Animated.Text
                style={[
                  styles.categoryText,
                  { color: categoryTextColor, opacity: sliderVisible },
                ]}
              >
                #
                {moment.typedCategory.length > 12
                  ? `${moment.typedCategory.substring(0, 12)}...`
                  : moment.typedCategory}{" "}
                • added{" "}
                <FormatMonthDay
                  date={moment.created}
                  fontSize={13}
                  fontFamily={"Poppins-Regular"}
                  parentStyle={[
                    styles.categoryText,
                    { color: categoryTextColor, opacity: sliderVisible },
                  ]}
                  opacity={sliderVisible}
                />
              </Animated.Text>
            </View>
          </Animated.View> */}

 {showAnimations && (
          <BobbingAnim showAnimation={showAnimations} bobbingDistance={4} duration={2000}>
            <Animated.View
              style={[
                {
                  borderRadius: borderRadius, 
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  flexDirection: "row",
                  width: "100%", 
                  opacity: highlightsVisible, 
                },
              ]}
            >
             
                
              <FlashAnimNonCircle
                circleColor={momentBackgroundColor}
                flashToColor={manualGradientColors.lighterLightColor}
                staticColor={momentBackgroundColor}
                //circleTextSize={40} 
                minHeight={80} // mot in use but can be hooked up
                returnAnimation={showAnimations}
              >
                <View
                  style={[
                    styles.textWrapper,
                    {
                      height: "auto",
                      maxHeight: 200,
                      // height: 100,
                      width: "100%",
                      padding: 12,
                      borderRadius: 10,
                    },
                  ]}
                >
                                <Animated.Text
                style={[
                  styles.categoryText,
                  { color: categoryTextColor, opacity: sliderVisible },
                ]}
              >
                #
                {moment.typedCategory.length > 12
                  ? `${moment.typedCategory.substring(0, 12)}...`
                  : moment.typedCategory}{" "}
                • added{" "}
                <FormatMonthDay
                  date={moment.created}
                  fontSize={13}
                  fontFamily={"Poppins-Regular"}
                  parentStyle={[
                    styles.categoryText,
                    { color: categoryTextColor, opacity: sliderVisible },
                  ]}
                  opacity={sliderVisible}
                />
              </Animated.Text>
                  <Animated.Text
                    numberOfLines={numberOfLinesToMatchWithFlatList}
                    style={[
                      styles.momentText,

                      {
                        color: momentTextColor,
                        fontSize: size,
                        opacity: sliderVisible,
                      },
                    ]}
                  >
                    {capitalizeFirstFiveWords(moment.capsule)}
                  </Animated.Text>
                </View>
              </FlashAnimNonCircle>
               
            </Animated.View>
          </BobbingAnim>
             )}
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
    position: "absolute",
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
    fontFamily: "Poppins-Bold",
    //  flexShrink: 1,
    fontWeight: "bold",
    fontSize: 10,
    lineHeight: 18,
    alignSelf: "left",
  },
  textWrapper: {
    // flexGrow: 1,
    textAlign: "left",
    position: "absolute",
    // justifyContent: 'center',
    width: "100%",
    // overflow: 'hidden',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    flexShrink: 1,
    //fontWeight: "bold",
    lineHeight: 16,
    color: "darkgrey",
    overflow: "hidden",
    textTransform: "uppercase",
  },
  categoryHeader: {
    position: "absolute",

    flexDirection: "row",
    alignContent: "left",
    justifyContent: "flex-start",

    height: "auto",
    flexWrap: "flex",
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
