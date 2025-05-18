//<LeafGreenOutlineSvg color={manualGradientColors.lightColor} width={80} height={80} />

import React, { useEffect, useLayoutEffect, useState } from "react";
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
 import MomentLeavesUI from "./MomentLeavesUI";
import FlashAnimNonCircle from "@/app/animations/FlashAnimNonCircle";
import BobbingAnim from "@/app/animations/BobbingAnim";
import { useFriendList } from "@/src/context/FriendListContext";
import { useSharedValue  } from "react-native-reanimated";

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
  borderRadius, 
  borderColor,
  size,
  sliderVisible,
  highlightsVisible,
  disabled = false,
  currentVisibleIndex, 
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

  const isFirstItem = index + 1 === 1;
  //console.log(isFirstItem);
  const fillColor = gradientColorsHome.darkColor; // themeStyles.genericTextBackgroundShadeTwo.backgroundColor;
  const strokeColor = gradientColors.darkColor; //themeAheadOfLoading.lightColor;
  const momentBackgroundColor = gradientColors.lightColor;
  const momentTextColor = gradientColorsHome.darkColor; //    themeStyles.genericText,
  const categoryTextColor = gradientColorsHome.darkColor; //    themeStyles.genericText,
  const [showAnimations, setShowAnimations] = useState(isFirstItem);
  
  
  useEffect(() => {

    if (!currentVisibleIndex) return;
  
      // console.log(currentVisibleIndex, index);
      // console.log(currentVisibleIndex === index);

      const isVisible = currentVisibleIndex === index;

      if (showAnimations != isVisible) {
         setShowAnimations(isVisible);

      } 
    

  }, [currentVisibleIndex]);
  
 

  useEffect(() => {
    if (updateCapsuleMutation.isSuccess && moment.id === momentData?.id) {
      triggerAnimation();
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
       // themeStyles.genericTextBackgroundShadeTwo,
        {
          height: heightToMatchWithFlatList,
          marginBottom: marginToMatchWithFlatList,
          borderRadius: borderRadius,
          // paddingHorizontal: paddingHorizontal,
          // paddingTop: paddingTop,
          // paddingBottom: paddingBottom,
         // backgroundColor: 'red',
          borderColor: borderColor,
          transform: [{ translateX }],
        },
      ]}
    >
      <MomentLeavesUI 
      fillColor={fillColor}
      strokeColor={strokeColor}
      height={heightToMatchWithFlatList}
      opacity={sliderVisible}
      flipHorizontally={indexIsEven}
      width={'100%'}
      largeLeafSize={400}
      smallLeafSize={420}


      /> 
      <TouchableOpacity
        style={{ width: "100%", flex: 1 }}
        onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
        disabled={disabled}
      >
        <View style={styles.iconAndMomentContainer}>
        

          {showAnimations && (
            <BobbingAnim
              showAnimation={showAnimations}
              bobbingDistance={4}
              duration={2000}
            >
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
                  returnAnimation={true}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", 
    flexDirection: "column",
    borderWidth: StyleSheet.hairlineWidth,

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
