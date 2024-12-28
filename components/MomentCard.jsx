//<LeafGreenOutlineSvg color={manualGradientColors.lightColor} width={80} height={80} />
     

import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useCapsuleList } from "../context/CapsuleListContext";
import SlideToAdd from "../components/SlideToAdd";
import FormatMonthDay from "../components/FormatMonthDay";
import CheckmarkOutlineSvg from "../assets/svgs/checkmark-outline.svg";
import LeafGreenOutlineSvg from "../assets/svgs/leaf-green-outline.svg";
import LeavesOnBranchSolidSvg from "../assets/svgs/leaves-on-branch-solid.svg";
import LeafSolidSvg from "../assets/svgs/leaf-solid.svg";

import { Easing } from "react-native-reanimated";

const MomentCard = ({
  onPress,
  onSliderPull,
  moment,
  heightToMatchWithFlatList, //match THIS if using FlatList
  marginToMatchWithFlatList,
  numberOfLinesToMatchWithFlatList,
  backgroundColor,
  borderRadius,
  borderColor,
  size,
  sliderVisible,
  disabled = false, 
}) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const { updateCapsuleMutation, momentData } = useCapsuleList();

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
      console.log("Animation finished, updating cache!");
      //updateCacheWithNewPreAdded();  // Call updateCacheWithNewPreAdded once animation is done
    });
  };

  //Added from chatGPT
  const capitalizeFirstFiveWords = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    const capitalizedWords = words
      .slice(0, 5)
      .map((word) => word.toUpperCase())
      .concat(words.slice(3));
    return capitalizedWords.join(" ");
  };

  //Added from chatGPT
  const uppercaseFirstLine = (text) => {
    if (!text) return "";
    const lines = text.split("\n"); // Split text into lines
    if (lines.length > 0) {
      lines[0] = lines[0].toUpperCase(); // Capitalize the first line
    }
    return lines.join("\n"); // Join the lines back together
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
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          transform: [{ translateX }],
        },
      ]}
    >
      <TouchableOpacity
        style={{ width: "100%", flex: 1 }}
        onPress={!disabled ? onPress : null} // Disable onPress if the button is disabled
        disabled={disabled}
      >
        <View style={styles.iconAndMomentContainer}>
          <View style={styles.categoryHeader}>
            <View style={{ flexDirection: "row", width: '100%' }}>
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
          <View style={[styles.textWrapper, {borderRadius: borderRadius}]}>
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
          targetIcon={CheckmarkOutlineSvg}
          disabled={sliderVisible !== 1}
        />
      </Animated.View>
      <Animated.View style={[styles.leafTransform, {opacity: sliderVisible }]}>
        <LeavesOnBranchSolidSvg   color={manualGradientColors.lightColor} width={80} height={80} />
     
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    width: "100%",
    paddingHorizontal: "5%",
    paddingTop: "6%",
    paddingBottom: "5%",
    flexDirection: "column",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  leafTransform: {
    position: "absolute",
    zIndex: 0,
    bottom: -20,
    right: 4,
    transform: [
      { //rotate: "34deg",
        rotate: "2deg",
       },
      // Flip horizontally (mirror image)
    ], 
  },
  sliderContainer: {
    height: 24,
    borderRadius: 20,
    zIndex: 3,
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
    //fontFamily: 'Poppins-Regular',
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 22,
    alignSelf: "left",
  },
  textWrapper: { 
    flexGrow: 1,
    textAlign: "left",
    // justifyContent: 'center',
    width: "100%", 
    
  },
  categoryText: {
    fontSize: 13,
    flexShrink: 1,
    lineHeight: 21,
    color: "darkgrey",
    overflow: "hidden",
    textTransform: 'uppercase',
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
